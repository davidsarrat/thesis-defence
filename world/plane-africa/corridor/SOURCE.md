# Kilimanjaro–Dakar corridor: sources and licence

These are georeferenced derivatives of real satellite mosaics and elevation data.
No terrain, coastline, snow or satellite detail was generated or painted. Acquisition
month is **July 2004**; this scene does not represent current snow coverage or a real
airline service. Source data were retrieved on 2026-10-24.

| Delivered files | Original source | Licence and credit | Processing |
| --- | --- | --- | --- |
| `route-00-colour.webp` through `route-09-colour.webp`, `kibo-colour.webp`, `dakar-colour.webp` | NASA **Blue Marble: Next Generation**, July 2004 MODIS monthly mosaic, original **500 m** tiles B1, C1 and C2. [Product and full-resolution downloads](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/). | U.S. government imagery, public domain in the United States; [NASA images and media guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/). Credit **NASA Earth Observatory; Reto Stöckli**. No NASA endorsement implied. | Crop and bilinear geographic resampling. Ten route-aligned 1024² tiles; two geographic 512² detail patches. WebP quality 93 for the route, quality 95 for detail. No grading or sharpening. The small white Kibo summit is retained from the source mosaic. |
| `route-00-height.i16` through `route-09-height.i16`, corresponding `route-*-normal.webp`, `dakar-height.i16`, `dakar-normal.webp` | NOAA NCEI **ETOPO 2022**, version 1, official 60 arcsecond global surface-elevation reduction. [Product](https://www.ncei.noaa.gov/products/etopo-global-relief-model), [DOI:10.25921/fd45-gt74](https://doi.org/10.25921/fd45-gt74). | **CC0-1.0**, explicitly declared in the [official metadata](https://data.noaa.gov/waf/NOAA/NESDIS/NGDC/MGG/DEM/iso/xml/etopo_2022.xml). Credit **NOAA National Centers for Environmental Information (2022), ETOPO 2022**. | OPeNDAP geographic subset, bilinear resampling to 129² vertex grids, signed integer metres. Normals derive from real metre gradients, with no built-in vertical exaggeration. Bathymetry is retained in heights and clamped to sea level only when calculating normals. |
| `kibo-height.i16`, `kibo-normal.webp` | The same ETOPO 2022 version 1, **15 arcsecond** surface grid, tile `N00E030`. [Official tile catalogue](https://www.ngdc.noaa.gov/thredds/catalog/global/ETOPO2022/15s/15s_surface_elev_netcdf/catalog.html). | Same **CC0-1.0** terms and NOAA credit. | OPeNDAP subset 36.7–38.0°E, 3.7–2.4°S. Bilinear resampling to 257² vertex grid and 512² normal map. The source subset's highest sample is 5828.82 m; the published summit altitude is not substituted for the measured raster. |

`metadata.json` records every direct download URL, source file hash and byte count,
derived file hash, geographic/projection registration, dimensions and measured ranges.
The original JPEG and DAP2 downloads are not bundled. Reproduce with NumPy and Pillow:

```bash
python docs/world/plane-africa/prepare-corridor.py \
  /tmp/plane-africa-data public/world/plane-africa/corridor --download
```

The great-circle route starts southeast of Kibo at 3.18°S, 37.60°E and ends at
14.7167°N, 17.4677°W on Dakar's Cap-Vert peninsula. It is a visualisation corridor,
not an asserted aircraft navigation route. The raster strip extends 350 km beyond both
ends and 400 km to each side. Local patches use EPSG:4326; the ribbon's coordinate
formula and standard Earth-centred basis are in the metadata. All elevations use
metres relative to the EGM2008 geoid. Runtime exaggeration, lighting and journey
compression belong to the scene and must be documented separately.

Colour images use sRGB. Normal maps use linear OpenGL tangent-space RGB. The route
images run from the northern side (`cMin`) on the first row to the southern side
(`cMax`) on the last row; columns advance west along the route. Normal red points
along the route and green toward its northern side. Detail patches have north on
the first row and west on the first column. Vertex grids include their bounds;
texture samples represent pixel centres. Adjacent ribbon vertex edges are identical.

Ten 1024² colour maps, twelve 512² normal maps and two 512² detail colour maps occupy
about 72 MiB including complete RGBA mip chains, before geometry, driver overhead and
the rest of the family. The 512² local images preserve the original 500 m information;
their sampling grid is not a claim of finer source resolution.
