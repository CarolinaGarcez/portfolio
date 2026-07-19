import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function main() {
    const dirs = ['img', 'img/projetos', 'img/bg'];
    let count = 0;
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            if (file.match(/\.(png|jpg|jpeg)$/i)) {
                const input = path.join(dir, file);
                const output = input.replace(/\.(png|jpg|jpeg)$/i, '.webp');
                console.log(`Converting ${input} to ${output}`);
                await sharp(input).webp().toFile(output);
                count++;
            }
        }
    }
    console.log(`Converted ${count} images.`);
}
main().catch(console.error);
