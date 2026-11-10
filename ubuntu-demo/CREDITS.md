# Ubuntu demo assets

## Wallpapers

`noble.png`: Ubuntu 24.04 LTS Noble Numbat, © Canonical Ltd. Unmodified original
`usr/share/backgrounds/warty-final-ubuntu.png` from the [official ubuntu-wallpapers 24.04.2 package](https://archive.ubuntu.com/ubuntu/pool/main/u/ubuntu-wallpapers/ubuntu-wallpapers_24.04.2_all.deb).

`plucky.png`: Ubuntu 25.04 Plucky Puffin, © Canonical Ltd. Unmodified original from the
[official ubuntu-wallpapers 25.04.2 package](https://archive.ubuntu.com/ubuntu/pool/main/u/ubuntu-wallpapers/ubuntu-wallpapers_25.04.2_all.deb).

`resolute.png`: Ubuntu 26.04 LTS Resolute Raccoon, © Canonical Ltd. Unmodified original
`usr/share/backgrounds/warty-final-ubuntu.png` from the [official ubuntu-wallpapers 26.04.2 package](https://archive.ubuntu.com/ubuntu/pool/main/u/ubuntu-wallpapers/ubuntu-wallpapers_26.04.2_all.deb)
(behind Athena on O08, 25 Oct 2026). Licence CC BY-SA 4.0, as the package's copyright file states (`resolute-copyright.txt`).
`resolute-2560.jpg` is the same picture resized to 2560 × 1440 and saved as a JPEG (quality 92, no chroma subsampling) for
the data manager's desktop, which draws it at most at that size (9 Nov 2026); same licence.

Wallpapers: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Full upstream copyright/licence
text (trailing whitespace normalized): `noble-copyright.txt`, `plucky-copyright.txt`. Displayed scaled to the desktop; original pixels unchanged.
Primary release descriptions: [Noble](https://canonical.com/blog/the-coronation-of-a-new-mascot-noble-numbat),
[Plucky](https://ubuntu.com/blog/among-the-waves-plucky-puffin).

## Clinical preview

`lung1-ct.png`: axial CT slice, NSCLC-Radiomics case LUNG1-001. `lung1-mask.png`: the same slice with its supplied
GTV-1 tumour mask, preserved as an available reference asset (not uploaded in this one-image demo).
Copied without alteration from the thesis figures `lung1_ct_slice_raw.png` and `lung1_ct_gtv_slice.png`;
thesis chapter 6 identifies the case in the LUNG1 validation figure caption. Scaled for display.

NSCLC-Radiomics / LUNG1-001, Aerts et al., The Cancer Imaging Archive,
[CC BY-NC 3.0](https://creativecommons.org/licenses/by-nc/3.0/).
[TCIA collection and licence](https://wiki.cancerimagingarchive.net/display/Public/NSCLC-Radiomics).

- Aerts et al. (2014), *Data From NSCLC-Radiomics*, version 4, TCIA: [doi:10.7937/K9/TCIA.2015.PF0M9REI](https://doi.org/10.7937/K9/TCIA.2015.PF0M9REI).
- Aerts et al. (2014), *Decoding tumour phenotype by noninvasive imaging using a quantitative radiomics approach*: [doi:10.1038/ncomms5006](https://doi.org/10.1038/ncomms5006).
- Clark et al. (2013), *The Cancer Imaging Archive (TCIA): Maintaining and Operating a Public Information Repository*: [doi:10.1007/s10278-013-9622-7](https://doi.org/10.1007/s10278-013-9622-7).

The desktop CSV preview represents the real publication input: `sample_id,patient_id` and
`LUNG1-001,LUNG1-001`. One image sample is uploaded, with no mask; the preview is not a volume or multiple patients.

## Interface fonts and icons

`fonts/UbuntuSans.woff2` and `fonts/UbuntuSansMono.woff2`: original variable webfonts from
[Canonical Ubuntu Sans](https://github.com/canonical/Ubuntu-Sans-fonts) and
[Canonical Ubuntu Sans Mono](https://github.com/canonical/Ubuntu-Sans-Mono-fonts).
Ubuntu Font Licence 1.0; unmodified, embedded with their corresponding `*-LICENCE.txt` files. These fonts are not OFL.

`icons/wifi.svg`, `volume.svg`, `battery.svg`, `power.svg`, `show-apps.svg`, `Ptyxis.png` and `Nautilus.png`:
original [Yaru icons](https://github.com/ubuntu/yaru/tree/master/icons/Yaru), with upstream symlinks resolved.
Yaru Icons contributors, CC BY-SA 4.0 (the upstream dual GPLv3 / CC BY-SA licence is `icons/yaru-icons-LICENSE`).
Status icons are displayed in white; the application marks are unchanged.

`icons/Firefox.png`, `ff-*.svg` and `trust-icon-*.svg`: original
[Mozilla Firefox assets](https://github.com/mozilla-firefox/firefox), MPL 2.0 (`icons/firefox-LICENSE`).
The Firefox name and logo are Mozilla trademarks. These marks identify the demonstrated software.

The Downloads, Extensions and default favicon SVGs are pinned to `FIREFOX_149_0_RELEASE`:
[Downloads](https://github.com/mozilla-firefox/firefox/blob/FIREFOX_149_0_RELEASE/browser/themes/shared/downloads/downloads.svg),
[Extensions](https://github.com/mozilla-firefox/firefox/blob/FIREFOX_149_0_RELEASE/toolkit/themes/shared/extensions/extension.svg),
[default favicon](https://github.com/mozilla-firefox/firefox/blob/FIREFOX_149_0_RELEASE/toolkit/themes/shared/icons/defaultFavicon.svg).

The tab icons are unmodified application assets: `opal-favicon.svg` from
[OBiBa Opal 6.1.0](https://github.com/obiba/opal/blob/6.1.0/opal-ui/public/favicon.svg), GPL-3.0
(`icons/opal-GPL-3.txt`); `athena-favicon.ico` from [Athena](https://athena.ohdsi.org/favicon.ico),
with OHDSI attribution and licence in `public/athena/`; and `streamlit-favicon.png` from the installed
Streamlit 1.66.1 `streamlit/static/favicon.png`, Apache-2.0 (`icons/streamlit-APACHE-2.0.txt`).
The dsimaging-admin source does not override Streamlit's default page icon.

The Ubuntu 26.04 desktop, Ptyxis header and Firefox 149 toolbar are DOM reconstructions from the release's
screenshots and upstream UI source. Source links and review evidence are recorded in
`docs/world/software-realism.md`. The pointer and fast-forward symbol are small SVG/CSS drawings for the narrated
replay. Original Opal replay assets and OBiBa sources remain in `public/easy-opal/SOURCE.md`.

For use in ordinary web images, the Firefox SVGs' `context-fill` and `context-fill-opacity` attributes are resolved to the light-theme foreground `#15141a` and opacity `1`. Their original path geometry, licence headers and Proton/Nova groups are retained. Firefox supplies this context internally; Chromium image elements otherwise render the controls transparent.

`icons/folder.png`: unmodified Yaru 96px folder asset, displayed at 64px, from
[Yaru 7f18973](https://github.com/ubuntu/yaru/blob/7f18973e05607c609c4b972f0dd9bff36fa2a13e/icons/Yaru/48x48@2x/places/folder.png),
CC BY-SA 4.0 (same bundled Yaru licence). I06's single-folder drag follows
[DING 50.3.0's selected-item snapshot and pickup hotspot](https://gitlab.com/rastersoft/desktop-icons-ng/-/blob/50.3.0/app/desktopIconItem.js#L493),
with its standard 64px icon and 120×106px cell; a single item has no count badge.

`icons/text-csv.png`: unmodified 96px Yaru MIME-type icon from
[Yaru 7f18973](https://github.com/ubuntu/yaru/blob/7f18973e05607c609c4b972f0dd9bff36fa2a13e/icons/Yaru/48x48%402x/mimetypes/text-csv.png),
CC BY-SA 4.0 (same bundled Yaru licence). I06's Files window follows the
[GNOME Files grid view](https://static.gnome.org/catalog/app-screenshot/org.gnome.Nautilus/grid.png) and
[Nautilus 50 toolbar and window source](https://github.com/GNOME/nautilus/tree/gnome-50/src/resources/ui),
with Ubuntu's window controls, Yaru folder icons and real CT thumbnails. The folder's item count remains
visible without selecting the images; the sidebar stays visible at this window width.

## Lung-region teaching outline

`lung1-outline.svg` is derived from the displayed `lung1-ct.png` (the same LUNG1-001, Aerts/TCIA source and CC BY-NC 3.0 licence above). Grayscale pixels below 140/255 were grouped with 4-connectivity; components larger than 1,000 pixels wholly inside x=140…620 and y=60…430 were kept. A 13×13 square closing and enclosed-hole fill preceded tracing the two external boundaries. The cyan strokes are a schematic threshold-derived lung-region outline, not Hounsfield-unit processing, expert annotation or validated clinical segmentation. The supplied `lung1-mask.png` remains the distinct tumour/GTV input. No measured feature values are drawn.

`components/diagrams/dshpc/lung1-regions.js` holds the same lung region as two filled paths (its traced boundaries, simplified to within 1.6 px and rounded once) and the supplied GTV-1 overlay of `lung1-mask.png` as one filled path (the overlay's tinted pixels, red minus blue above 25/255, holes filled, traced, simplified to within 1.2 px and rounded once). dsHPC's H06 and dsImaging's I05 draw them as filled regions over `lung1-ct.png`: schematic teaching regions from the same sources, not new annotations.
