// checkAssets.js
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const assetDir = path.join(ROOT, "assets");

function findFiles(dir, exts = [".tsx", ".ts", ".js", ".jsx", ".json"]) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(filePath, exts));
    } else if (exts.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

function scanForAssets() {
  const files = findFiles(ROOT);
  const missingAssets = [];

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");

    // Matches import/require or JSON path like ./assets/...
    const matches = content.match(/['"`](\.\/assets\/[^\s"'`]+)['"`]/g);
    if (matches) {
      matches.forEach((match) => {
        const relPath = match.replace(/['"`]/g, "");
        const fullPath = path.join(ROOT, relPath);
        if (!fs.existsSync(fullPath)) {
          missingAssets.push({
            file: path.relative(ROOT, file),
            asset: relPath,
          });
        }
      });
    }
  });

  if (missingAssets.length === 0) {
    console.log("✅ All asset paths are valid!");
  } else {
    console.log("❌ Missing or invalid asset references:");
    missingAssets.forEach((m) => {
      console.log(`  - In ${m.file}: ${m.asset}`);
    });
  }
}

scanForAssets();
