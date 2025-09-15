// pg-build.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName),
                              path.join(dest, childItemName));
        });
    } else {
        // Scrive solo se il file non esiste o è cambiato
        const shouldWrite = !fs.existsSync(dest) || fs.readFileSync(src).toString() !== fs.readFileSync(dest).toString();
        if (shouldWrite) {
            fs.copyFileSync(src, dest);
        }
    }
}

function writeFileIfChanged(filePath, content) {
    if (!fs.existsSync(filePath) || fs.readFileSync(filePath, 'utf8') !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

function runCommand(cmd) {
    execSync(cmd, { stdio: 'inherit' });
}

fs.mkdirSync('gen/pg/db', { recursive: true });

copyRecursiveSync('db/data', 'gen/pg/db');

const csnOutput = execSync('npx cds compile "*"').toString();
writeFileIfChanged('gen/pg/db/csn.json', csnOutput);

copyRecursiveSync('pg-package.json', 'gen/pg/package.json');
copyRecursiveSync('package-lock.json', 'gen/pg/package-lock.json');