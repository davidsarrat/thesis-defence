# Africa flight: geometry and raster provenance

The active closing renders measured terrain geometry, procedural spatial clouds, a procedural directional
sky and the live aircraft. **No photographic plate is loaded by the live hold.** Static posters are canvas
captures of that three-dimensional scene.

| Active asset | Source and licence | Processing |
| --- | --- | --- |
| `terrain/*.mesh.gz`, `height-query.f32.gz` | NASA/NGA/USGS **SRTM**, public-domain elevation | Adaptive measured meshes in local metres, with real Earth curvature. The live display lifts relief above 1,800 m by 80% for the cinematic framing; mesh vertices, anchors and contact heights share that transformation. Summit and corridor detail are retained; coarser outer rings blend into an analytic curved continuation beyond the measured region. Exact sources and hashes are in [`terrain/SOURCE.md`](terrain/SOURCE.md). |
| `terrain/mountain.webp`, `regional.webp`, `far.webp`, `corridor.webp` | **Copernicus Sentinel-2**, free/full/open under its [Legal Notice](https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice); NASA Blue Marble, public domain | Intrinsic geographic UV textures combine measured colour with Cycles sunlight, shadows, skylight and material shading. **Contains modified Copernicus Sentinel data 2024–2025.** Ice retains the dated footprint and unclipped reflectance; it is not a new glacier survey. |
| Procedural cloud field | Original project shader and seeded world layout; no external cloud image | Live density, soft edges and sunset shading are generated in the shader. Banks occupy independent world positions and curved depths. Technique and limits are in [`clouds/SOURCE.md`](clouds/SOURCE.md). |
| Camera sun glare | Original analytic project shader; no external asset | Direction-responsive warm bloom, veiling glare, ghosts, horizontal streak and rays; one bounded screen-blended draw, no texture or render target. The sky environment retains HDR sun radiance for live aircraft glints. |
| Light shafts | Original procedural project geometry and shader; no external asset | Three depth-tested translucent beams in mountain cloud gaps, six triangles, no texture. |
| Engine condensation wakes | Original procedural project geometry and shader; no external asset | Two depth-tested engine wakes, 330 m long, 3,840 triangles, no texture. Historical flight samples and independent three-octave noise generate formation, wind drift, curling and age-dependent breakup; original procedural sunset lighting. |
| Sky, sun and reflection environment | Original project shader following the PRBB coast palette; three.js is MIT | Direction-based peach atmosphere and golden sun; one locally generated PMREM supplies aircraft reflections. No external panorama. |
| `poster.webp`, `poster-thank-you.webp` | Captures of the live scene and amvlab A320, **CC BY 4.0**; DSWB identity rights remain separate; **Italianno SIL OFL 1.1** | Lossless WebP fallbacks. No HTML acknowledgements are baked in. Aircraft notices are in [`public/models/plane-africa/SOURCE.md`](../../models/plane-africa/SOURCE.md); font notice in [`fonts/SOURCE.md`](fonts/SOURCE.md). |

Raw source rasters, linear bakes and intermediate renders remain outside git. No NC or SA source asset is used.
The original sky/cloud artwork has no third-party photographic content; no separate public licence is granted for the
commissioned project artwork. The former photographic layers retain their original provenance in
[`plates/SOURCE.md`](plates/SOURCE.md), but are historical assets rather than the live world.

## Earlier assets retained for provenance

The regional maps and cloud atlas below were used by earlier flight rounds. They and the former
[Kilimanjaro–Dakar corridor](corridor/SOURCE.md) remain documented but are not loaded by the current closing.
NASA Blue Marble remains an offline input to the far terrain texture. The remaining descriptions in this historical
section refer to that earlier real-time terrain renderer.

The regional maps use EPSG:4326, 20–55° east, 15° south–20° north, with north at the first image row. The colour map is a real satellite mosaic, and relief is computed from measured elevation data. The scene is an artistic flight visualization, not a navigation map.

| Delivered asset | Source | Licence / attribution | Transformation |
| --- | --- | --- | --- |
| `east-africa-blue-marble.webp` | NASA **Blue Marble: Next Generation**, July 2004 MODIS surface mosaic, C1 and C2 at 500 m. [NASA product](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/), [base-map downloads](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/) | U.S. government imagery, not subject to copyright in the United States; [NASA media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/). Credit **NASA Earth Observatory; Reto Stöckli**. No endorsement implied. | Regional crop, joined at equator and downsampled to 4096×4096 with Lanczos, WebP quality 91. No colour grading or synthetic features. |
| `earth-blue-marble-4k.webp` | Same NASA July 2004 monthly mosaic, 21600×10800 global file | Same NASA terms and credit | Delivered at 4096×2048, WebP quality 89; decoded at 2048×1024 for the distant background in the closing scene. |
| `east-africa-height-385.i16`, `east-africa-normal.webp` (1024²) | NOAA NCEI, **ETOPO 2022 15 Arc-Second Global Relief Model**, version 1, the official 60 arcsecond global surface-elevation reduction. [Product](https://www.ncei.noaa.gov/products/etopo-global-relief-model), [DOI](https://doi.org/10.25921/fd45-gt74), [licence metadata](https://data.noaa.gov/waf/NOAA/NESDIS/NGDC/MGG/DEM/iso/xml/etopo_2022.xml). Accessed 2026-10-24. | **CC0-1.0**, explicitly declared in NOAA metadata; U.S. government public-domain data. Credit **NOAA National Centers for Environmental Information (2022), ETOPO 2022, doi:10.25921/fd45-gt74**. | OPeNDAP subset of 2100×2100 genuine 60 arcsecond samples. Int16 grid is bilinear resampled to 385×385 vertex samples and retains signed metres relative to EGM2008. OpenGL normal map derives gradients from the same DEM, with 12× visual relief exaggeration to preserve useful 8-bit normal precision. |

`docs/world/plane-africa/prepare-africa.py` reproduces these outputs from the direct source URLs it records. It needs NumPy and Pillow. Run `python3 prepare-africa.py OUTPUT_DIRECTORY --download`.

The NASA source URLs and NOAA subset query are recorded in `metadata.json`, along with output hashes and sizes. The normal-map exaggeration is independent of the int16 geometry heights: the latter remain real, unscaled metres.

The scene converts geographic vertices to a curved Earth, clamps bathymetry at sea level, and exaggerates geometry height 4×. Image bitmaps are flipped vertically for north-positive texture coordinates. The normal map uses red=east, green=north, blue=outward and stays in linear colour space.

The geographic frame is centred at 37.5°E, 2.5°N: Lake Victoria is to the southwest, Turkana to the north, the Rift below, and the Indian Ocean to the east. Apparent altitude, aircraft size and relief are cinematic exaggerations, recorded in `DESIGN.md`.

| Additional asset | Source | Licence / terms | Transformation |
| --- | --- | --- | --- |
| `cloud-atlas.webp` | Original deterministic volume rendering; `docs/world/plane-africa/render-cloud-atlas.py` | Original commissioned project artwork; no third-party assets and no separate public licence granted. | Four deterministic cumulus volumes with asymmetric billows, multiscale density erosion, soft evaporating edges, oblique sunlight, sky occlusion and approximate multiple scattering. Offline volume integration; four 512² tiles in a 1024² straight-alpha RGBA atlas. Neutral daylight key and cooler shaded interiors; no runtime ray marching. |
| `poster.webp` | Rendered from this flight family | Contains amvlab's CC BY 4.0 aircraft, the official DSWB mark with separate rights, and the NASA/NOAA imagery above; full aircraft and logo notices are bundled in `models/plane-africa/SOURCE.md`. | Real canvas capture of the closing hold, encoded as lossless WebP, for presenter, print and fallback. The current hash is in `metadata.json`. |
| Sky / sun / reflections | Existing project coast shaders: `prbb-sea-daylight.js`, `prbb-sea-sunset.js`, `prbb-sea-sun.js` | Original project artwork; three.js rendering dependency is MIT. No new external sky asset. | Reuses the approved peach/lavender palette, hazy cream disc, broad aureole, cloud shading and warm key/fill. Azimuth and cloud frequency suit the wider aircraft lens. A 128px PMREM is captured once. |

Reproduce the original cloud artwork with NumPy, SciPy and Pillow:

```bash
python3 docs/world/plane-africa/render-cloud-atlas.py /tmp/plane-cloud-atlas
```

The script emits `cloud-atlas.webp` plus individual PNG tiles and daylight/horizon previews. The four tiles occupy 5.33 MiB as mipmapped RGBA; their volume calculation happens only during asset preparation.

The complete credit list is shipped alongside the assets. No third-party cloud photograph, skybox, HDRI or runtime remote service is used. Current procedural cloud artwork is identified in the active-asset table and its cloud notice. The aircraft's embedded livery is included in its model licence. The aircraft samples a 128px PMREM captured once from this scene's procedural sky; no external HDRI is used.


## Closing lettering and fallback (still active)

`Thank you.` uses **Italianno Regular**, by TypeSETit / Robert E. Leuschke, from
[Google Fonts](https://github.com/google/fonts/tree/main/ofl/italianno), under **SIL Open Font License 1.1**.
The exact local font and complete OFL notice are bundled in `fonts/`; its source and hashes are recorded in
`fonts/SOURCE.md`. The black lettering and hand-authored Bézier centreline masks are scene artwork. There is no
outline, shadow, glow, pen object or global opacity fade. The animated mask writes the actual font contours.

`poster-thank-you.webp` is a real rendered frame with the aircraft still tracking beneath the completed lettering, with the same landscape/cloud/sky terms and
Italianno OFL lettering. Its hash and dimensions are recorded with the hold poster in `metadata.json`.

## Kilimanjaro detail

The earlier runtime closing loaded the public-domain NASA/NGA/USGS SRTM detail documented in
[kilimanjaro/SOURCE.md](kilimanjaro/SOURCE.md). The one-arcsecond source is resampled to a 385² height grid and
1024² normal map; the live surface samples it on a 257² mesh. Snow coverage is illustrative shader/vertex artwork,
not a dated glacier survey. Kibo, its crater, Mawenzi and their saddle remain measured terrain. The enlarged
placement and relief are cinematic choices, not a literal geographic aircraft-to-mountain scale.
