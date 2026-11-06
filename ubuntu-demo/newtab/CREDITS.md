# Firefox Home (Firefox 149)

This replay shows Firefox Home with Web Search enabled and Shortcuts, Recommended stories,
Weather and Recent Activity disabled. These are supported Firefox preferences, described in
[Mozilla's New Tab customization guide](https://support.mozilla.org/en-US/kb/customize-items-on-firefox-new-tab-page).

Layout and labels follow Mozilla's `FIREFOX_149_0_RELEASE` source:

- [Logo](https://github.com/mozilla-firefox/firefox/blob/FIREFOX_149_0_RELEASE/browser/extensions/newtab/content-src/components/Logo/_Logo.scss): 64 px logo, 105 px wordmark, 16 px gap.
- [Search](https://github.com/mozilla-firefox/firefox/blob/FIREFOX_149_0_RELEASE/browser/extensions/newtab/content-src/components/Search/_Search.scss): 720 × 52 px field at this viewport width, 24 px engine icon.
- [Base layout](https://github.com/mozilla-firefox/firefox/blob/FIREFOX_149_0_RELEASE/browser/extensions/newtab/content-src/components/Base/_Base.scss): the only-search layout.
- [English labels](https://github.com/mozilla-firefox/firefox/blob/FIREFOX_149_0_RELEASE/browser/locales/en-US/browser/newtab/newtab.ftl): “Search with Google or enter address” and “Customize this page”.
- [Customize button](https://github.com/mozilla-firefox/firefox/blob/FIREFOX_149_0_RELEASE/browser/extensions/newtab/content-src/components/CustomizeMenu/CustomizeMenu.jsx): the pencil icon.

The replay uses 16 px text for projection readability. Layout remains in the application's page area.

Original asset paths are preserved. The pencil’s Firefox-internal context paint is resolved to the light-theme
foreground (`#15141a`, opacity 1) so it also renders in Chromium:

| Local asset | Source |
|---|---|
| `about-logo.png` | Mozilla [`browser/branding/official/content/about-logo@2x.png`](https://raw.githubusercontent.com/mozilla-firefox/firefox/FIREFOX_149_0_RELEASE/browser/branding/official/content/about-logo%402x.png) |
| `firefox-wordmark.svg` | Mozilla [`browser/branding/official/content/firefox-wordmark.svg`](https://raw.githubusercontent.com/mozilla-firefox/firefox/FIREFOX_149_0_RELEASE/browser/branding/official/content/firefox-wordmark.svg) |
| `edit-outline.svg` | Mozilla [`toolkit/themes/shared/icons/edit-outline.svg`](https://raw.githubusercontent.com/mozilla-firefox/firefox/FIREFOX_149_0_RELEASE/toolkit/themes/shared/icons/edit-outline.svg) |
| `google.ico` | Mozilla's [desktop Google search icon attachment](https://firefox-settings-attachments.cdn.mozilla.net/main-workspace/search-config-icons/644faa05-4deb-491b-ae95-0962aefabe55.ico), selected by the release's [search configuration](https://github.com/mozilla-firefox/firefox/blob/FIREFOX_149_0_RELEASE/services/settings/dumps/main/search-config-icons.json) |

Google icon SHA-256: `6da5620880159634213e197fafca1dde0272153be3e4590818533fab8d040770`.

Mozilla source and SVG notices use the Mozilla Public License 2.0; a copy is included as
`MPL-2.0.txt`. Firefox and Google marks identify the real application and search provider.
