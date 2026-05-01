<?php
/**
 * Stations service.
 * Single responsibility: CRUD for physical QR-code stations + public lookup.
 *
 * Exports: admin_stations_list, admin_stations_upsert,
 *          admin_stations_delete, public_station_get.
 */

require_once __DIR__ . '/../lib/errors.php';
require_once __DIR__ . '/../lib/audit.php';

/**
 * Normalizes a station key to a URL-safe slug.
 *
 * Rules:
 * - lowercase
 * - replace spaces/underscores with hyphens
 * - transliterate common German umlauts (ä/ö/ü/ß)
 * - strip everything except [a-z0-9-]
 * - collapse repeated hyphens and trim hyphens
 */
function normalize_station_key(string $raw): string
{
    $key = trim($raw);
    if ($key === '') return '';
    $key = mb_strtolower($key, 'UTF-8');
    $key = str_replace(['ä', 'ö', 'ü', 'ß'], ['ae', 'oe', 'ue', 'ss'], $key);
    $key = preg_replace('/[\s_]+/u', '-', $key) ?? $key;
    $key = preg_replace('/[^a-z0-9-]+/u', '', $key) ?? $key;
    $key = preg_replace('/-+/u', '-', $key) ?? $key;
    $key = trim($key, '-');
    return $key;
}

function assert_valid_station_key(string $key, string $original): void
{
    if ($key === '') {
        throw new ApiError('Station key and name are required', 400);
    }
    // Strict: slug segments separated by single hyphens.
    if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $key)) {
        throw new ApiError(
            'Invalid station key. Allowed: lowercase letters a-z, digits 0-9, hyphens (-). This is the stable URL slug embedded in QR paths; use Name for a readable label.',
            400
        );
    }
    // Help the user understand what changed.
    if ($original !== '' && $key !== $original) {
        throw new ApiError(
            "Invalid station key. Expected \"{$key}\" (stable URL slug / QR path). Received \"{$original}\". Use Name for a human-readable label.",
            400
        );
    }
}

/**
 * Lists all stations with their assigned questionnaire name.
 *
 * @param PDO $pdo
 * @return array
 */
function admin_stations_list(PDO $pdo): array
{
    $stmt = $pdo->query(
        'SELECT s.*, q.name AS questionnaire_name, q.questionnaire_key
         FROM stations s
         LEFT JOIN questionnaires q ON q.id = s.questionnaire_id
         ORDER BY s.name ASC'
    );
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Creates or updates a station.
 *
 * @param PDO      $pdo
 * @param int|null $adminUserId
 * @param array    $data
 * @return array
 * @throws ApiError
 */
function admin_stations_upsert(PDO $pdo, ?int $adminUserId, array $data): array
{
    $keyRaw = trim($data['station_key'] ?? '');
    $key = normalize_station_key($keyRaw);
    $name = trim($data['name'] ?? '');

    if (!$key || !$name) {
        throw new ApiError('Station key and name are required', 400);
    }
    assert_valid_station_key($key, $keyRaw);

    $id = isset($data['id']) ? intval($data['id']) : null;
    $description = $data['description'] ?? null;
    $floorIndex = intval($data['floor_index'] ?? 0);
    $cameraX = floatval($data['camera_x'] ?? 0);
    $cameraY = floatval($data['camera_y'] ?? 0);
    $cameraZ = floatval($data['camera_z'] ?? 0);
    $targetX = floatval($data['target_x'] ?? 0);
    $targetY = floatval($data['target_y'] ?? 0);
    $targetZ = floatval($data['target_z'] ?? 0);
    $questionnaireId = isset($data['questionnaire_id']) ? intval($data['questionnaire_id']) : null;
    $isActive = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;

    if ($id) {
        return update_station($pdo, $adminUserId, $id, $key, $name, $description, $floorIndex,
            $cameraX, $cameraY, $cameraZ, $targetX, $targetY, $targetZ, $questionnaireId, $isActive);
    }

    return create_station($pdo, $adminUserId, $key, $name, $description, $floorIndex,
        $cameraX, $cameraY, $cameraZ, $targetX, $targetY, $targetZ, $questionnaireId, $isActive);
}

/**
 * Deletes a station.
 *
 * @param PDO      $pdo
 * @param int|null $adminUserId
 * @param int      $id
 * @return array
 * @throws ApiError
 */
function admin_stations_delete(PDO $pdo, ?int $adminUserId, int $id): array
{
    $row = $pdo->prepare('SELECT * FROM stations WHERE id = :id');
    $row->execute(['id' => $id]);
    $station = $row->fetch(PDO::FETCH_ASSOC);

    if (!$station) {
        throw new ApiError('Station not found', 404);
    }

    $pdo->prepare('DELETE FROM stations WHERE id = :id')->execute(['id' => $id]);

    log_admin_action($pdo, $adminUserId, 'delete_station', "station:$id", [
        'key' => $station['station_key'],
    ]);

    return ['ok' => true];
}

/**
 * Public: looks up a station by key and returns camera/target + questionnaire info.
 *
 * @param PDO    $pdo
 * @param string $stationKey
 * @return array
 * @throws ApiError
 */
function public_station_get(PDO $pdo, string $stationKey): array
{
    $rawKey = trim($stationKey);
    if ($rawKey === '') {
        throw new ApiError('Station not found', 404);
    }

    $normalizedInput = normalize_station_key($rawKey);

    $lookup = function (string $k) use ($pdo): array|false {
        $stmt = $pdo->prepare(
            'SELECT s.*, q.questionnaire_key
             FROM stations s
             LEFT JOIN questionnaires q ON q.id = s.questionnaire_id
             WHERE s.station_key = :key
             LIMIT 1'
        );
        $stmt->execute(['key' => $k]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    };

    // Backward compatibility:
    // - Old QR codes may use legacy station_key values (spaces, umlauts, underscores, casing).
    // - New links should use the normalized slug.
    $row = $lookup($rawKey);
    if (!$row && $normalizedInput !== '') {
        $row = $lookup($normalizedInput);
    }
    if (!$row && $normalizedInput !== '') {
        // Last resort: match normalized input against normalized stored keys.
        // Stations list is small in practice; avoids breaking legacy DB keys without editing physical QR codes.
        $keysStmt = $pdo->query('SELECT station_key FROM stations');
        $keys = $keysStmt ? $keysStmt->fetchAll(PDO::FETCH_COLUMN) : [];
        foreach ($keys as $storedKey) {
            if (!is_string($storedKey) || $storedKey === '') continue;
            if (normalize_station_key($storedKey) === $normalizedInput) {
                $row = $lookup($storedKey);
                if ($row) break;
            }
        }
    }

    if (!$row) {
        throw new ApiError("Station not found: $rawKey", 404);
    }
    if (!intval($row['is_active'])) {
        throw new ApiError("Station is inactive: $rawKey", 404);
    }

    return [
        'station_key' => $row['station_key'],
        'name' => $row['name'],
        'floor_index' => intval($row['floor_index']),
        'camera' => [
            'x' => floatval($row['camera_x']),
            'y' => floatval($row['camera_y']),
            'z' => floatval($row['camera_z']),
        ],
        'target' => [
            'x' => floatval($row['target_x']),
            'y' => floatval($row['target_y']),
            'z' => floatval($row['target_z']),
        ],
        'questionnaire_key' => $row['questionnaire_key'] ?? 'default',
    ];
}

// ── Internal ────────────────────────────────────────────────────

function create_station(PDO $pdo, ?int $adminUserId, string $key, string $name, ?string $description,
    int $floorIndex, float $cx, float $cy, float $cz, float $tx, float $ty, float $tz,
    ?int $questionnaireId, int $isActive): array
{
    // Check unique key
    $existing = $pdo->prepare('SELECT COUNT(*) FROM stations WHERE station_key = :key');
    $existing->execute(['key' => $key]);
    if (intval($existing->fetchColumn()) > 0) {
        throw new ApiError("Station key already exists: $key", 400);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO stations (station_key, name, description, floor_index,
            camera_x, camera_y, camera_z, target_x, target_y, target_z,
            questionnaire_id, is_active)
         VALUES (:key, :name, :desc, :floor,
            :cx, :cy, :cz, :tx, :ty, :tz,
            :qid, :active)'
    );
    $stmt->execute([
        'key' => $key, 'name' => $name, 'desc' => $description, 'floor' => $floorIndex,
        'cx' => $cx, 'cy' => $cy, 'cz' => $cz,
        'tx' => $tx, 'ty' => $ty, 'tz' => $tz,
        'qid' => $questionnaireId, 'active' => $isActive,
    ]);

    $id = intval($pdo->lastInsertId());

    log_admin_action($pdo, $adminUserId, 'create_station', "station:$id", [
        'key' => $key, 'name' => $name,
    ]);

    return ['ok' => true, 'id' => $id];
}

function update_station(PDO $pdo, ?int $adminUserId, int $id, string $key, string $name, ?string $description,
    int $floorIndex, float $cx, float $cy, float $cz, float $tx, float $ty, float $tz,
    ?int $questionnaireId, int $isActive): array
{
    // Check unique key (exclude self)
    $existing = $pdo->prepare('SELECT COUNT(*) FROM stations WHERE station_key = :key AND id != :id');
    $existing->execute(['key' => $key, 'id' => $id]);
    if (intval($existing->fetchColumn()) > 0) {
        throw new ApiError("Station key already exists: $key", 400);
    }

    $stmt = $pdo->prepare(
        'UPDATE stations SET station_key = :key, name = :name, description = :desc, floor_index = :floor,
            camera_x = :cx, camera_y = :cy, camera_z = :cz,
            target_x = :tx, target_y = :ty, target_z = :tz,
            questionnaire_id = :qid, is_active = :active
         WHERE id = :id'
    );
    $stmt->execute([
        'key' => $key, 'name' => $name, 'desc' => $description, 'floor' => $floorIndex,
        'cx' => $cx, 'cy' => $cy, 'cz' => $cz,
        'tx' => $tx, 'ty' => $ty, 'tz' => $tz,
        'qid' => $questionnaireId, 'active' => $isActive, 'id' => $id,
    ]);

    log_admin_action($pdo, $adminUserId, 'update_station', "station:$id", [
        'key' => $key, 'name' => $name,
    ]);

    return ['ok' => true, 'id' => $id];
}
