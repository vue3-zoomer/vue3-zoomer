import fs from "fs";
import path from "path";
import { cwd } from "process";

const distPath = path.resolve(cwd(), "dist");
const jsFile = path.join(distPath, "vue3-zoomer.es.js");
const cssFile = "./style.css";

// Read the JS file
let jsContent = fs.readFileSync(jsFile, "utf8");

// Append the CSS import
jsContent = `import "${cssFile}";\n` + jsContent;

// Write back to the file
fs.writeFileSync(jsFile, jsContent);

console.log("CSS imported into vue3-zoomer.es.js");
