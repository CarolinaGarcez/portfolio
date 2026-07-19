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

let consolidatedCSS = '';

cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    consolidatedCSS += `/* --- ${file} --- */\n`;
    const content = fs.readFileSync(file, 'utf-8');
    
    // Removing extra newlines and spaces, but keeping comments and variables
    const optimized = content
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n') // reduce multiple empty lines
      .trim();

    consolidatedCSS += optimized + '\n\n';
  } else {
    console.warn(`Warning: File not found - ${file}`);
  }
});

const outputDir = path.join('assets', 'css');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'style.min.css'), consolidatedCSS, 'utf-8');
console.log('Successfully generated assets/css/style.min.css');
