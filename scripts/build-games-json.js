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

const games = htmlFiles.map(fn => {
    const base = fn.replace(/\.html$/i, '');
    const title = base.replace(/[_-]/g, ' ');
    const filePath = path.posix.join('html-main', 'html-main', fn);

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
