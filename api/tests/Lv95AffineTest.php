<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../lib/lv95_affine.php';

final class Lv95AffineTest extends TestCase
{
    public function testAffineTranslateSceneToLv95(): void
    {
        $points = [
            ['world' => ['x' => 0, 'z' => 0], 'lv95' => ['e' => 1000, 'n' => 2000]],
            ['world' => ['x' => 1, 'z' => 0], 'lv95' => ['e' => 1001, 'n' => 2000]],
            ['world' => ['x' => 0, 'z' => 1], 'lv95' => ['e' => 1000, 'n' => 2001]],
        ];
        $affine = lv95_affine_from_three_points($points);
        $this->assertNotNull($affine);
        $r = lv95_apply_scene_xz_to_lv95($affine, 5.0, 7.0);
        $this->assertEqualsWithDelta(1005.0, $r['e'], 0.0001);
        $this->assertEqualsWithDelta(2007.0, $r['n'], 0.0001);
    }

    public function testAffineFromParamsJson(): void
    {
        $row = [
            'points' => '[]',
            'params' => json_encode([
                'affine' => [
                    'e' => ['a' => 1, 'b' => 0, 'c' => 100],
                    'n' => ['a' => 0, 'b' => 2, 'c' => 50],
                ],
            ]),
        ];
        $affine = lv95_affine_from_calibration_row($row);
        $this->assertNotNull($affine);
        $r = lv95_apply_scene_xz_to_lv95($affine, 3.0, 4.0);
        $this->assertEqualsWithDelta(103.0, $r['e'], 0.0001);
        $this->assertEqualsWithDelta(58.0, $r['n'], 0.0001);
    }
}
