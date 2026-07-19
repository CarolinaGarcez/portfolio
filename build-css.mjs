import fs from 'fs';
import path from 'path';

// Arquivos CSS em ordem de dependência
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

function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários
        .replace(/\s+/g, ' ')             // Substitui múltiplos espaços por um
        .replace(/\s*([\{\}\:\;\,])\s*/g, '$1') // Remove espaços ao redor de chaves, dois-pontos, ponto-e-vírgula e vírgulas
        .trim();
}

async function buildCSS() {
    console.log('Iniciando o build de CSS...');
    let combinedCSS = '';

    for (const file of cssFiles) {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            combinedCSS += content + '\n';
            console.log(`- ${file} lido com sucesso.`);
        } else {
            console.warn(`[AVISO] Arquivo não encontrado: ${file}`);
        }
    }

    const minifiedCSS = minifyCSS(combinedCSS);
    
    // Certifique-se de que a pasta existe
    const outputDir = 'assets/css';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'style.min.css');
    fs.writeFileSync(outputPath, minifiedCSS, 'utf8');
    console.log(`\nBuild concluído! Arquivo gerado em: ${outputPath}`);
}

buildCSS();
