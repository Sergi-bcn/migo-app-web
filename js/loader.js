async function loadModule(id, path) {
    const target = document.getElementById(id);
    if (!target) return;
    try {
        // Añadimos un timestamp para saltar la caché del navegador
        const response = await fetch(path + '?v=' + Date.now(), { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        target.innerHTML = html;
    } catch (err) {
        console.error("Error cargando módulo:", path, err);
        target.innerHTML = `<p style="color:red; padding:20px;">Error al cargar ${path}</p>`;
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar estructura base
    await loadModule('slot-sidebar', 'htmlmodules/components/sidebar.html');
    await loadModule('slot-header', 'htmlmodules/components/header.html');
    await loadModule('slot-register', 'htmlmodules/components/wregister.html');
    
    // 2. Cargar Ventanas (asegurando que los IDs existan en los módulos anteriores)
    await loadModule('popup-user', 'htmlmodules/windows/wuser.html');
    await loadModule('popup-config', 'htmlmodules/windows/wconfconvers.html');
    await loadModule('popup-translate', 'htmlmodules/windows/wtranslator.html');
});