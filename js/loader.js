async function loadModule(id, path) {
    const response = await fetch(path);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
}

window.addEventListener('DOMContentLoaded', async () => {
    // Componentes Fijos
    await loadModule('slot-register', 'htmlmodules/components/wregister.html');
    await loadModule('slot-convers', 'htmlmodules/components/wconvers.html');
    // Ventanas Emergentes
    await loadModule('popup-user', 'htmlmodules/windows/wuser.html');
    await loadModule('popup-config', 'htmlmodules/windows/wconfconvers.html');
    await loadModule('popup-translate', 'htmlmodules/windows/wtranslator.html');
});