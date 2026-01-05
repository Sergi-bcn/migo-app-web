window.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadModule('slot-sidebar', 'htmlmodules/components/sidebar.html'),
        loadModule('slot-header', 'htmlmodules/components/header.html'),
        loadModule('slot-register', 'htmlmodules/components/wregister.html'),
        // Las ventanas ahora se inyectan tras el header/sidebar
        loadModule('popup-user', 'htmlmodules/windows/wuser.html'),
        loadModule('popup-config', 'htmlmodules/windows/wconfconvers.html'),
        loadModule('popup-translate', 'htmlmodules/windows/wtranslator.html')
    ]);
});