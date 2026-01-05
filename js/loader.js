async function loadModule(id, path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Error: ${path}`);
        const html = await response.text(); // Corregido: .text() es el método correcto
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    } catch (err) {
        console.error("Fallo al cargar módulo:", err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    // Carga de componentes
    await loadModule('slot-sidebar', 'htmlmodules/components/sidebar.html');
    await loadModule('slot-header', 'htmlmodules/components/header.html');
    await loadModule('slot-register', 'htmlmodules/components/wregister.html');
    await loadModule('slot-convers-content', 'htmlmodules/components/wconvers.html');

    // Carga de ventanas (Popups)
    await loadModule('popup-user', 'htmlmodules/windows/wuser.html');
    await loadModule('popup-config', 'htmlmodules/windows/wconfconvers.html');
    await loadModule('popup-translate', 'htmlmodules/windows/wtranslator.html');
});