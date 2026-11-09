# External model assets

## MakeHuman production people — thesis subset

Vendored without GLB changes from the reviewed template commit **84cff3d**.
The exact identities, LODs, startup/deferred policy and byte totals are in
[subset.json](people/subset.json). Per-file SHA-256 hashes, sizes, texture dimensions,
clips and triangle counts are retained from upstream in [metrics.json](people/metrics.json).

The MakeHuman Community / `makehuman_system` base, rig, skin, eyes and hair are
**CC0 1.0 Universal**, with no required attribution. Original project garments,
poses, animation clips and crowd pigments are also CC0. No GPL application code,
brand textures, external motion capture or real-person likeness is bundled.

- [CC0 licence text](people/CC0-1.0.md).
- [Unmodified upstream provenance and exact source URLs](people/UPSTREAM-CREDITS.md).
  Its links refer to paths in template commit 84cff3d; its full-pack inventory is not this deck's subset.
- [Hero source hashes](people/hero-source-lock.json) and [crowd source hashes](people/crowd-source-lock.json).
- [Pinned source archive hashes](people/downloads.sha256).

Authored with Blender 4.2.3 / MPFB 2.0.17; compressed with glTF Transform 4.2.1
(Meshopt / WebP). Original clothing and shoe pigments replace printed source textures.
People load only when their scene is prepared; `people/subset.json` records the
shipped identities and LODs. H05 loads the woman analyst alongside the original analyst.
The existing furniture and procedural models retain their [separate credits](../../lib/world/models/CREDITS.md).

## Woman analyst identity

**Files:** `people/analyst-woman-{hero,middle,crowd,far}.glb`, **4,477,744 bytes** total.
**Recipe:** the template people pipeline, `production/heroes.py`, identity `analyst-woman`;
fictional adult female creator morphs from MPFB 2.0.17's hm08 base and default rig.
No real person's likeness is used. The analyst's original open lab coat, inner
shirt, garment pigments and authored clips are reused and fitted to this body.

**Upstream:** MakeHuman Community / `makehuman_system`, using the same pinned
[CC0 system archive](https://files2.makehumancommunity.org/asset_packs/makehuman_system_assets/makehuman_system_assets_cc0.zip)
and MPFB base/rig listed above. Source headers credit Data Collection AB,
Joel Palmius and Jonas Hauquier; no attribution is required under
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
Exact source dependencies, hashes and identity associations are recorded in
[`people/hero-source-lock.json`](people/hero-source-lock.json).

| Upstream asset directory | Use |
| --- | --- |
| `skins/middleage_caucasian_female` | Adult female skin map |
| `hair/long01` | Fitted long-hair mesh, opaque original blonde pigment; source hair texture omitted |
| `clothes/male_casualsuit01` | Fitted trousers; original coat and shirt replace the source top |
| `clothes/shoes04` | Fitted shoes with plain original pigment |
| `eyes/low-poly`, `eyes/materials` | Eyes and brown iris map |

**Original modifications, CC0:** female creator recipe; opaque blonde pigment;
long-hair far silhouette; fitted analyst wardrobe; existing `typing`, `listening`,
`standing`, `browsing`, `selecting` clips and shoulder corrections. Tools remain
Blender 4.2.3, MPFB 2.0.17 and glTF Transform 4.2.1 with Meshopt/WebP compression.
All source clothing/shoe textures are replaced; no logo or external motion ships.

### Optional A01 cohort arm motion

`cohort-arms-manifest.json` records source-derived rest joints, skin weights and elbow surfaces for participants 03, 10,
11 and 19. They come from the same CC0 MakeHuman hm08 bodies, rigs and clothing already credited for those identities.
The relaxed poses, greeting schedule and prepared elbow corrective are original work in the people pipeline. All original
participant GLBs, faces, clothes and colours are unchanged; the new runtime behavior is an explicit cohort option.
