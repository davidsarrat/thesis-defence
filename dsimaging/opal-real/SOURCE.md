# Real Opal resource registration

Captured locally on 22 October 2026 with Playwright Chromium at 1172 × 456 CSS pixels and device scale 2.
These images are the genuine bundled UI of [Opal 6.1.0](https://github.com/obiba/opal/releases/tag/6.1.0).
No public demo server or mocked REST API is used. The macOS backup assets remain unchanged.

The resource-only `IMAGING` project is created on the local Opal server. Its Add resource dialog discovers
the real installed [dsImaging 0.6.1 resource definition](https://github.com/isglobal-brge/dsImaging/blob/8b5097364996637c347977e168de07d29fd96f9b/inst/resources/resource.js)
through Rock 2.3.0 and R 4.3.3. The dsImaging file is unmodified, SHA-256
`2e5f3a193188219201926de7494cd7e21dc03e97ef9008324b174cb9359e99d8`.

The capture selects Imaging Resources → MinIO / Self-hosted → Imaging Collection - MinIO / Self-hosted S3.
It names the resource `lung1_demo`, fills Host `localhost:9000`, Bucket `imaging-data`, Collection
`datasets/lung1_demo`, Access Key `lung1-reader`, and a runtime-only secret in the genuine password input.
Save registers the reference in Opal; its real Resources list supplies the final capture. This saves a
resource definition. It does not assert a successful connection test or image retrieval from MinIO.

The selected-factory pause reuses the original empty Host-focused capture, before registration, to keep
the background resource list consistent across the sequence.

The genuine dialog scrolls within its card; it has no Next wizard button. Captures preserve its layout,
scrollbars and field labels. `components/diagrams/thesis/real-opal-captures.json` records DOM rectangles,
text styles and scroll positions for the pointer and typing overlays.

The installed dsHPC 0.4.0 has a local compatibility patch: its three execution-unit resource factories
omit credentials, which makes Opal 6.1.0's provider serializer throw on a null schema. Adding an explicit
empty credentials schema to those factories restores discovery. This patch does not change dsImaging,
resourcer, the Opal UI, or the displayed MinIO form. The original and patch evidence remain in
`/workspace/opal-real/rock-provenance.md` and `sources/dsHPC-resource.original.js`.

Opal is GPL-3.0; dsImaging and dsHPC are MIT. See `public/easy-opal/SOURCE.md` for the server stack and
terminal-transcript provenance. The dsimaging-admin publication replay and wallpaper assets retain their
existing provenance in `kb/06-dsimaging-store-real-outputs.md` and `public/ubuntu-demo/CREDITS.md`.

Addendum capture cleanup: `imaging-projects.png` is recaptured from the same real UI with the global drawer's
`Powered by OBiBa Opal 6.1.0` footer removed in the capture DOM. The project-specific drawer and resource-form
captures contain no such footer and remain unchanged. All captures were checked for sandbox paths and personal
usernames; only the intended localhost endpoint and demo identifiers appear. See `public/easy-opal/SOURCE.md`
for the shared audit and retouch provenance.

The dsImaging addendum-2 replay retains these source captures but replaces the dialog-frame swaps with a
persistent DOM reconstruction (`StoreResourceDialog.vue`). It follows the genuine provider/category/factory
choices and resource fields. The software-realism pass restores the native 14 px input text, 12 px floating labels and helper text, complete helper wording, 76 px parameter rows and the recorded 502 px final scroll. The outer card remains fixed and scrolls continuously; pointer positions follow the measured fields.
The final saved table uses clipped regions from the genuine project/saved captures and a smooth content scroll;
no new server request is claimed. See `docs/world/dsimaging-store-addendum2.md` for the exact retouches and QA.
