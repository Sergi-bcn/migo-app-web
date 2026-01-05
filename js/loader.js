/**
 * Carga un archivo CSS dinámicamente si no ha sido cargado previa mente
 * @param {string} href - Ruta del archivo CSS
 */
function loadCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
        console.log(`CSS Cargado: ${href}`);
    }
}

/**
 * Carga un módulo HTML en un contenedor específico
 * @param {string} id - ID del contenedor en el DOM
 * @param {string} path - Ruta del archivo .html
 */
async function loadModule(id, path) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Error al buscar ${path}`);
        const html = await response.text();
        el.innerHTML = html;
        console.log(`Módulo cargado: ${id}`);
    } catch (e) {
        console.error(`Error cargando módulo [${id}]:`, e);
    }
}

/**
 * Inicialización principal al cargar el DOM
 */
window.addEventListener('DOMContentLoaded', async () => {
    // 1. CARGA DE ESTILOS CRÍTICOS
    // Aseguramos que el CSS del traductor y de las ventanas esté presente
    loadCSS('CSS/cssmodules/csswindows/wtranslator.css');
    loadCSS('CSS/cssmodules/csswindows/wuser.css');
    loadCSS('CSS/cssmodules/csswindows/wconfconvers.css');

    // 2. CARGA DE MÓDULOS HTML
    // Cargamos primero la estructura principal
    await loadModule('slot-sidebar', 'htmlmodules/components/sidebar.html');
    await loadModule('slot-header', 'htmlmodules/components/header.html');
    await loadModule('slot-convers-content', 'htmlmodules/components/wconvers.html');

    // 3. CARGA DE VENTANAS EMERGENTES (POPUPS)
    // Estas se cargan dentro de los "anchors" definidos en los componentes anteriores
    await loadModule('popup-user', 'htmlmodules/windows/wuser.html');
    await loadModule('popup-config', 'htmlmodules/windows/wconfconvers.html');
    await loadModule('popup-translate', 'htmlmodules/windows/wtranslator.html');

    // 4. CARGA DE REGISTRO (Dentro de wconvers)
    await loadModule('slot-register', 'htmlmodules/components/wregister.html');
    
    console.log("Sistema de carga completado.");
});