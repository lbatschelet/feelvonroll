<?php
/**
 * Pin normalization helpers for API responses.
 * Exports: normalize_pin_row.
 */

/**
 * Formats a DB timestamp (assumed UTC) to ISO-8601 with 'Z'.
 *
 * We historically stored/returned timestamps like "YYYY-MM-DD HH:MM:SS" without timezone.
 * For API consumers, this is ambiguous. We keep DB as UTC but emit an unambiguous ISO format.
 *
 * @param mixed $value
 * @return mixed
 */
function normalize_utc_timestamp($value)
{
    if ($value === null) return null;
    if (!is_string($value)) return $value;
    $s = trim($value);
    if ($s === '') return $value;

    // Already ISO (best effort): keep as-is.
    if (strpos($s, 'T') !== false) {
        return $s;
    }

    // Typical MySQL DATETIME string in UTC.
    if (preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $s)) {
        return str_replace(' ', 'T', $s) . 'Z';
    }

    return $value;
}

/**
 * Normalizes pin row output types and shape.
 *
 * @param array $row
 * @return array
 */
function normalize_pin_row(array $row): array
{
    $row['reasons'] = $row['reason_keys'] ? explode(',', $row['reason_keys']) : [];
    unset($row['reason_keys']);
    $row['id'] = intval($row['id']);
    $row['floor_index'] = intval($row['floor_index']);
    $row['position_x'] = floatval($row['position_x']);
    $row['position_y'] = floatval($row['position_y']);
    $row['position_z'] = floatval($row['position_z']);
    $row['wellbeing'] = floatval($row['wellbeing']);
    $row['approved'] = intval($row['approved']);
    $row['group_key'] = $row['group_key'] ?? null;

    // Emit unambiguous timestamps for API consumers (UTC, ISO-8601).
    if (array_key_exists('created_at', $row)) {
        $row['created_at'] = normalize_utc_timestamp($row['created_at']);
    }
    if (array_key_exists('updated_at', $row)) {
        $row['updated_at'] = normalize_utc_timestamp($row['updated_at']);
    }

    return $row;
}
