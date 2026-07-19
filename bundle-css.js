const fs = require('fs');
const path = require('path');

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

let concatenatedCss = '';

cssFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    concatenatedCss += fs.readFileSync(fullPath, 'utf8') + '\n';
  } else {
    console.warn(`File not found: ${fullPath}`);
  }
});

fs.writeFileSync(path.join(__dirname, 'assets/css/style.css'), concatenatedCss);

// Basic minification: remove comments and extra whitespace
let minifiedCss = concatenatedCss
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
  .replace(/\s+/g, ' ') // Collapse whitespace
  .replace(/ {\s+/g, '{') // Remove space after {
  .replace(/;\s+/g, ';') // Remove space after ;
  .replace(/:\s+/g, ':') // Remove space after :
  .replace(/}\s+/g, '}') // Remove space after }
  .trim();

fs.writeFileSync(path.join(__dirname, 'assets/css/style.min.css'), minifiedCss);
console.log('CSS bundled and minified successfully.');
