# External model assets

The production MakeHuman people pack is bundled under `public/models/people/`. The stage-1 style study
remains separately under the model lab. Neither deck worktree was modified.

Record each future asset here before adding its files. Include title, author, exact source URL, license and license URL, required attribution, modifications, compression-tool version, packaged paths and byte size. Retain required license texts beside the asset. Follow [the import workflow](../../docs/models/gltf.md).

Find procedural model and brand-art credits in [the library credits](../../lib/world/models/CREDITS.md).

## MakeHuman people style study

**Title:** MakeHuman people: analyst, hospital data custodian, runner and five crowd archetypes, finishes A/B.
**Original author:** MakeHuman Community / `makehuman_system`, as credited by the official pack catalogue.
The system source headers identify Data Collection AB, Joel Palmius and Jonas Hauquier as the copyright
holders at the CC0 release. MPFB's bundled base/targets/rig are MakeHuman Community assets.
**Licence:** [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).
**Required attribution:** none; the provenance is retained voluntarily.

The [official licence explanation](https://static.makehumancommunity.org/about/license.html) separates the
CC0 assets/exports from GPL MPFB application code. No GPL application code is vendored into these GLBs.
The retained [CC0 text](../../tools/model-lab/people/assets/CC0-1.0.md) is copied from MPFB 2.0.17's
`LICENSE.ASSETS.md`. No community add-ons, external photographs, third-party textures, brands or likenesses
are used for the new people. Source outfits with a MakeHuman logo were excluded.

### Exact sources

- MPFB 2.0.17 base, morph targets and default rig:
  [pinned source ZIP](https://github.com/makehumancommunity/mpfb2/archive/refs/tags/v2.0.17.zip),
  `mpfb2-2.0.17/src/mpfb/data/`; [asset licence at that tag](https://github.com/makehumancommunity/mpfb2/blob/v2.0.17/LICENSE.ASSETS.md).
- System meshes and albedos:
  [CC0 archive](https://files2.makehumancommunity.org/asset_packs/makehuman_system_assets/makehuman_system_assets_cc0.zip),
  [per-asset author/licence catalogue](https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html).
- System static poses:
  [CC0 archive](https://files2.makehumancommunity.org/asset_packs/makehuman_system_poses/makehuman_system_poses_cc0.zip),
  [per-pose author/licence catalogue](https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_poses.html).

[Archive hashes](../../tools/model-lab/people/downloads.sha256) pin the two unversioned packs.
[The source lock](../../tools/model-lab/people/source-lock.json) records all 98 used pack files, their exact
archive-relative names, byte sizes, SHA-256 hashes and affected character ids. It includes the OBJ, MHCLO,
MHMAT, diffuse-image, BVH and pose metadata dependencies rather than just the final export names.

Every asset in the following table has author `makehuman_system`, licence CC0 and no required attribution.
The asset/archive path identifies the exact original; the source lock expands its file dependencies.
Each affected id produces both `<id>-A.glb` and `<id>-B.glb`.

| Original asset (archive-relative directory) | Affected figure ids |
| --- | --- |
| `skins/middleage_caucasian_male` | analyst |
| `skins/middleage_african_female` | manager |
| `skins/young_asian_female` | runner, crowd-01 |
| `skins/middleage_african_male` | crowd-02 |
| `skins/old_caucasian_female` | crowd-03 |
| `skins/old_asian_male` | crowd-04 |
| `skins/young_african_female` | crowd-05 |
| `clothes/male_casualsuit01` | analyst |
| `clothes/female_elegantsuit01` | manager, crowd-03 |
| `clothes/female_sportsuit01` | runner |
| `clothes/male_casualsuit06` | crowd-01, crowd-05 |
| `clothes/male_casualsuit03` | crowd-02 |
| `clothes/male_casualsuit05` | crowd-04 |
| `hair/short02` | analyst |
| `hair/afro01` | manager, crowd-05 |
| `hair/ponytail01` | runner |
| `hair/bob01` | crowd-01 |
| `hair/short01` | crowd-02 |
| `hair/bob02` | crowd-03 |
| `hair/short04` | crowd-04 |
| `clothes/shoes04` | analyst, manager, crowd-02, crowd-03 |
| `clothes/shoes05` | runner, crowd-01 |
| `clothes/shoes01` | crowd-04 |
| `clothes/shoes06` | crowd-05 |
| `eyes/low-poly`, `eyes/materials/brown.mhmat` and `brown_eye.png` | all eight |
| `poses/standing01` | manager, crowd-01 |
| `poses/standing02` | crowd-02 |
| `poses/standing03` | crowd-03 |
| `poses/standing04` | crowd-04 |
| `poses/standing05` | crowd-05 |
| `poses/run01` | runner |

### Modifications and packaged files

Creator morphs; system clothing fitting; authoring rig and poses baked into static meshes; hidden body/helper
removal; per-part decimation; metre normalization and Y-up export. Analyst chair/typing pose is authored in
the build script; manager arms are adjusted for an original procedural tablet. Albedos are resized to 512²
(hair 256²). B samples pigments into vertices, mutes colours, flattens clothing normals and replaces aliased
custodian stripes with slate. Crowd LODs use vertex pigments and opaque hair silhouettes. The tablet is
original study geometry and carries no imported artwork. Study adaptations and that prop are offered under
the same CC0 dedication.

**Export tools:** Blender 4.2.3, MPFB 2.0.17; **compression:** glTF Transform 4.2.1, Meshopt geometry and WebP
images. [The reproducible recipe](../../docs/models/people-stage1.md) gives all commands and character settings.

Packaged directory: `tools/model-lab/people/assets/`. Byte sizes below include embedded buffers and textures;
all exact output hashes and primitive counts are in [metrics.json](../../tools/model-lab/people/assets/metrics.json).

| Files | A bytes | B bytes |
| --- | ---: | ---: |
| `analyst-A.glb`, `analyst-B.glb` | 119,396 | 186,156 |
| `manager-A.glb`, `manager-B.glb` | 164,228 | 202,780 |
| `runner-A.glb`, `runner-B.glb` | 154,480 | 200,856 |
| `crowd-01-A.glb`, `crowd-01-B.glb` | 20,376 | 59,328 |
| `crowd-02-A.glb`, `crowd-02-B.glb` | 20,728 | 58,144 |
| `crowd-03-A.glb`, `crowd-03-B.glb` | 20,816 | 60,244 |
| `crowd-04-A.glb`, `crowd-04-B.glb` | 21,576 | 59,012 |
| `crowd-05-A.glb`, `crowd-05-B.glb` | 20,564 | 57,388 |
| **Total** | **542,164** | **883,908** |


## MakeHuman production people (stage 2)

**Title:** scientist and hooded analyst, three server operators, a judicial reviewer, three runners and ten census residents, four LODs each (76 GLBs).
**Pack paths:** `public/models/people/*.glb`; exact byte sizes, texture dimensions and SHA-256 hashes are in [metrics.json](people/metrics.json) and the [human-readable table](../../docs/models/people-metrics.md).
**Upstream author/licence:** MakeHuman Community / `makehuman_system`, CC0 1.0 Universal, no attribution required. The exact pinned MPFB base/rig/targets and official system archive URLs are the same as the stage-1 sources above.
**Licence text:** [retained CC0 1.0](people/CC0-1.0.md). Application code remains outside the repository; exported asset data uses the upstream CC0 release.
**Compression:** Blender 4.2.3 + MPFB 2.0.17; glTF Transform 4.2.1 Meshopt/WebP. [Exact recipe](../../docs/models/people.md).

The [hero source lock](../../tools/model-lab/people/production/hero-source-lock.json) and [crowd source lock](../../tools/model-lab/people/production/crowd-source-lock.json) record the used system asset files, archive-relative paths, SHA-256, byte counts and affected identities, plus the core base/rig hashes. Remaining MPFB data, including morph targets, is pinned by the MPFB archive checksum. Each identity below produces `-hero.glb`, `-middle.glb`, `-crowd.glb` and `-far.glb`. All three crowd poses are stored in each crowd file. The source locks distinguish inputs from packaged output: clothing and shoe source textures may be read during fitting, but are replaced by original plain materials before export. **No printed logo, clothing pattern or brand texture ships.** Skin, hair and low-poly eye albedos are the only retained upstream hero maps. Crowd maps are entirely removed.

Every upstream asset in this table has the exact official CC0 system archive URL recorded above, author `makehuman_system`, licence CC0 and no required attribution. Paths and hashes in the locks identify the specific version within that archive.

| Upstream asset directory | Production identities |
| --- | --- |
| `clothes/female_casualsuit01` | `crowd-01` |
| `clothes/female_casualsuit02` | `crowd-07` |
| `clothes/female_elegantsuit01` | `crowd-03`, `crowd-08` |
| `clothes/female_sportsuit01` | `runner-01`, `runner-02`, `runner-03` |
| `clothes/male_casualsuit01` | `analyst`, `judge`, `malicious`, `manager-01`, `manager-02`, `manager-03` |
| `clothes/male_casualsuit02` | `crowd-05` |
| `clothes/male_casualsuit03` | `crowd-02`, `crowd-06` |
| `clothes/male_casualsuit04` | `crowd-10` |
| `clothes/male_casualsuit05` | `crowd-04` |
| `clothes/male_casualsuit06` | `crowd-09` |
| `clothes/shoes01` | `crowd-04` |
| `clothes/shoes02` | `crowd-06` |
| `clothes/shoes03` | `crowd-03` |
| `clothes/shoes04` | `analyst`, `crowd-02`, `crowd-08`, `judge`, `malicious`, `manager-01`, `manager-02` |
| `clothes/shoes05` | `crowd-01`, `crowd-07`, `crowd-09`, `manager-03`, `runner-01`, `runner-02`, `runner-03` |
| `clothes/shoes06` | `crowd-05`, `crowd-10` |
| `eyes/low-poly` | `analyst`, `crowd-01`, `crowd-02`, `crowd-03`, `crowd-04`, `crowd-05`, `crowd-06`, `crowd-07`, `crowd-08`, `crowd-09`, `crowd-10`, `judge`, `malicious`, `manager-01`, `manager-02`, `manager-03`, `runner-01`, `runner-02`, `runner-03` |
| `eyes/materials` | `analyst`, `judge`, `malicious`, `manager-01`, `manager-02`, `manager-03`, `runner-01`, `runner-02`, `runner-03` |
| `hair/bob01` | `manager-03` |
| `hair/ponytail01` | `runner-01` |
| `hair/short01` | `manager-01`, `runner-02` |
| `hair/short02` | `analyst`, `malicious`, `runner-03` |
| `hair/short04` | `judge`, `manager-02` |
| `skins/middleage_african_female` | `manager-01` |
| `skins/middleage_african_male` | `runner-02` |
| `skins/middleage_caucasian_male` | `analyst`, `judge`, `malicious`, `manager-02` |
| `skins/old_caucasian_female` | `runner-03` |
| `skins/old_caucasian_male` | `judge` |
| `skins/young_asian_female` | `manager-03`, `runner-01` |

### Original project work — CC0

The following meshes, pigments, poses and clips were made for this project and are released with this pack under CC0 1.0. They do not incorporate any external motion capture, Mixamo, CMU or non-CC0 asset.

| Original work | Packaged asset / source |
| --- | --- |
| Open lab coat, curved inner shirt, collar, lapels, placket, buttons, fitted pockets, cuffs, continuous folded sleeves and draped seat panels | All four `analyst` GLBs; `production/heroes.py` |
| Shaped pullover hoodie with rounded shoulders, modelled cloth folds, ribbed hem/cuffs, kangaroo pocket and plain pigments; original fitted cloth-baked hood with bound face opening, rounded crown, centre seam, neckline and drawcords | All four `malicious` GLBs; `production/heroes.py`, `production/hood.py`; original meshes and cloth bake, no downloaded garment or motion |
| Closed full-length sports T-shirts, blended shoulder sleeves and plain sports pigments | Twelve `runner-01/02/03` GLBs; `production/heroes.py` |
| Blue coverall pigments/seams/closure, blank ID badges, independently tintable accent, yellow fitted brim-and-ridge hard hats, unbranded tablets and hip-loop wrench | Twelve `manager-01/02/03` GLBs; `production/roles.py` |
| Judicial robe, bell sleeves, lap drape, lapels, white collar/bands, seated pose and palm contacts | Four `judge` GLBs; `production/roles.py` |
| Typing loop, running cycle, listening/standing/approving/holding/working poses, host-progress turning articulation, finger articulation and hand-contact edits | All 36 hero GLBs; `production/heroes.py` |
| Far hero anatomical proxies, mitten hands, retained role garments and prop simplification | Nine `*-far` hero GLBs; `production/heroes.py` |
| Opaque hair caps/buns, skin/cloth/eye pigments, region attributes, protected arm/hand LODs and mittens | Forty crowd GLBs; `production/crowd_build.py`, `crowd-specs.json` |
| Ten weight-shifted standing poses, walking phases and seated poses | Forty crowd GLBs; `production/crowd_build.py` |
| Retained judicial bench, chair and gavel geometry from this project’s DataSHIELD reference; original unbranded laptop | Procedural `lib/world/models/people-reviewer.js`; copied project work, no external asset |
| Original server rack, sliding unit, status LEDs, plain Opal/Armadillo software-name labels and contact/label/port anchors | Procedural `lib/world/models/people-rack.js`; no downloaded file |

Fine garment details simplify by LOD: far analysts omit coat pockets; far malicious figures omit drawcords/pouch; far runners use proxy shirts; far operators omit small seam details. Every LOD retains its role silhouette and arms/hands.

All new people are fictional creator morphs. No real person was used as a likeness reference, and no logo, flag or unit insignia was added. The existing workstation, screens and hospital models keep their separate library credits; they are not claimed as new CC0 MakeHuman assets.

## Woman analyst — CC0 system assets

`analyst-woman-{hero,middle,crowd,far}.glb` adds a fictional adult female identity
from the same MPFB 2.0.17 hm08 base and default rig as the analyst. Source author:
MakeHuman Community / `makehuman_system`; source headers credit Data Collection AB,
Joel Palmius and Jonas Hauquier. [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
requires no attribution; the local licence text is `CC0-1.0.md`.

The pinned [MakeHuman CC0 system archive](https://files2.makehumancommunity.org/asset_packs/makehuman_system_assets/makehuman_system_assets_cc0.zip)
provides `skins/middleage_caucasian_female`, `hair/long01`,
`clothes/male_casualsuit01`, `clothes/shoes04`, `eyes/low-poly` and `eyes/materials`.
[`hero-source-lock.json`](hero-source-lock.json) records exact files, hashes and identity associations.

Original CC0 modifications: female creator morphs, fitted analyst coat and shirt,
plain trouser/shoe pigments, opaque blonde hair (no alpha texture), long-hair far
silhouette, and original typing/listening/standing/browsing/selecting clips.
Blender 4.2.3 and glTF Transform 4.2.1 produce the Meshopt/WebP assets, totalling
4,477,744 bytes. No real likeness, logo, external animation or runtime download is used.
