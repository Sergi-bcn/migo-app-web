async function loadModule(id, path) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Error en ${path}`);
        const html = await response.text();
        el.innerHTML = html;
        
        // Si acabamos de cargar el traductor, nos aseguramos de que sus estilos estén listos
        if (id === 'popup-translate') {
            loadCSS('CSS/cssmodules/csswindows/wtranslator.css');
        }
    } catch (e) {
        console.error(`Error cargando ${id}:`, e);
    }
}

function loadCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    // Cargar componentes base
    await loadModule('slot-sidebar', 'htmlmodules/components/sidebar.html');
    await loadModule('slot-header', 'htmlmodules/components/header.html');
    await loadModule('slot-convers-content', 'htmlmodules/components/wconvers.html');

    // Cargar Ventanas
    await loadModule('popup-user', 'htmlmodules/windows/wuser.html');
    await loadModule('popup-config', 'htmlmodules/windows/wconfconvers.html');
    await loadModule('popup-translate', 'htmlmodules/windows/wtranslator.html');
});