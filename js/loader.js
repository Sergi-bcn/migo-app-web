async function loadModule(id, path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Error cargando ${path}`);
        const html = await response.sent();
        document.getElementById(id).innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargamos componentes estructurales
    await loadModule('slot-sidebar', 'htmlmodules/components/sidebar.html');
    await loadModule('slot-header', 'htmlmodules/components/header.html');
    await loadModule('slot-register', 'htmlmodules/components/wregister.html');

    // 2. Cargamos las ventanas dentro de sus respectivos contenedores
    // Nota: El popup de usuario está dentro de sidebar.html
    // El popup de config y translate están dentro de header.html
    await loadModule('popup-user', 'htmlmodules/windows/wuser.html');
    await loadModule('popup-config', 'htmlmodules/windows/wconfconvers.html');
    await loadModule('popup-translate', 'htmlmodules/windows/wtranslator.html');
});