# LUNG1 site-A CT thumbnails

The twelve 128 × 128 grayscale PNGs in `thumbnails/` are actual axial CT slices from the public
[NSCLC-Radiomics collection (LUNG1), TCIA](https://www.cancerimagingarchive.net/collection/nsclc-radiomics/).
They are the first twelve identifiers in the exact site-A roster (SHA-256(patient_id), interpreted as a full
integer, modulo 3 equals zero) after the thesis's complete-case eligibility filter.

For each patient, the selected CT instance is the plane with the largest GTV-1 contour area in their RTSTRUCT.
The DICOM values are converted to HU with the stored rescale slope/intercept, clipped to −1000…200 HU and
mapped to 8-bit grayscale; the full plane is reduced with Lanczos resampling. No anatomy is synthesized.
The companion full-resolution CT PNGs and rasterized masks remain in ignored `qa-out/`, outside Git.
Exact patient, series and SOP instance IDs, contour area and hashes are in
[`kb/evidence/dsimaging-store/site-a-2026-10-26/slice-provenance.json`](../../../kb/evidence/dsimaging-store/site-a-2026-10-26/slice-provenance.json).
The on-screen manifest is [`assets/dsimaging-site-a/summary.json`](../../../assets/dsimaging-site-a/summary.json).
Reproduction: [`scripts/data/lung1-site-a.py`](../../../scripts/data/lung1-site-a.py).

License: [CC BY-NC 3.0](https://creativecommons.org/licenses/by-nc/3.0/).

Required citations:

- Aerts, H. J. W. L., Wee, L., Rios Velazquez, E., Leijenaar, R. T. H., Parmar, C., Grossmann, P., Carvalho,
  S., Bussink, J., Monshouwer, R., Haibe-Kains, B., Rietveld, D., Hoebers, F., Rietbergen, M. M., Leemans,
  C. R., Dekker, A., Quackenbush, J., Gillies, R. J., and Lambin, P. (2014). Data From NSCLC-Radiomics
  (Version 4). The Cancer Imaging Archive. [doi:10.7937/K9/TCIA.2015.PF0M9REI](https://doi.org/10.7937/K9/TCIA.2015.PF0M9REI).
- Aerts et al. (2014). Decoding tumour phenotype by noninvasive imaging using a quantitative radiomics
  approach. Nature Communications 5, 4006. [doi:10.1038/ncomms5006](https://doi.org/10.1038/ncomms5006).
- Clark et al. (2013). The Cancer Imaging Archive (TCIA): Maintaining and Operating a Public Information
  Repository. Journal of Digital Imaging 26, 1045–1057.
  [doi:10.1007/s10278-013-9622-7](https://doi.org/10.1007/s10278-013-9622-7).
