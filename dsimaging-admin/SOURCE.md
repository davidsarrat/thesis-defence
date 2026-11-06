# dsimaging-admin: demonstration interface

I06 now uses a purpose-built, fitted demonstration interface rather than a screenshot of Streamlit. The folder
and drop target, condensed recognition cards, progress pacing and result layout are presentation retouches;
they are not claims about the native application's controls. The real operations behind them are
`dsimaging-admin 0.3.16` scan and publication against the local MinIO/controller test store.

The current collection contains Site A's 136 real NSCLC-Radiomics patients, each with one axial CT image and
its GTV-1 mask. Counts, byte totals and identifiers come from the recorded run. The app imports
`assets/dsimaging-site-a/summary.json`; full source and run evidence are in
`kb/06-dsimaging-store-real-outputs.md`, and thumbnail attribution is in `public/dsimaging/site-a/CREDITS.md`.
The visible folder is `LUNG1`, with `images/`, `masks/` and unique `metadata.csv`; metadata discovery is automatic.
The two typed inputs remain `lung1_demo` and `patient_id`. The resource panel parses the admin's recorded query-style locator into Host, Bucket and Collection. These
are the fields I07 supplies to the genuine Opal wizard, which serializes its own path-style locator; the
summary retains both forms. Credentials are not displayed.

The Firefox page fits its viewport without scrolling. Click 3 holds the empty publication UI. Click 4 opens
Files, shows the collection folders and unselected images with a 136-item count, then closes Files. Separate
clicks drop and recognise the folder (5), type both identifiers (6), preview (7), and publish/show the resource (8).
Typing stays uneven at 38 characters/second with the pointer at rest. I07 also uses separate presenter steps
for project/Resources, Add Resource/type, the complete form, and Save.

## Earlier Streamlit capture (retained provenance)

The following describes the superseded one-image replay. Its captures remain archived in
`assets/dsimaging-admin/`; I06 no longer renders those pages.

The application is the unmodified `dsimaging_admin/ui.py` from **dsimaging-admin 0.3.16**, run with
**Streamlit 1.66.1**. Its source and installed environment are in `/tmp/dsimaging-demo-research/`.
The app is launched from that directory with its existing `lung-store` profile. The profile's credentials
are read only by the server; browser password fields remain empty and status lines report `set [ok]`.
No credentials are written into slide assets.

The local MinIO process uses a **new isolated data directory** under
`qa-out/software-realism/admin/minio-data/`, with an empty, versioned `imaging-data` bucket. The original
research store is not modified. The real dsimaging-store controller runs alongside it. These are local
processes, not evidence of Docker Compose running. This preserves the setup transcript's documented
sandbox limitation in `kb/06-dsimaging-store-real-outputs.md`.

The recorded Publish inputs are:

- Dataset ID: `lung1_demo`
- Source path: `./Desktop/LUNG1`
- Metadata path: empty; the app discovers the unique `SOURCE/metadata.csv`
- Patient privacy-unit column: `patient_id`
- Label column and public label levels: empty
- Replace an existing dataset atomically: unchecked
- Modality: `ct`
- Verify before commit: `quick`

The input is the same single public LUNG1-001 CT PNG and two-column metadata CSV recorded in KB06, with
one sample and no masks. It is not a new clinical dataset. The real app's Preview scan and Publish actions
produce the displayed log, manifest and recommended DataSHIELD resource. The YAML's
`<configured access key>` and `<configured secret key>` strings are the app's own literal placeholders.
Its resource URL uses `127.0.0.1:9000`, bucket `imaging-data` and prefix `datasets/lung1_demo`.
I07's existing Opal registration uses the equivalent `localhost:9000` endpoint and supplies the recorded
`lung1-reader` identity; the admin page itself does not print that identity.

`assets/dsimaging-admin/` contains the captured main panes and native sidebar/header crops. Pixels are
cropped for native scrolling; application controls, wording, data and layout are unchanged. The sidebar is
collapsed with Streamlit’s own control and is opened briefly to select Datasets.
A measured Source Sans text overlay replays the input values at a fast, uneven cadence, with the Source path
gesture described below. Page
changes are immediate. The real form scrolls to Preview scan and Publish; the Datasets page then scrolls
through the manifest to its recommended resource. The browser grows instantly before the unchanged
Opal registration replay, using a separate capture at the wider native viewport.

Reproduction scripts and original native viewport references are retained under
`qa-out/software-realism/admin/`: `start-real.py`, `capture-real.cjs`, `prepare-assets.py`,
`native-viewports.json`, `real-check.json`, and `real-publish-log.txt`.
The current native references are 1040×456 and 1172×456 pixels inside Firefox. The unmodified app is
captured at a CSS viewport of 832×365 (938×365 for the wider window), with device scale 1.25: the
responsive layout and text rasterization of 125% desktop browser zoom. Only the final rounding pixel is
cropped; the images are displayed at native size. Firefox chrome remains unzoomed. The sidebar collapse,
publication and Datasets captures are in `qa-out/software-realism/drag-clean/admin/`.
Source Sans licensing is in [CREDITS.md](CREDITS.md).

## Folder gesture in I06

The replay groups the same CT image and metadata CSV in a `LUNG1` desktop folder. A presentation retouch
drops that folder onto the genuine Source path field and fills `/home/manager/Desktop/LUNG1` in one step.
The actual app accepts a text path; this gesture is not a claim of native drag-and-drop support. Metadata
path remains empty, using the app's documented unique `SOURCE/metadata.csv` discovery. Dataset ID and
patient privacy-unit column are then typed at an uneven 38 characters/second with a stationary pointer.
The existing real preview, publication log, manifest and resource captures remain unchanged.
