// Función para cargar módulos HTML
async function loadModule(id, path) {
    const target = document.getElementById(id);
    if (!target) return;
    try {
        const response = await fetch(path);
        const html = await response.text();
        target.innerHTML = html;
    } catch (err) {
        console.error("Error cargando módulo:", path, err);
    }
}

// Cargar todo al iniciar
window.addEventListener('DOMContentLoaded', async () => {
    // Cargamos Sidebar y Header primero
    await loadModule('slot-sidebar', 'htmlmodules/components/sidebar.html');
    await loadModule('slot-header', 'htmlmodules/components/header.html');
    
    // Cargamos paneles principales
    await loadModule('slot-register', 'htmlmodules/components/wregister.html');
    
    // Cargamos las ventanas emergentes (Popups)
    // Buscamos los contenedores que están dentro de los módulos ya cargados
    await loadModule('popup-user', 'htmlmodules/windows/wuser.html');
    await loadModule('popup-config', 'htmlmodules/windows/wconfconvers.html');
    await loadModule('popup-translate', 'htmlmodules/windows/wtranslator.html');
});