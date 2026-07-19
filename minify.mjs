import fs from 'fs';
import path from 'path';

const cssFiles = [
  'css/padrao/base.css',
  'css/padrao/layout.css',
  'css/padrao/darkmode.css',
  'css/componentes/nav.css',
  'css/componentes/buttons.css',
  'css/componentes/footer.css',
  'css/pages/home/about.css',
  'css/pages/home/projects.css',
  'css/pages/home/contato.css',
  'css/pages/home/hero.css',
  'css/pages/home/seta.css',
  'css/pages/home/skills.css',
  'css/pages/home/redeslado.css',
  'css/pages/home/respon.css'
];

const jsFiles = [
  'js/animaçãohome.js',
  'js/seta.js',
  'js/darkmode.js',
  'js/menu.js'
];

// Ensure directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir('assets/css');
ensureDir('assets/js');

// CSS Minification function
const minifyCSS = (css) => {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with a single space
    .replace(/\s*([{}:;,>])\s*/g, '$1') // Remove spaces around brackets, colons, semicolons
    .trim();
};

// JS Minification function (basic)
const minifyJS = (js) => {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    // Single line comments starting with // but ignoring URLs like http://
    .replace(/(?<!:)\/\/.*/g, '') 
    .replace(/\r?\n|\r/g, ' ') // Replace newlines with space
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim();
};

let consolidatedCSS = '';
for (const file of cssFiles) {
  if (fs.existsSync(file)) {
    consolidatedCSS += fs.readFileSync(file, 'utf8') + '\n';
  } else {
    console.warn(`Warning: ${file} not found.`);
  }
}
fs.writeFileSync('assets/css/style.css', minifyCSS(consolidatedCSS));
console.log('Created assets/css/style.css');

let consolidatedJS = '';
for (const file of jsFiles) {
  if (fs.existsSync(file)) {
    // Add a semicolon in case the file doesn't end with one before minifying
    consolidatedJS += fs.readFileSync(file, 'utf8') + ';\n';
  } else {
    console.warn(`Warning: ${file} not found.`);
  }
}
fs.writeFileSync('assets/js/main.js', minifyJS(consolidatedJS));
console.log('Created assets/js/main.js');
