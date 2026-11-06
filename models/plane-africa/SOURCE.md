# Aircraft attribution

**Airbus A320 no-logo model by amvlab, CC BY 4.0.**

- Source: [aircraft-models, revision 91d835e8e851b2317fe79af291c9fed6153fd525](https://github.com/amvlab/aircraft-models/blob/91d835e8e851b2317fe79af291c9fed6153fd525/models/A320_nologo.glb).
- [Author licence](https://github.com/amvlab/aircraft-models/blob/91d835e8e851b2317fe79af291c9fed6153fd525/LICENSE), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); the author's licence notice is bundled as `LICENSE` and links to the full legal text.
- Copyright 2026 amvlab. No endorsement implied.
- The GLB and its embedded livery image are byte-identical to the source. Runtime transforms, material roughness/metalness and lighting are changed for the scene; the poster is a rendered adapted composition.
- 250,472 bytes; SHA-256 `08cc60caafe3d0937f3e12e72c28bcb96dfdb39763ac124bcd4da8adaea11ab9`.

## DSWB livery texture

`a320-dswb-livery.webp` is a 2048×2048 quality-97 WebP replacement for the embedded map. The GLB geometry,
indices, normals, UVs, hierarchy and bundled source image remain unchanged. The runtime uses the new map.

- The surface layout is adapted from amvlab's embedded texture under **CC BY 4.0**; retain the credit above.
  Paint, rounded passenger windows, door seals, cockpit panes, wing panel seams and fan blades are rebuilt
  as clean geometric artwork at 4K, then Lanczos-filtered to the delivered 2K map. This retains the detail
  visible at the approximately 550-pixel hold framing, without retaining unused texels. Panel placement
  follows the reference UV islands; the linework is illustrative aircraft detailing, not a maintenance drawing.
- Original commissioned paint: neutral white fuselage/engines, neutral grey wings, green `#078930`, yellow
  `#FCDD09` and red `#DA121A` swept ribbons following the fin’s leading edge, with fine white separators
  and an unpainted trailing rudder. This original flag-inspired arrangement does not copy an airline tail,
  wordmark, name or emblem. The tail has no logo. No blue paint is used.
- The **official Data Science Without Borders logo**, including its full wordmark, appears once on the
  forward fuselage's model-space +Z side, facing the closing-shot camera. Source:
  [official dark-wordmark PNG](https://dswb.africa/wp-content/uploads/2024/04/logo-dswb.png)
  from [the programme website](https://dswb.africa/), retrieved 24 October 2026. The unchanged source is bundled
  at [`assets/logos/projects/dswb-dark.png`](../../../assets/logos/projects/dswb-dark.png).
- The logo keeps its colours, proportions and artwork; it is bilinearly sampled onto the existing UV map without
  redrawing or recolouring. It has no backing rectangle and reads normally when viewed from outside.
  These fictional aircraft markings do not identify an actual aircraft operator.
- **Logo rights are separate:** the mark belongs to DSWB and its owners. No separate logo-asset licence was
  identified on the official source pages. It is used to identify the programme at the speaker's request;
  no endorsement is implied. The logo is **not** represented as CC BY or CC0.
- Reproduce with `python3 docs/world/plane-africa/prepare-livery.py` (NumPy, SciPy, Pillow). The script reads
  the retained reference UVs, rebuilds surface artwork, maps the original swept-ribbon design in model space and
  samples the unmodified official logo. No generated imagery or third-party airline artwork is used.
- 263,104 bytes; SHA-256 `ca20dcfed745fc735b91370dbbc9b24879b33967a7d0b14238a0a8538dbf50f9`.
- GPU footprint: 16 MiB RGBA8 base level, approximately 21.33 MiB including mipmaps; one replacement map,
  no added draw call for the paint. The superseded embedded map is disposed after replacement.

Load the replacement map as sRGB with **no vertical flip** (`ImageBitmap.imageOrientation: 'none'`,
`Texture.flipY = false`), matching glTF UVs. The retained model's scene-space nose points **+X**; its embedded
node transform gives a 37.6814 m length, 35.4787 m span and 11.3221 m height. Bounds in metres:
`x [-21.8964,15.7850]`, `y [-2.8211,8.5010]`, `z [-17.7768,17.7019]`. Apply runtime scale `0.001` in a
kilometre-based world; rotate by π about Y to point the nose toward world −X.

## Surface properties and small aircraft details

`a320-surface.webp` is an original 1024×1024 lossless packed material map, generated alongside the livery.
Its green channel stores roughness and its blue channel stores metalness; red is reserved. Load it as
**linear data**, with no vertical flip, and use the same texture for `roughnessMap` and `metalnessMap`.

- White enamel and fin paint have a fine, restrained roughness variation; window panes are smooth dielectric
  glass. The inlet lips and main-wing slat edges use a brushed-aluminium response. The logo remains ordinary
  paint, without turning its dark ink into glass. These are illustrative, authored material properties, not
  measured maintenance or manufacturer data.
- 450,856 bytes; SHA-256 `a29d46aeed75fde2ec5c90cd9c23e4d6d08cdb12b6fdc83ebfab72248ffafd2a`.
- 4 MiB RGBA8 base level, approximately **5.33 MiB with mipmaps**. The two maps total 713,960 bytes on disk
  and approximately **26.67 MiB on the GPU**, including mipmaps.
- Like the reconstructed paint, the surface layout derives from amvlab’s UVs under **CC BY 4.0**. No new
  external photograph, HDRI, airline artwork or model is used in these aircraft additions.

`lib/world/scenes/plane-africa-aircraft.js` adds original procedural navigation lights (red port, green
starboard, white aft), two red beacons and restrained double wing strobes, plus two small turning fan discs
behind the original inlet lips. They add **two draws and 656 triangles**. No texture download is required.
These are illustrative details placed against the supplied model’s geometry; they do not establish a
specific operator or engine variant.

The aircraft uses a locally generated PMREM of the flight’s procedural evening sky for clearcoat reflections.
The sun retains above-display-white radiance in this environment, producing moving warm glints under the
clearcoat (weight 1.0, roughness 0.085). This is original procedural lighting, with no external environment image.
The environment is attenuated below the horizon to represent the darker terrain, with shaped peach skylight above
and a cooler shadowed underside; this avoids an equally luminous sky reflected beneath the fuselage. A private
1024×1024 sun-depth view is rendered once during deferred preparation and reused for wing, fuselage and
engine self-shadowing. It contains only the original airframe, adds no steady-state draw pass and does not
change the shared renderer’s light count or shadow state. The cached RGBA depth texture occupies 4 MiB;
its retained depth renderbuffer costs approximately another 4 MiB. The shadow view is fixed in aircraft coordinates as a budgeted approximation across the shallow tracking
arc; the clearcoat reflections and specular highlights respond live to the changing view and attitude.

The closing scene uses a cinematic scale of 2.6 and a lateral view. This does not claim a literal
aircraft-to-Earth scale or cruise altitude.
