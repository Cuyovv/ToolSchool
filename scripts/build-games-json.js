const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, '..', 'html-main', 'html-main');
const coversDir = path.join(__dirname, '..', 'covers-main', 'covers-main');
const outFile = path.join(__dirname, '..', 'games.json');

function readDirFiles(dir, ext) {
    try {
        return fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(ext));
    } catch (e) {
        console.error('Could not read directory', dir, e.message);
        return [];
    }
}

const htmlFiles = readDirFiles(htmlDir, '.html');
const coverFiles = readDirFiles(coversDir, '.png');
const coverSet = new Set(coverFiles.map(f => f.toLowerCase()));

function parseTitleFromHtml(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1].trim()) {
            return titleMatch[1].trim();
        }
        const metaMatch = content.match(/<meta\s+name=["']title["']\s+content=["']([^"']+)["']/i);
        if (metaMatch && metaMatch[1].trim()) {
            return metaMatch[1].trim();
        }
        const commentMatch = content.match(/<!--\s*([^\n]+?)\s*-->/);
        if (commentMatch && commentMatch[1].trim()) {
            return commentMatch[1].trim();
        }
    } catch (e) {
        // ignore
    }
    return null;
}

const games = htmlFiles.map(fn => {
    const base = fn.replace(/\.html$/i, '');
    const filePath = path.posix.join('html-main', 'html-main', fn);
    const titleFromHtml = parseTitleFromHtml(path.join(htmlDir, fn));
    const title = titleFromHtml || base.replace(/[_-]/g, ' ');

    let coverPath = null;
    const numMatch = base.match(/^(\d+)/);
    const candidates = [];
    candidates.push(base + '.png');
    if (numMatch) {
        candidates.push(numMatch[1] + '.png');
        candidates.push(numMatch[1] + '-m.png');
        candidates.push(numMatch[1] + '-f.png');
    }

    for (const c of candidates) {
        if (coverSet.has(c.toLowerCase())) {
            coverPath = path.posix.join('covers-main', 'covers-main', c);
            break;
        }
    }

    return { title, filePath, coverPath };
});

fs.writeFileSync(outFile, JSON.stringify(games, null, 2), 'utf8');
console.log('Wrote', games.length, 'entries to', outFile);
