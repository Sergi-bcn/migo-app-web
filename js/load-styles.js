// LOAD-STYLES.JS - Para desarrollo, carga CSS dinámicamente
(function() {
    // Solo ejecutar en desarrollo
    if (window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
        return;
    }
    
    console.log('🔧 Modo desarrollo: Cargando CSS individualmente');
    
    const cssFiles = [
        'css/base.css',
        'css/layout.css',
        'css/nav.css',
        'css/chat.css',
        'css/profile.css',
        'css/translator.css',
        'css/chat-config.css',
        'css/components.css'
    ];
    
    let loadedCount = 0;
    
    cssFiles.forEach(file => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = file;
        link.onload = () => {
            loadedCount++;
            console.log(`✓ ${file} cargado`);
            
            if (loadedCount === cssFiles.length) {
                console.log('🎉 Todos los archivos CSS cargados');
                if (window.cssManager) {
                    window.cssManager.checkAllCSSLoaded();
                }
            }
        };
        document.head.appendChild(link);
    });
})();