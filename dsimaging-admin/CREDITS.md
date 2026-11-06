# dsimaging-admin replay

`source-sans-variable.woff2` is the unmodified upright Source Sans variable font bundled with Streamlit 1.66.1.
Source: the installed official Streamlit package's `static/static/media/SourceSansVF-Upright.ttf.BsWL4Kly.woff2`.
Copyright Adobe; SIL Open Font License 1.1, retained in `SOURCE-SANS-LICENSE.md`.

The app imagery in `assets/dsimaging-admin/` is captured from the unmodified `dsimaging_admin/ui.py` in
`dsimaging-admin` 0.3.16 running on Streamlit 1.66.1. Publication runs against an isolated local MinIO bucket,
using the one-image LUNG1 collection and metadata recorded in `kb/06-dsimaging-store-real-outputs.md`.
Connection credentials are resolved server-side and are absent from the captures. The actual app writes the
literal `<configured access key>` and `<configured secret key>` placeholders in its recommended resource YAML.
