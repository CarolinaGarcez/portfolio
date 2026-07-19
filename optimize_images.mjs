import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directories = ['img', 'img/projetos'];
const htmlPath = 'index.html';
const imageStats = {};

async function processImages() {
  for (const dir of directories) {
    if (!fs.existsSync(dir)) continue;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const filePath = path.join(dir, file);
        const webpPath = path.join(dir, file.replace(ext, '.webp'));
        
        try {
          // Optimize and convert to webp
          await sharp(filePath)
            .webp({ quality: 80, effort: 6 })
            .toFile(webpPath);
            
          console.log(`Converted ${file} to .webp`);
          
          // Get metadata to inject width and height
          const metadata = await sharp(webpPath).metadata();
          
          // Store stats with posix path separator for html matching
          const htmlImgSrc = `${dir}/${path.basename(webpPath)}`.replace(/\\/g, '/');
          const originalSrc = `${dir}/${file}`.replace(/\\/g, '/');
          
          imageStats[htmlImgSrc] = metadata;
          imageStats[originalSrc] = metadata; // Keep both for lookup
        } catch (err) {
          console.error(`Failed to process ${file}:`, err);
        }
      }
    }
  }
}

async function updateHTML() {
  if (!fs.existsSync(htmlPath)) return;
  
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // A regex to match img tags
  // We need to carefully replace src and add width/height and loading.
  html = html.replace(/<img([^>]*)>/g, (match, attrs) => {
    // Check if it has a src
    const srcMatch = attrs.match(/src=["']([^"']+)["']/);
    if (!srcMatch) return match;
    
    let src = srcMatch[1];
    
    // Change .png/.jpg to .webp
    src = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    attrs = attrs.replace(/src=["'][^"']+["']/, `src="${src}"`);
    
    // Get dimensions if we know them
    const stats = imageStats[src];
    if (stats) {
      if (!attrs.includes('width=')) attrs += ` width="${stats.width}"`;
      if (!attrs.includes('height=')) attrs += ` height="${stats.height}"`;
    }
    
    // Determine loading strategy
    const isHero = src.includes('perfila') || src.includes('pc') || src.includes('logo');
    if (isHero) {
      // Remove lazy if it was there mistakenly, add eager
      attrs = attrs.replace(/\bloading=["'](lazy|eager)["']\s*/g, '');
      attrs += ` loading="eager"`;
    } else {
      // It's not a hero image, so it should be lazy
      if (!attrs.includes('loading=')) {
        attrs += ` loading="lazy"`;
      }
    }
    
    return `<img${attrs}>`;
  });
  
  fs.writeFileSync(htmlPath, html);
  console.log('Updated index.html with new image references and dimensions.');
}

async function main() {
  console.log('Processing images...');
  await processImages();
  console.log('Updating HTML...');
  await updateHTML();
  console.log('Done.');
}

main();
