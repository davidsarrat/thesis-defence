# Block 8 (easy-opal): sources of these files

- `opal-login.png`, `opal-dashboard.png`: Opal 6.0.2's web interface, captured on 18 Oct 2026 from
  OBiBa's public demo server (opal-demo.obiba.org) with headless Chromium at 1200 × 558 CSS px (device scale 2). The
  sign-in page is shown with empty fields; on the home page the demo user's name and the two-factor banner were hidden
  before the capture. No credential appears in any image. Opal is open-source software by OBiBa (GPL-3.0).
- `opal-login.json`: the positions of the sign-in fields and button in those CSS pixels, for the typing overlay.
- `fonts/roboto-latin-{400,500,700}-normal.woff2`: Roboto (Google; SIL Open Font License 1.1), from @fontsource/roboto
  5.2.5, the typeface of Opal's interface, used for the recreated administrator views.

The administrator-only views (drawer entries, Tasks card, Administration and Administration › DataSHIELD pages) are
drawn in HTML from opal-ui 6.0.2's own templates and English strings (components/diagrams/thesis/OpalPage.vue): the
public demo account cannot open them. Their icons are Material Icons (Apache-2.0; components/diagrams/thesis/opal-icons.js).

## Ubuntu replay: local Opal 6.1.0

The `real/` captures replace the recreations in the main Ubuntu route. The files above and the macOS backup
components remain unchanged. These new captures use a real local Opal server, not the public demo or a mock API.

- Capture date: 22 October 2026. Playwright Chromium, 1172 × 456 CSS pixels, device scale 2 (2344 × 912 PNG).
- Server: [OBiBa Opal 6.1.0](https://github.com/obiba/opal/releases/tag/6.1.0), the stable distribution available
  that day; its bundled UI assets are unchanged. The capture-time retouches are documented below. [Standalone installation](https://opaldoc.obiba.org/en/latest/admin/installation.html)
  with the embedded H2 configuration database; Temurin OpenJDK 21.0.8+9. No external database is needed for this
  resource-only project.
- Two real [Rock 2.3.0](https://github.com/obiba/rock/releases/tag/2.3.0) processes report `default` and `omics`.
  R is 4.3.3 (the provided executable reports this version). Both use the local user library with dsBase 6.3.5,
  dsImaging 0.6.1, dsHPC 0.4.0 and resourcer 1.5.1. **dsOmics did not install**: its Bioconductor dependency set
  was unavailable. The final package capture now represents the published container image, using the verified
  retouch below; it does not represent this sandbox library.
- The first DataSHIELD capture has only the enabled `default` profile. The second starts and registers the
  `omics` Rock instance, enables its profile, and reloads the genuine page. The replay then selects `omics` and
  shows the verified `rock-omics:latest` package inventory described below.
- Sign-in uses a runtime-only random administrator password. Playwright enters it into a password input; captures
  contain dots. No credential is embedded in the deck. The replay address bar remains `https://localhost:8443`.
- DOM measurements, field text styles and scroll offsets are in
  `components/diagrams/thesis/real-opal-captures.json`. Pointer positions use these measurements. Only the typed
  characters are overlaid. Labels and controls come from the actual UI; the package-table metadata and
  framing have the documented capture-time retouches below.

The terminal remains the real easy-opal 2.4.0 transcript documented in `kb/08-easy-opal-real-outputs.md`.
That earlier sandbox used runtime-probe stand-ins and did not run containers. Its `profile add` and restart
output is preserved; the separate standalone servers here establish the captured UI states. This work does
not claim an end-to-end Docker image pull or easy-opal deployment.

Server files, sanitized logs and installation evidence remain outside Git in `/workspace/opal-real/`.
After capture, the services were stopped and runtime passwords, saved resource/app secrets and browser
authentication state were removed. The retained H2 configuration was compacted.
All services bind loopback. Opal's distribution has no Jetty bind-host setting, so its launcher uses a small
runtime `bind()` wrapper that restricts IPv4/IPv6 listeners to loopback; no UI code is changed.

Typing overlays use Opal 6.1.0's bundled Instrument Sans Variable Latin font, copied unchanged to
`fonts/instrument-sans-latin-variable.woff2`. Its SIL Open Font License is alongside it in
`fonts/instrument-sans-LICENSE.txt` (Google Fonts, `ofl/instrumentsans/OFL.txt`).

## Addenda: container inventory and capture cleanup

Verified again on 22 October 2026 against Docker Registry image metadata and package DESCRIPTION files.
[`datashield/rock-omics:latest`](https://hub.docker.com/r/datashield/rock-omics) resolves to
`sha256:f99c40125c5b9db6fd6485486ddbac0695d050c93a0e5bd506c829d61ae30ef1`; its config digest is
`sha256:593779215a0e7395413ae7ed94d4f48e37e7d3f96597c3d1e2ce2af4cbbbb3af`.
Both this image and [`rock-base:latest`](https://hub.docker.com/r/datashield/rock-base) define
`ROCK_LIB=/var/lib/rock/R/library`. The base image checked was
`sha256:91e9f18650bb566c39adce9a8afb7d38797deb3ad2bb9125db1ab9d7dc65a332`.

| Selected installed package in rock-omics | Version | Verification |
|---|---|---|
| dsBase | 6.3.0 | Image environment/history and installed DESCRIPTION extracted from the image layer |
| dsOmics | 1.0.18-2 | Image `DSOMICS_VERSION=v1.0.18-2`, build history and the exact tagged DESCRIPTION |
| resourcer | 1.4.0 | Installed DESCRIPTION extracted from the image layer |

Primary source code: [rock-omics Dockerfile](https://github.com/datashield/docker-rock-omics/blob/master/Dockerfile)
and [dsOmics v1.0.18-2 DESCRIPTION](https://github.com/isglobal-brge/dsOmics/blob/v1.0.18-2/DESCRIPTION).
Registry manifests/configs, extracted DESCRIPTION files and the verification record are retained in
`/workspace/opal-real/image-evidence/`. No container was run and no layer archive was retained.

The addenda use these retouches of the real Opal DOM before Playwright capture:

- E04's final Packages table uses the three image package names, titles and versions above and the container
  library path. Resourcer is an installed dependency, included in this selected inventory. Sandbox package rows,
  library paths and server identifiers are absent. The Built column is omitted because dsOmics' installed Built
  value was not independently extracted; the Server column is omitted because it identifies the capture host.
- (Superseded on 20 November 2026, see below.) The real Packages heading, cluster buttons and selected `omics`
  heading remained visible, but the selector was moved above a full-width table and the notices and controls were
  hidden, so the page changed layout when omics was clicked.
- The `Powered by OBiBa Opal 6.1.0` footer is removed from every captured global drawer: dashboard, admin,
  profiles, datashield, omics-profile, omics-top, omics and imaging-projects. This removes its collision with
  Administration. The project-specific imaging drawer and sign-in page have no such footer.
- The home page's yellow two-factor reminder is hidden. This changes only the capture DOM, not security settings.
- The original one-profile pause is preserved while recapturing its drawer by hiding the newly present `omics`
  selector for that capture; both actual local profiles remain available.

All 25 captures were visually audited for sandbox paths, usernames and host details. Only the old final package
view contained these; it has been replaced. The generic `administrator`, intended localhost addresses and
IMAGING/resource identifiers remain. Field/button DOM measurements are refreshed after each retouch.
Capture helper: `/workspace/opal-real/addendum/retouch-captures.cjs`.

## 20 November 2026: E04's packages in Opal's own layout

David noticed the jump between the omics profile and its packages: the page changed section without scrolling,
and the cluster list moved when omics was clicked. The same local Opal 6.1.0 and Rock 2.3.0 servers were started
again (new runtime password, loopback only) and Administration › DataSHIELD was recaptured in one session
(Playwright Chromium, 1172 × 456 CSS pixels, device scale 2; helper outside Git:
`/workspace/opal-real/addendum/capture-e04.cjs`):

- (`omics-profile`, `omics-scroll-up`, `profiles` and `datashield` were retired later that day, see below.)
- `omics-profile`, `omics-top`, `omics-cluster` (new: omics selected, its heading, the notice and the controls) and
  `omics` (the same page scrolled to the end of the omics table). The cluster list, notice and controls keep their
  native places in every frame. `profiles` and `datashield` are unchanged: their recaptures were pixel-identical.
- `omics-scroll-up` and `omics-scroll-down`: the content column (x ≥ 300, below the 51 px top bar) from the top of
  the page down to the last scroll position, shot once in a taller window. The replay slides it under the fixed top
  bar and drawer. Checked pixel by pixel against the frames at both ends of each scroll: no differing pixel.
- Retouch, data only: each cluster's rows are its image's DataSHIELD packages, from a scan of every layer of both
  pinned images on 20 November 2026 (packages with a `DATASHIELD` file or DataSHIELD fields; record and script in
  `/workspace/opal-real/image-evidence/datashield-packages-inventory-2026-11-20.json` and `ds-inventory.py`):
  `rock-base:latest` (default) dsBase 6.3.5, dsTidyverse 1.2.1, resourcer 1.5.1; `rock-omics:latest` (omics)
  dsBase 6.3.0, dsOmics 1.0.18-2, resourcer 1.4.0, all in `/var/lib/rock/R/library`. The pagination count follows
  the rows. Built and Server columns are omitted as before; nothing else on the page is changed. The drawer's
  footer is hidden as before.
- After the capture the servers were stopped by PID and the runtime credentials removed again.

## 20 November 2026, later: E04 on Packages only

David: E04 should not go down to the Profiles section and come back up to the packages; it shows the top of
Administration › DataSHIELD, the first thing Opal shows there (Packages: the R server clusters, the notice and the
controls). The same local Opal 6.1.0 was started again (new runtime password, loopback only) and one frame was added
(helper outside Git: `/workspace/opal-real/addendum/capture-e04-top.cjs`):

- `datashield-top`: the page as it opens, before the omics Rock registers (its Rock server stopped by PID until Opal
  dropped the cluster), so the list holds `default` only. Compared pixel by pixel with `omics-top`: the only
  differing pixels are the `omics` list item (CSS x 332–398, y 265–279). Same data-only retouch as the frames above
  (the default rows, below the fold; the drawer's footer hidden).
- E04 now plays `dashboard` → `admin` → `datashield-top`; the refresh shows `omics-top`; the last click selects
  omics (`omics-cluster`) and scrolls down to its table (`omics-scroll-down`, `omics`).
- Retired with their files: `profiles`, `datashield`, `omics-profile` and `omics-scroll-up`.
- After the capture the servers were stopped by PID and the runtime credentials removed again.
