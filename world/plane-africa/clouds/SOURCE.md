# Live procedural sunset clouds

The live field uses original project code in `lib/world/scenes/plane-africa-cloud-density.js`, `plane-africa-clouds.js` and `plane-africa-weather-layout.js`. It contains no cloud photograph, rendered puff, generated image or atlas sample. There is no new downloaded cloud asset or third-party asset licence.

A deterministic 64 × 64 × 64 scalar noise volume is built during preparation from four octaves of smooth value noise. It stores density variation, not a picture of a cloud. Each world-space bank has its own stable three-dimensional sampling domain, dimensions, altitude, bearing and morphology. The field contains deep broken cumulus, a lower stratocumulus collar, a few taller congestus, small fragments and high cirrus. A broad, flatter condensation base supports unequal rounded upper lobes; large-scale noise erodes their outline and varies density inside them. A weak, irregular interior floor keeps the larger billows coherent without turning their outer surface into an opaque smooth shell. High cirrus uses stretched nonperiodic noise and a separate thin-ice sunset colour. No painted puff or rendered cloud layer is repeated across the field.

A single instanced draw bounds these volumes on screen using the exact perspective tangent planes of each ellipsoid. A support test against the camera's frustum first rejects wholly invisible volumes, avoiding enormous proxies for off-axis banks that cross the eye plane. Each fragment intersects a world-oriented ellipsoid and integrates its seeded density along the view ray; the cloud is not a camera-facing image. Ten view samples are used below 24 km, eight between 24 and 65 km, and four beyond 65 km; high cirrus uses eight samples. Integration stops once less than 1.5% of the background remains transmitted. Two density probes towards the low sun approximate nearby self-shadowing; middle, distant and high clouds use one probe with an estimated farther optical depth. A soft directional density gradient and height-dependent sky fill remain. There is no separate bright perimeter term. The lighting gives peach/gold upper masses and gently cooler mauve bases, while the thin high fibres retain peach light. Each density evaluation uses two scalar-noise reads: at most 60 reads for a fully occupied near low-cloud ray, 32 for a middle ray, 16 for a distant ray and 32 for cirrus, with fewer reads after dense-core early termination. Optical depth scales with the actual distance travelled through the volume; bank density and renewal visibility enter extinction rather than a uniform final transparency cap. This is a bounded real-time volume approximation, not a multiple-scattering atmospheric simulation. Native motion review and the paired benchmark are the evidence for its appearance and cost.

`plane-africa-cloud-pass.js` integrates these same volumes at half the drawing buffer's width and height. Immediately before the cloud composite, it resolves the already-rendered opaque world's depth at full resolution. Every cloud ray stops at that depth; the volumes retain their original translucent blend order without writing cloud depth. A depth-aware bilinear composite rejects farther samples at closer aircraft and mountain silhouettes. Nearer-clipped cloud samples remain valid over farther terrain; keeping them avoids artificial gaps at steep horizon depth gradients. The original scene remains on its antialiased canvas, so aircraft edges keep their MSAA. This adds one composite draw and one depth blit, without another terrain or aircraft pass. The shared context explicitly requests stencil storage so the resolve can match its real packed attachment: normalized DEPTH24_STENCIL8, or DEPTH32F_STENCIL8 when the default depth component is floating point. Half-resolution RGBA8 colour plus full-resolution 24/8 depth use 4.395 MiB at 1280×720 (7.910 MiB with 32F/8 depth); dimensions follow the physical drawing buffer, including fractional DPR and odd sizes. Preparation initializes the targets, while resize and disposal preserve ownership and the shared renderer's state. The sample counts above are unchanged. Flight and preparation cameras use a 20 m near plane and 500 km far plane, with the original world range restored outside the family. This improves the precision of resolved depth where clouds meet the distant horizon; the measured aircraft hull stays at least 80.44 m deep, and the lettering is 180 m away.

The scalar density texture allocates 0.25 MiB with no mipmaps. A separate 256² half-float height texture (0.125 MiB) softens terrain contact. It is sampled from the existing public DEM through the same display-height mapping as the terrain: measured planimetry is retained, with a cinematic 80% lift of relief above 1,800 m. Ordinary close cloud supports end below 2,850 m, beneath the tracking aircraft. Five selected, more distant congestus rise higher around the lower massif; each has both horizontal diameters at least 3.1 times its vertical radius, so a broad crown replaces an exposed narrow shaft. The summit remains clear. The fixed seeded layout covers the curved 185 km horizon in every viewing sector. Banks move through world space under depth-aware advection; the camera's motion supplies depth parallax. No cloud image scrolls underneath the aircraft.

The camera-aware wind moves the volumes in world space along the aircraft's projected nose-to-tail axis.
Targets vary smoothly with depth: up to 215 px/s near the aircraft, about 65 px/s in the middle field and
8 px/s at the horizon and in cirrus, at 1280×720. A perspective endpoint constraint maintains a positive
minimum during crane and focal-length changes. This velocity field is cinematic art direction rather than
literal meteorology. It does not scroll a cloud image or change density into a screen-space silhouette.
The single click leaves this weather clock untouched.

Near banks occupy a seeded two-dimensional grid with a 38 km half-span, fading between 26 and 35 km before
renewal. The coarse grid overlaps from 22–36 km, fades at 205–225 km and renews beyond a 230 km half-span.
Each axis wraps independently, preventing long wind travel from exhausting one sector. Renewed cells vary
in scale while their seeded procedural density keeps evolving. Extremely close, oversized supports fade before their bounded ray sampler
would smear against a screen corner. High banks also soften before entering the fixed ink reading area.

The live count remains 1,427 banks in one instanced volume draw (2,854 proxy triangles), followed by the
two-triangle composite. Density textures and render targets are unchanged. Native
frames and paired whole-scene timings for the lower sample budget are recorded in `docs/world/plane-africa-round24.md`. The current
wind check measures consecutive rendered bank-centre projections rather than the controller's mean;
renewal checks verify transparent wraps and coverage under two-dimensional advection. These geometric
measurements do not claim pixel-level optical flow or native M2 timings.

## Retained baseline atlas

`cumulus-puffs.webp` and its `metadata.json` remain unchanged as a historical performance baseline. They are not loaded or sampled by the live cloud factory. They are original procedural project artwork, with no external image or geometry input. The generator used eight scalar volumes, four light directions, and premultiplied resampling into a 3072 × 1536 lossless WebP. SHA-256, dimensions and provenance remain in `metadata.json`; the previous allocation was 24 MiB with mipmaps.

To reproduce that **baseline only**:

```sh
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 python3 docs/world/plane-africa/render-cloud-cumulus.py --output /tmp/plane-cloud-atlas --resolution 384 --depth 160 --workers 2
python3 docs/world/plane-africa/inspect-cloud-puffs.py /tmp/plane-cloud-atlas --margin 16
```

Dependencies for the historical renderer: NumPy, SciPy and Pillow. These commands do not build the live procedural shader's density volume, which is generated directly by JavaScript during preparation.

## Visual references, not deck assets

The following photographs were used only to study shape, lighting and depth. Their pixels are not included in the cloud field:

- [Stacey Koenitz, aircraft-window sunset](https://www.pexels.com/photo/airplane-window-view-of-clouds-4815143/).
- [Salwa Farwaneh Dameh, sunset above a cloud deck](https://commons.wikimedia.org/wiki/File:Sunset_view_from_an_airplane_window_above_the_clouds.jpg).
- [WMO, stratocumulus undulatus](https://cloudatlas.wmo.int/en/varieties-stratocumulus-undulatus-sc-un.html).
- [NASA, cirrus off Chile](https://science.nasa.gov/earth/earth-observatory/cirrus-clouds-off-the-coast-of-chile-85943/).
- [Ed Donovan, pink sunset cirrus, NASA Langley S'COOL](https://scool.larc.nasa.gov/GLOBE/cirrus.html).

The [WMO formation notes](https://cloudatlas.wmo.int/en/stratocumulus-may-form.html) describe flattened and spreading cumulus. They do not establish the weather at Kilimanjaro on the presentation date.

Terms: original project procedural code and artwork, retained in this repository. No separate public licence is asserted for project artwork; no third-party cloud pixels or geometry require attribution in the live scene.
