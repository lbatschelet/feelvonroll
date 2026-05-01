<?php
/**
 * LV95: 2D affine map from scene (x, z) to E/N using three control pairs.
 * Used for pin CSV export when an active lv95_calibrations row exists.
 */

/**
 * @param array $A 3x3 matrix (rows)
 * @param array $b length 3
 * @return array|null length 3
 */
function lv95_solve_linear_3x3(array $A, array $b): ?array
{
    $det = lv95_det3x3($A);
    if (abs($det) < 1e-18) {
        return null;
    }

    // Cramer: replace columns with b
    $M1 = [[$b[0], $A[0][1], $A[0][2]], [$b[1], $A[1][1], $A[1][2]], [$b[2], $A[2][1], $A[2][2]]];
    $M2 = [[$A[0][0], $b[0], $A[0][2]], [$A[1][0], $b[1], $A[1][2]], [$A[2][0], $b[2], $A[2][2]]];
    $M3 = [[$A[0][0], $A[0][1], $b[0]], [$A[1][0], $A[1][1], $b[1]], [$A[2][0], $A[2][1], $b[2]]];

    return [
        lv95_det3x3($M1) / $det,
        lv95_det3x3($M2) / $det,
        lv95_det3x3($M3) / $det,
    ];
}

/**
 * @param array $m 3x3 matrix (rows)
 */
function lv95_det3x3(array $m): float
{
    return $m[0][0] * ($m[1][1] * $m[2][2] - $m[1][2] * $m[2][1])
        - $m[0][1] * ($m[1][0] * $m[2][2] - $m[1][2] * $m[2][0])
        + $m[0][2] * ($m[1][0] * $m[2][1] - $m[1][1] * $m[2][0]);
}

/**
 * @param array $points JSON-decoded calibration points (3 entries with world.x/z, lv95.e/n)
 * @return array|null { a_e, b_e, c_e, a_n, b_n, c_n } e = a_e*x + b_e*z + c_e, etc.
 */
function lv95_affine_from_three_points(array $points): ?array
{
    if (count($points) < 3) {
        return null;
    }
    $xs = [];
    $zs = [];
    $es = [];
    $ns = [];
    for ($i = 0; $i < 3; $i++) {
        $p = $points[$i];
        if (!is_array($p)) {
            return null;
        }
        $wx = $p['world']['x'] ?? null;
        $wz = $p['world']['z'] ?? null;
        $e = $p['lv95']['e'] ?? null;
        $n = $p['lv95']['n'] ?? null;
        if (!is_numeric($wx) || !is_numeric($wz) || !is_numeric($e) || !is_numeric($n)) {
            return null;
        }
        $xs[] = floatval($wx);
        $zs[] = floatval($wz);
        $es[] = floatval($e);
        $ns[] = floatval($n);
    }

    $A = [
        [$xs[0], $zs[0], 1.0],
        [$xs[1], $zs[1], 1.0],
        [$xs[2], $zs[2], 1.0],
    ];

    $solE = lv95_solve_linear_3x3($A, $es);
    $solN = lv95_solve_linear_3x3($A, $ns);
    if ($solE === null || $solN === null) {
        return null;
    }

    return [
        'a_e' => $solE[0],
        'b_e' => $solE[1],
        'c_e' => $solE[2],
        'a_n' => $solN[0],
        'b_n' => $solN[1],
        'c_n' => $solN[2],
    ];
}

/**
 * @param array $affine from lv95_affine_from_three_points
 * @return array{ e: float, n: float }
 */
function lv95_apply_scene_xz_to_lv95(array $affine, float $x, float $z): array
{
    $e = $affine['a_e'] * $x + $affine['b_e'] * $z + $affine['c_e'];
    $n = $affine['a_n'] * $x + $affine['b_n'] * $z + $affine['c_n'];
    return ['e' => $e, 'n' => $n];
}

/**
 * @param array $row DB row with keys points, params (optional)
 */
function lv95_affine_from_calibration_row(array $row): ?array
{
    $params = [];
    if (!empty($row['params'])) {
        $decoded = json_decode($row['params'], true);
        if (is_array($decoded)) {
            $params = $decoded;
        }
    }

    if (isset($params['affine']) && is_array($params['affine'])) {
        $a = $params['affine'];
        if (isset($a['e']['a'], $a['e']['b'], $a['e']['c'], $a['n']['a'], $a['n']['b'], $a['n']['c'])) {
            return [
                'a_e' => floatval($a['e']['a']),
                'b_e' => floatval($a['e']['b']),
                'c_e' => floatval($a['e']['c']),
                'a_n' => floatval($a['n']['a']),
                'b_n' => floatval($a['n']['b']),
                'c_n' => floatval($a['n']['c']),
            ];
        }
    }

    if (!empty($row['points'])) {
        $pts = json_decode($row['points'], true);
        if (is_array($pts) && count($pts) >= 3) {
            return lv95_affine_from_three_points(array_slice($pts, 0, 3));
        }
    }

    return null;
}
