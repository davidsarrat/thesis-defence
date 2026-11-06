# Album CT images (the imaging resource's pages)

`ct-1.jpg` … `ct-4.jpg` are actual axial CT planes of four site-A patients from the public
[NSCLC-Radiomics collection (LUNG1), TCIA](https://www.cancerimagingarchive.net/collection/nsclc-radiomics/):
LUNG1-007, LUNG1-013, LUNG1-016 and LUNG1-011, in that order. They are the same full-resolution planes as the site-A
thumbnails (the plane with the largest GTV-1 contour, −1000…200 HU mapped to 8-bit grayscale; see
[`../site-a/CREDITS.md`](../site-a/CREDITS.md)), cropped to the body and centred on black at 748 × 636. No mask is
drawn: the album holds the images only, and segmentation makes the masks (David, 26 Oct 2026).

License: [CC BY-NC 3.0](https://creativecommons.org/licenses/by-nc/3.0/). Citations as in
[`../site-a/CREDITS.md`](../site-a/CREDITS.md).

`mask-1.png` … `mask-4.png` are the matching binary GTV-1 contours, rasterised at the original 512 × 512 CT
resolution. They are used only for the segmentation results and radiomics inputs in I05, never on the resource
album. `imaging-flow-faces.js` applies the same crop as the corresponding CT image before drawing the orange mask.
Source slice/contour provenance: `kb/evidence/dsimaging-store/site-a-2026-10-26/slice-provenance.json`.
