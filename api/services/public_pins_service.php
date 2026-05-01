<?php
/**
 * Public pins service for listing and creating pins.
 * Exports: public_pins_list, public_pins_create, normalize_percent.
 */

/**
 * Returns public pins, optionally filtered by floor.
 *
 * @param PDO $pdo
 * @param int|null $floor
 * @return array
 */
function public_pins_list(PDO $pdo, ?int $floor): array
{
    $params = [];
    $where = 'WHERE pins.approved = 1';
    if ($floor !== null) {
        $where .= ' AND pins.floor_index = :floor';
        $params['floor'] = $floor;
    }
    $stmt = $pdo->prepare(
        "SELECT pins.*, GROUP_CONCAT(pin_reasons.reason_key) AS reason_keys
         FROM pins
         LEFT JOIN pin_reasons ON pin_reasons.pin_id = pins.id AND pin_reasons.question_key = 'reasons'
         $where
         GROUP BY pins.id
         ORDER BY pins.created_at DESC"
    );
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    $pins = array_map('normalize_pin_row', $rows);
    public_pins_attach_generic_answers($pdo, $pins);
    public_pins_attach_asked_questions($pdo, $pins);
    return $pins;
}

/**
 * Creates a pin from public submission.
 *
 * @param PDO $pdo
 * @param array $data
 * @return array
 * @throws ApiError
 */
function public_pins_create(PDO $pdo, array $data): array
{
    $floorIndex = isset($data['floor_index']) ? intval($data['floor_index']) : null;
    $x = isset($data['x']) ? floatval($data['x']) : null;
    $y = isset($data['y']) ? floatval($data['y']) : null;
    $z = isset($data['z']) ? floatval($data['z']) : null;

    $answers = isset($data['answers']) && is_array($data['answers']) ? $data['answers'] : $data;
    $wellbeing = isset($answers['wellbeing']) ? normalize_percent($answers['wellbeing']) : null;
    $reasons = isset($answers['reasons']) && is_array($answers['reasons']) ? $answers['reasons'] : [];
    $note = isset($answers['note']) ? trim($answers['note']) : '';
    $groupKey = isset($answers['group']) ? $answers['group'] : null;
    if (is_array($groupKey)) {
        $groupKey = $groupKey[0] ?? null;
    }
    if ($groupKey !== null) {
        $groupKey = trim((string)$groupKey);
        if ($groupKey === '') {
            $groupKey = null;
        }
    }

    if ($floorIndex === null || $x === null || $y === null || $z === null || $wellbeing === null) {
        json_error('Missing required fields', 400);
    }

    if (!empty($reasons)) {
        $placeholders = implode(',', array_fill(0, count($reasons), '?'));
        $check = $pdo->prepare(
            "SELECT option_key FROM question_options
             WHERE question_key = 'reasons' AND option_key IN ($placeholders) AND is_active = 1"
        );
        $check->execute($reasons);
        $existing = $check->fetchAll(PDO::FETCH_COLUMN);
        if (count($existing) !== count(array_unique($reasons))) {
            json_error('Invalid reasons', 400);
        }
    }

    if ($groupKey !== null) {
        $check = $pdo->prepare(
            "SELECT option_key FROM question_options
             WHERE question_key = 'group' AND option_key = :key AND is_active = 1"
        );
        $check->execute(['key' => $groupKey]);
        $existing = $check->fetchColumn();
        if (!$existing) {
            json_error('Invalid group', 400);
        }
    }

    $stationKey = isset($data['station_key']) ? trim($data['station_key']) : null;
    if ($stationKey === '') {
        $stationKey = null;
    }

    $questionnaireKey = public_pins_resolve_questionnaire_key($pdo, $stationKey);
    $askedSelection = public_pins_resolve_asked_selection($pdo, $questionnaireKey);

    $stmt = $pdo->prepare(
        'INSERT INTO pins (floor_index, position_x, position_y, position_z, wellbeing, note, group_key, station_key, questionnaire_key)
         VALUES (:floor_index, :position_x, :position_y, :position_z, :wellbeing, :note, :group_key, :station_key, :questionnaire_key)'
    );
    $stmt->execute([
        'floor_index' => $floorIndex,
        'position_x' => $x,
        'position_y' => $y,
        'position_z' => $z,
        'wellbeing' => $wellbeing,
        'note' => $note,
        'group_key' => $groupKey,
        'station_key' => $stationKey,
        'questionnaire_key' => $questionnaireKey,
    ]);

    $id = $pdo->lastInsertId();

    // Persist asked question selection (pool resolution snapshot)
    public_pins_store_asked_selection($pdo, intval($id), $questionnaireKey, $askedSelection);

    if (!empty($reasons)) {
        $insert = $pdo->prepare(
            'INSERT INTO pin_reasons (pin_id, question_key, reason_key)
             VALUES (:pin_id, :question_key, :reason_key)'
        );
        foreach ($reasons as $reasonKey) {
            $insert->execute([
                'pin_id' => $id,
                'question_key' => 'reasons',
                'reason_key' => $reasonKey,
            ]);
        }
    }

    // Store generic answers in pin_answers (for non-hardcoded questions)
    $genericAnswers = isset($data['generic_answers']) && is_array($data['generic_answers'])
        ? $data['generic_answers'] : [];
    if (!empty($genericAnswers)) {
        public_pins_store_generic_answers($pdo, intval($id), $genericAnswers);
    }

    $stmt = $pdo->prepare(
        'SELECT pins.*, GROUP_CONCAT(pin_reasons.reason_key) AS reason_keys
         FROM pins
         LEFT JOIN pin_reasons ON pin_reasons.pin_id = pins.id AND pin_reasons.question_key = "reasons"
         WHERE pins.id = :id
         GROUP BY pins.id'
    );
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    $pin = normalize_pin_row($row);
    $tmp = $pin ? [$pin] : [];
    public_pins_attach_generic_answers($pdo, $tmp);
    public_pins_attach_asked_questions($pdo, $tmp);
    return $pin;
}

/**
 * Normalizes percent input to 0-100 with 2 decimals.
 *
 * @param mixed $value
 * @return float|null
 */
function normalize_percent($value): ?float
{
    if ($value === null || $value === '') {
        return null;
    }
    if (!is_numeric($value)) {
        return null;
    }
    $numeric = floatval($value);
    $clamped = min(max($numeric, 0), 100);
    return round($clamped, 2);
}

/**
 * @param PDO   $pdo
 * @param int   $pinId
 * @param array $genericAnswers question_key => value
 */
function public_pins_store_generic_answers(PDO $pdo, int $pinId, array $genericAnswers): void
{
    $answerStmt = $pdo->prepare(
        'INSERT INTO pin_answers (pin_id, question_key, answer_text, answer_numeric)
         VALUES (:pin_id, :question_key, :answer_text, :answer_numeric)'
    );
    foreach ($genericAnswers as $qKey => $value) {
        $meta = public_pins_load_question_meta($pdo, $qKey);
        if (!$meta) {
            json_error("Unknown question: $qKey", 400);
        }
        $type = $meta['type'];
        $config = $meta['config'];
        $answerText = null;
        $answerNumeric = null;

        if ($type === 'influence') {
            $answerText = public_pins_normalize_influence_json($pdo, $qKey, $value, $config);
        } elseif (is_string($value)) {
            $answerText = $value;
        } elseif (is_numeric($value)) {
            $answerNumeric = floatval($value);
        } else {
            json_error("Invalid answer for $qKey", 400);
        }

        $answerStmt->execute([
            'pin_id' => $pinId,
            'question_key' => $qKey,
            'answer_text' => $answerText,
            'answer_numeric' => $answerNumeric,
        ]);
    }
}

/**
 * Resolves the questionnaire key snapshot for a pin submission.
 * - If station has questionnaire configured: use that.
 * - Else: default.
 */
function public_pins_resolve_questionnaire_key(PDO $pdo, ?string $stationKey): string
{
    if (!$stationKey) {
        return 'default';
    }
    $stmt = $pdo->prepare(
        'SELECT q.questionnaire_key
         FROM stations s
         LEFT JOIN questionnaires q ON q.id = s.questionnaire_id
         WHERE s.station_key = :k
         LIMIT 1'
    );
    $stmt->execute(['k' => $stationKey]);
    $key = $stmt->fetchColumn();
    if (!$key || !is_string($key) || trim($key) === '') {
        return 'default';
    }
    return trim($key);
}

/**
 * Attaches generic answers from pin_answers as `generic_answers` on each pin.
 *
 * @param PDO   $pdo
 * @param array $pins array of normalized pin arrays (by reference)
 */
function public_pins_attach_generic_answers(PDO $pdo, array &$pins): void
{
    if (empty($pins)) return;
    $ids = [];
    foreach ($pins as $p) {
        $id = $p['id'] ?? null;
        if (is_int($id) && $id > 0) $ids[] = $id;
    }
    if (empty($ids)) return;

    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $stmt = $pdo->prepare(
        "SELECT pin_id, question_key, answer_text, answer_numeric
         FROM pin_answers
         WHERE pin_id IN ($placeholders)"
    );
    $stmt->execute($ids);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $byPin = [];
    foreach ($rows as $r) {
        $pinId = intval($r['pin_id'] ?? 0);
        if ($pinId <= 0) continue;
        $qKey = (string)($r['question_key'] ?? '');
        if ($qKey === '') continue;
        $val = null;
        if (isset($r['answer_text']) && $r['answer_text'] !== null && $r['answer_text'] !== '') {
            $val = $r['answer_text'];
        } elseif (isset($r['answer_numeric']) && $r['answer_numeric'] !== null && $r['answer_numeric'] !== '') {
            $val = floatval($r['answer_numeric']);
        }
        if (!isset($byPin[$pinId])) $byPin[$pinId] = [];
        $byPin[$pinId][$qKey] = $val;
    }

    foreach ($pins as &$p) {
        $pid = $p['id'] ?? null;
        if (!is_int($pid)) continue;
        $p['generic_answers'] = $byPin[$pid] ?? new stdClass();
    }
}

/**
 * Resolves asked question selection for questionnaire pools (server-side).
 *
 * @return array<int, array{ id:int, sort:int, mode:string, pool_count:int, required:int, questions:array, selected:array }>
 */
function public_pins_resolve_asked_selection(PDO $pdo, string $questionnaireKey): array
{
    require_once __DIR__ . '/questionnaire_resolver_service.php';
    return resolve_questionnaire_selection($pdo, $questionnaireKey);
}

/**
 * Stores asked question selection snapshot for a pin.
 *
 * @param array $resolvedSlots output of resolve_questionnaire_selection
 */
function public_pins_store_asked_selection(PDO $pdo, int $pinId, string $questionnaireKey, array $resolvedSlots): void
{
    if (empty($resolvedSlots)) return;
    $stmt = $pdo->prepare(
        'INSERT INTO pin_questionnaire_questions (pin_id, questionnaire_key, slot_id, slot_sort, slot_mode, question_key)
         VALUES (:pin_id, :questionnaire_key, :slot_id, :slot_sort, :slot_mode, :question_key)'
    );
    foreach ($resolvedSlots as $slot) {
        $slotId = isset($slot['id']) ? intval($slot['id']) : null;
        $sort = isset($slot['sort']) ? intval($slot['sort']) : 0;
        $mode = isset($slot['mode']) ? (string)$slot['mode'] : 'fixed';
        $selected = isset($slot['selected']) && is_array($slot['selected']) ? $slot['selected'] : [];
        foreach ($selected as $qKey) {
            if (!is_string($qKey) || trim($qKey) === '') continue;
            $stmt->execute([
                'pin_id' => $pinId,
                'questionnaire_key' => $questionnaireKey,
                'slot_id' => $slotId,
                'slot_sort' => $sort,
                'slot_mode' => $mode,
                'question_key' => trim($qKey),
            ]);
        }
    }
}

/**
 * Attaches asked question keys as `asked_questions` on each pin.
 *
 * @param PDO   $pdo
 * @param array $pins array of normalized pin arrays (by reference)
 */
function public_pins_attach_asked_questions(PDO $pdo, array &$pins): void
{
    if (empty($pins)) return;
    $ids = [];
    foreach ($pins as $p) {
        $id = $p['id'] ?? null;
        if (is_int($id) && $id > 0) $ids[] = $id;
    }
    if (empty($ids)) return;

    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $stmt = $pdo->prepare(
        "SELECT pin_id, question_key
         FROM pin_questionnaire_questions
         WHERE pin_id IN ($placeholders)
         ORDER BY slot_sort ASC, question_key ASC"
    );
    $stmt->execute($ids);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $byPin = [];
    foreach ($rows as $r) {
        $pid = intval($r['pin_id'] ?? 0);
        $qKey = (string)($r['question_key'] ?? '');
        if ($pid <= 0 || $qKey === '') continue;
        $byPin[$pid][] = $qKey;
    }

    foreach ($pins as &$p) {
        $pid = $p['id'] ?? null;
        if (!is_int($pid)) continue;
        $p['asked_questions'] = $byPin[$pid] ?? [];
    }
}

/**
 * @return array{type: string, config: array}|null
 */
function public_pins_load_question_meta(PDO $pdo, string $qKey): ?array
{
    $stmt = $pdo->prepare(
        'SELECT type, config FROM questions WHERE question_key = :k LIMIT 1'
    );
    $stmt->execute(['k' => $qKey]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        return null;
    }
    return [
        'type' => $row['type'],
        'config' => $row['config'] ? json_decode($row['config'], true) : [],
    ];
}

/**
 * @param mixed $value
 */
function public_pins_normalize_influence_json(PDO $pdo, string $qKey, $value, array $config): string
{
    if (!is_array($value)) {
        json_error("Invalid answer for $qKey", 400);
    }
    $stmt = $pdo->prepare(
        'SELECT option_key FROM question_options WHERE question_key = :k AND is_active = 1'
    );
    $stmt->execute(['k' => $qKey]);
    $valid = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $validSet = array_flip($valid);

    $min = isset($config['min']) ? floatval($config['min']) : -1.0;
    $max = isset($config['max']) ? floatval($config['max']) : 1.0;

    $out = [];
    foreach ($value as $optKey => $num) {
        if (!is_string($optKey) && !is_int($optKey)) {
            json_error("Invalid influence keys for $qKey", 400);
        }
        $optKeyStr = (string)$optKey;
        if (!isset($validSet[$optKeyStr])) {
            json_error("Invalid option for $qKey: $optKeyStr", 400);
        }
        if (!is_numeric($num)) {
            json_error("Invalid influence value for $optKeyStr", 400);
        }
        $v = floatval($num);
        if ($v < $min || $v > $max) {
            json_error("Influence value out of range for $optKeyStr", 400);
        }
        $out[$optKeyStr] = round($v, 4);
    }

    return json_encode($out, JSON_UNESCAPED_UNICODE);
}
