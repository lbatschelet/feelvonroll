#!/usr/bin/env php
<?php
/**
 * Idempotent SQL migration runner.
 *
 * Reads SQL files from services/api/migrations/ in lexical order, tracks
 * applied filenames in a `schema_migrations` table, and applies anything
 * new in a single transaction per file.
 *
 * Usage (from any working directory):
 *
 *   php services/api/bin/migrate.php                # apply pending migrations
 *   php services/api/bin/migrate.php --status       # list applied / pending
 *   php services/api/bin/migrate.php --dry          # show what would be applied
 *   php services/api/bin/migrate.php --mark-applied # baseline: mark every existing
 *                                                   # migration as applied without
 *                                                   # running it. Use ONCE on a DB
 *                                                   # that already has the schema.
 *
 * Reads DB credentials from services/api/config.php (which itself loads
 * config.local.php in production).
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "migrate.php must be run from the command line\n");
    exit(1);
}

$apiRoot = realpath(__DIR__ . '/..');
if ($apiRoot === false) {
    fwrite(STDERR, "Could not resolve API root\n");
    exit(1);
}

$args = array_slice($argv, 1);
$mode = 'apply';
foreach ($args as $arg) {
    if ($arg === '--status') {
        $mode = 'status';
    } elseif ($arg === '--dry' || $arg === '--dry-run') {
        $mode = 'dry';
    } elseif ($arg === '--mark-applied') {
        $mode = 'mark-applied';
    } elseif ($arg === '--help' || $arg === '-h') {
        echo "Usage: php services/api/bin/migrate.php [--status|--dry|--mark-applied]\n";
        exit(0);
    } else {
        fwrite(STDERR, "Unknown argument: {$arg}\n");
        exit(2);
    }
}

$config = require $apiRoot . '/config.php';
if (empty($config['db_name']) || empty($config['db_user'])) {
    fwrite(STDERR, "Database config missing (check services/api/config.local.php)\n");
    exit(1);
}

$dsn = sprintf(
    'mysql:host=%s;dbname=%s;charset=utf8mb4',
    $config['db_host'] ?? 'localhost',
    $config['db_name']
);

try {
    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'] ?? '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    fwrite(STDERR, "Database connection failed: " . $e->getMessage() . "\n");
    exit(1);
}

$pdo->exec(
    "CREATE TABLE IF NOT EXISTS schema_migrations (
        filename     VARCHAR(255) NOT NULL PRIMARY KEY,
        applied_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        checksum     CHAR(64)     NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
);

$migrationsDir = $apiRoot . '/migrations';
if (!is_dir($migrationsDir)) {
    fwrite(STDERR, "No migrations directory at {$migrationsDir}\n");
    exit(1);
}

$allFiles = glob($migrationsDir . '/*.sql') ?: [];
sort($allFiles, SORT_NATURAL);

$appliedRows = $pdo->query('SELECT filename, checksum FROM schema_migrations')->fetchAll();
$applied = [];
foreach ($appliedRows as $row) {
    $applied[$row['filename']] = $row['checksum'];
}

$pending = [];
$mismatches = [];
foreach ($allFiles as $path) {
    $name = basename($path);
    $checksum = hash_file('sha256', $path);
    if (isset($applied[$name])) {
        if ($applied[$name] !== $checksum) {
            $mismatches[$name] = ['applied' => $applied[$name], 'current' => $checksum];
        }
    } else {
        $pending[] = ['name' => $name, 'path' => $path, 'checksum' => $checksum];
    }
}

if ($mode === 'status') {
    echo "Applied migrations (" . count($applied) . "):\n";
    foreach (array_keys($applied) as $name) {
        echo "  - {$name}\n";
    }
    echo "\nPending migrations (" . count($pending) . "):\n";
    foreach ($pending as $item) {
        echo "  - {$item['name']}\n";
    }
    if ($mismatches) {
        echo "\nWARNING: checksum mismatches (the file changed after being applied):\n";
        foreach ($mismatches as $name => $diff) {
            echo "  - {$name} (applied {$diff['applied']}, current {$diff['current']})\n";
        }
    }
    exit(0);
}

if ($mismatches) {
    fwrite(STDERR, "Refusing to run: the following migrations were modified after being applied:\n");
    foreach ($mismatches as $name => $diff) {
        fwrite(STDERR, "  - {$name}\n");
    }
    fwrite(STDERR, "Investigate before continuing. Run with --status for details.\n");
    exit(1);
}

if ($mode === 'mark-applied') {
    if (empty($pending)) {
        echo "Nothing to mark - all migrations are already recorded.\n";
        exit(0);
    }
    $insert = $pdo->prepare(
        'INSERT INTO schema_migrations (filename, applied_at, checksum) VALUES (?, NOW(), ?)'
    );
    foreach ($pending as $item) {
        $insert->execute([$item['name'], $item['checksum']]);
        echo "Marked {$item['name']} as applied (without executing).\n";
    }
    echo "Done. " . count($pending) . " migration(s) marked.\n";
    exit(0);
}

if (empty($pending)) {
    echo "Up to date - no migrations to apply.\n";
    exit(0);
}

if ($mode === 'dry') {
    echo "Would apply " . count($pending) . " migration(s):\n";
    foreach ($pending as $item) {
        echo "  - {$item['name']}\n";
    }
    exit(0);
}

$insert = $pdo->prepare(
    'INSERT INTO schema_migrations (filename, applied_at, checksum) VALUES (?, NOW(), ?)'
);

foreach ($pending as $item) {
    echo "Applying {$item['name']}... ";
    $sql = file_get_contents($item['path']);
    if ($sql === false) {
        echo "FAILED to read\n";
        exit(1);
    }

    try {
        $pdo->beginTransaction();
        $pdo->exec($sql);
        $insert->execute([$item['name'], $item['checksum']]);
        $pdo->commit();
        echo "ok\n";
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        echo "FAILED\n";
        fwrite(STDERR, "Error in {$item['name']}: " . $e->getMessage() . "\n");
        exit(1);
    }
}

echo "Done. " . count($pending) . " migration(s) applied.\n";
