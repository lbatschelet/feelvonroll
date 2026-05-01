## Campus 3D model pipeline (Sweet Home 3D → OBJ → glTF/GLB → webapp)

Goals:

- Reproducible workflow with clear folders for inputs and outputs
- Traceability per export iteration (timestamps + manifest)
- Straightforward integration into the webapp under `feelvonroll-webapp/public/models/`

Current behaviour:

- The webapp loads **one GLB per floor** from `feelvonroll-webapp/public/models/` (e.g. `floor_-2.glb` … `floor_3.glb`); see the `floorIndex` → URL map in `feelvonroll-webapp/src/main.js`.
- At least `floor_0.glb` should exist as a baseline; missing floors are skipped and a procedural fallback may apply.
- Source files in the repo: e.g. **`floor_0.sh3d`** per floor **or** a combined **`vonRoll.sh3d`** (depending on workflow); the numbered convention `floor_<index>.sh3d` remains the reference for the scripts.

Alignment note (pin placement):

- In the current code, raycasting / pin placement uses the plane `Y = building.getFloorSlabTopY(floorIndex)`.
- For the glTF provider, slab top defaults to **`0`** if no node/object named `slabTop` exists in the glTF.
- Therefore: orient the export so the “slab top” plane for your **reference floor** lies at **Y = 0**.

Folder layout (all in this repository):

- `01_sweethome_src/` — Sweet Home 3D project files (per floor)
- `02_export_obj_zip/` — Export ZIPs (OBJ + MTL + textures)
- `03_export_obj/` — Unpacked OBJ output per floor
- `04_build_glb/` — Generated GLB files per floor
- `tools/` — Small helper scripts for conversion
- `05_notes/` — Running notes and checks

## 1) Sweet Home 3D: create a floor

Place one SH3D source file per floor, for example:

- `model-pipeline/campus/01_sweethome_src/floor_0.sh3d`
- `model-pipeline/campus/01_sweethome_src/floor_-1.sh3d`
- etc.

Naming rule:

- Exactly `floor_<index>.sh3d` (index = same as webapp `floorButtons`, e.g. `-2`, `-1`, `0`, …)

## 2) Export from Sweet Home 3D: OBJ (+ MTL)

Sweet Home 3D exports designs as **OBJ** (with matching `.mtl`).

Workflow:

1. Open `floor_0.sh3d`
2. Export as OBJ (typically `*.obj` + `*.mtl` + textures)
3. Put the export files in a folder and zip them

Example target path:

- `model-pipeline/campus/02_export_obj_zip/floor_0_export_YYYYMMDD_HHMM.zip`

Important:

- The ZIP must contain **everything** `floor_0.obj` needs (including `floor_0.mtl` and texture images if used).

## 3) Unpack

Optional automation (recommended):

```bash
./model-pipeline/campus/tools/unpack_floor_export_zip_to_latest.sh floor_0
```

This writes to:

- `model-pipeline/campus/03_export_obj/floor_0/latest/`

## 4) OBJ → GLB conversion

Use:

```bash
./model-pipeline/campus/tools/convert_floor_obj_to_glb.sh floor_0
```

Requirements:

- Node.js installed
- From the repository root run `npm install` once (`optimize_glb.mjs` resolves `@gltf-transform/*` and `meshoptimizer` from root `node_modules`). There is no `package.json` under `campus/tools/` so hosts do not treat that folder as the app root.
- `npx obj2gltf` (via `npx`; version is pinned in the script)

The script:

1. Runs `obj2gltf` and writes `04_build_glb/<floor>.glb`
2. Optionally runs **mesh optimization** (`tools/optimize_glb.mjs`: weld/dedup; optional simplification with `SIMPLIFY_RATIO=0.65 ./tools/convert_floor_obj_to_glb.sh floor_0`)

Output:

- `model-pipeline/campus/04_build_glb/floor_0.glb`

## 5) Wire into the webapp

Optional automation:

```bash
./model-pipeline/campus/tools/copy_glb_to_webapp.sh floor_0
```

Manual (same as the script):

- From `model-pipeline/campus/04_build_glb/floor_0.glb`
  to `feelvonroll-webapp/public/models/floor_0.glb`

Then reload the webapp.

## 6) Traceability (manifest)

This repository includes a simple manifest:

- `model-pipeline/campus/05_notes/manifest.md`

After each successful export, record:

- Date/time
- Source file (SHA optional)
- ZIP name
- GLB filename
- Notes (e.g. “SlabTop Y=0 verified”)

Example entry:

```
2026-02-xx 14:30
floor_0.sh3d -> floor_0_export_2026...zip -> floor_0.glb
Check: pins placed on correct plane (Y=0)
```

## Optional: later “full vs low walls”

If we extend the glTF provider later, we will need layering/tagging in the model.

Suggestion:

- Object/material names include `walls_full` vs `walls_low`
- Optionally `floor_<index>` groups
