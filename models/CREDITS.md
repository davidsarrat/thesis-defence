# External model assets

## MakeHuman production people — thesis subset

Vendored without GLB changes from the reviewed template commit **84cff3d**.
The exact identities, LODs, startup/deferred policy and byte totals are in
[subset.json](people/subset.json). Per-file SHA-256 hashes, sizes, texture dimensions,
clips and triangle counts are retained from upstream in [metrics.json](people/metrics.json).

The MakeHuman Community / `makehuman_system` base, rig, skin, eyes and hair are
**CC0 1.0 Universal**, with no required attribution. Original project garments,
poses, animation clips and crowd pigments are also CC0. No GPL application code,
brand textures, external motion capture or real-person likeness is bundled.

- [CC0 licence text](people/CC0-1.0.md).
- [Unmodified upstream provenance and exact source URLs](people/UPSTREAM-CREDITS.md).
  Its links refer to paths in template commit 84cff3d; its full-pack inventory is not this deck's subset.
- [Hero source hashes](people/hero-source-lock.json) and [crowd source hashes](people/crowd-source-lock.json).
- [Pinned source archive hashes](people/downloads.sha256).

Authored with Blender 4.2.3 / MPFB 2.0.17; compressed with glTF Transform 4.2.1
(Meshopt / WebP). Original clothing and shoe pigments replace printed source textures.
Only the scientist loads in the current deck. The hooded attacker, operators,
residents, crowd LODs and runners remain optional; no judge asset is included.
The existing furniture and procedural models retain their [separate credits](../../lib/world/models/CREDITS.md).
