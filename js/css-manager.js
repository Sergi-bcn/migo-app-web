// CSS-MANAGER.JS - Asegura que CSS se cargue en orden correcto
class CSSManager {
    constructor() {
        this.loaded = false;
    }
    
    // Verificar si todos los CSS están cargados
    checkAllCSSLoaded() {
        const stylesheets = document.styleSheets;
        let allLoaded = true;
        
        for (let i = 0; i < stylesheets.length; i++) {
            try {
                const rules = stylesheets[i].cssRules || stylesheets[i].rules;
                if (!rules) {
                    allLoaded = false;
                    break;
                }
            } catch (e) {
                allLoaded = false;
                break;
            }
        }
        
        if (allLoaded && !this.loaded) {
            this.loaded = true;
            document.documentElement.classList.add('css-loaded');
            console.log('✅ Todos los archivos CSS cargados correctamente');
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.cssManager = new CSSManager();
    
    // Verificar CSS periódicamente
    const checkInterval = setInterval(() => {
        window.cssManager.checkAllCSSLoaded();
        if (window.cssManager.loaded) {
            clearInterval(checkInterval);
        }
    }, 100);
});