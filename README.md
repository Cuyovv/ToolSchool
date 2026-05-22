Setup to show all games in the catalog

1. Generate `games.json` (scans `html-main/html-main` and `covers-main/covers-main`):

```bash
node scripts/build-games-json.js
```

2. Serve the folder with a local static server (recommended). Example with `http-server`:

```bash
npx http-server -c-1 .
# or
python -m http.server 8000
```

3. Open `http://localhost:8080` (or the port shown) and play. The catalog will load `games.json` and show all games.

Notes:
- If `games.json` is missing the index will fall back to GitHub API (only works for public repos).
- The build script tries to match covers by numeric prefix; if a cover is missing a placeholder image is used.
