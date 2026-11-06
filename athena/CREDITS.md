# Athena interface assets

`logo_Athena_2.png` and the seven domain/count SVG icons are the original AthenaUI assets, downloaded from
[OHDSI/AthenaUI](https://github.com/OHDSI/AthenaUI/tree/master/resources/icons), 25 October 2026.
Copyright Odysseus Data Services, Inc.; Apache License 2.0. The bundled `LICENSE.txt` contains the Apache 2.0 license text.
The ATHENA name and helmet identify the real application; they are not deck branding.

The replay follows AthenaUI's Start, List and View presenters and styles. Counts on the start page were read from
`https://athena.ohdsi.org/api/v1/concepts/terms-count` on 25 October 2026. The filtered results and concept relationships
are frozen to the genuine Athena screenshots in the 24 October software comparison: Condition + Standard gives
7,899 results, with concept 255573 first, and its concept view shows 164 term connections. The live concepts endpoint
returned HTTP 403 during this implementation; no results were fabricated to replace it.

`loading.png` is the original inline image from `arachne-ui-components` 1.21.1, `LoadingPanel/presenter.jsx`,
AthenaUI's official component dependency (Apache 2.0, copyright Odysseus Data Services, Inc.). Its original 45 px size,
four-second rotation and white 70% loading veil are retained.

The sequence is an edited replay of the recorded start, filtered-results and concept states; intermediate unfiltered
and Condition-only requests are omitted. No intermediate counts or result rows are fabricated.
