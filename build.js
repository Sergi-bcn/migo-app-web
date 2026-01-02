// BUILD.JS - Combina todos los CSS en un solo archivo
const fs = require('fs');
const path = require('path');

console.log('🔨 Construyendo bundle CSS...\n');

const cssFiles = [
    'base.css',
    'layout.css', 
    'nav.css',
    'chat.css',
    'profile.css',
    'translator.css',
    'chat-config.css',
    'components.css'
];

let bundleContent = `/* ============================================
   MIGO WEB - CSS BUNDLE
   Generado automáticamente - NO EDITAR DIRECTAMENTE
   ============================================ */

`;

cssFiles.forEach(file => {
    const filePath = path.join(__dirname, 'css', file);
    
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        bundleContent += `\n/* =========== ${file} =========== */\n\n`;
        bundleContent += content + '\n';
        console.log(`✓ ${file}`);
    } else {
        console.log(`✗ ${file} (no encontrado)`);
    }
});

// Guardar bundle
fs.writeFileSync('css/bundle.css', bundleContent);
console.log('\n✅ Bundle creado: css/bundle.css');

// Crear versión minificada
const minified = bundleContent
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*\{\s*/g, '{')
    .replace(/\s*\}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .trim();

fs.writeFileSync('css/bundle.min.css', minified);
console.log(`✅ Minificado: css/bundle.min.css (${minified.length} bytes)`);