# Kilimanjaro relief

`kilimanjaro-height-385.i16` and `kilimanjaro-normal-1024.webp` derive from **NASA/NGA Shuttle Radar Topography Mission (SRTM) one-arcsecond elevation**, distributed by USGS and mirrored in the Mapzen/Tilezen Terrain Tiles dataset on AWS. SRTM is public-domain U.S. government data. Credit: **SRTM terrain data courtesy of the U.S. Geological Survey; NASA/NGA. Distribution: Mapzen/Tilezen Terrain Tiles, AWS Open Data.**

- [USGS SRTM one-arcsecond product, resolution and datums](https://www.usgs.gov/centers/eros/science/usgs-eros-archive-digital-elevation-shuttle-radar-topography-mission-srtm-1/).
- [Mapzen/Tilezen attribution and SRTM public-domain notice](https://github.com/tilezen/joerd/blob/master/docs/attribution.md#srtm).
- [AWS Open Data registry](https://registry.opendata.aws/terrain-tiles/).
- Exact source tiles: [S03E037.hgt.gz](https://elevation-tiles-prod.s3.amazonaws.com/skadi/S03/S03E037.hgt.gz) and [S04E037.hgt.gz](https://elevation-tiles-prod.s3.amazonaws.com/skadi/S04/S04E037.hgt.gz). Both are 3601 × 3601 signed big-endian grids with one-arcsecond postings. Source SHA-256 checksums are in `metadata.json` and enforced by the preparation script.

This is a crop of the terrain distribution mosaic, not a claim that these files are the original NASA delivery. Mapzen's global product also uses public-domain GMTED2010 and ETOPO1 where needed; no missing-value interpolation or replacement is performed here. The two downloaded tiles contain no missing samples. The observed maximum is approximately 5886 metres, within the DEM's measurement and sampling limits; this is not a new surveyed height for Kilimanjaro.

The bounds are **37.20–37.60° E, 3.23–2.94° S**, covering Kibo's summit crater, Mawenzi and the saddle. Geographic rows run north to south and columns west to east. The height grid includes the bounds, is bilinearly resampled to 385 × 385, and stores **unexaggerated signed little-endian int16 metres above EGM96**. Its surface sample spacing is approximately 116 m east-west and 84 m north-south. The 1024 × 1024 normal map is differentiated from a finer resampling of the same one-arcsecond data; it uses linear RGB with red=east, green=north and blue=up. It has no vertical exaggeration. No satellite colour imagery, photographed snow or new glacier survey is included in this directory. Any snow appearance, cinematic placement or scale in the scene is a rendering treatment.

Reproduce from the repository root with NumPy and Pillow:

```sh
python3 docs/world/plane-africa/prepare-kilimanjaro.py --download
```

`--cache` changes the source cache and `--output` changes the asset destination. The optional `--preview` writes a diagnostic shaded-relief picture; it is not a satellite image or runtime asset. This preparation preserves measured relief and does not construct or reshape the summit. All source and output hashes are recorded in `metadata.json`.
