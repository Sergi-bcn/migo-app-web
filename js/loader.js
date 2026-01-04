async function loadModule(id, path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`No se pudo cargar: ${path}`);
        const html = await response.text();
        document.getElementById(id).innerHTML = html;
        console.log(`Cargado: ${path}`);
    } catch (err) {
        console.error("Fallo en el cargador modular:", err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar Componentes Fijos
    await loadModule('slot-register', 'htmlmodules/components/wregister.html');
    await loadModule('slot-convers', 'htmlmodules/components/wconvers.html');
    
    // 2. Cargar Ventanas Emergentes
    await loadModule('popup-user', 'htmlmodules/windows/wuser.html');
    await loadModule('popup-config', 'htmlmodules/windows/wconfconvers.html');
    await loadModule('popup-translate', 'htmlmodules/windows/wtranslator.html');
});