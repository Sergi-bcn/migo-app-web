// Función para cargar "mini-webs" de forma independiente
async function injectModule(id, htmlUrl) {
    try {
        const response = await fetch(htmlUrl);
        if (!response.ok) throw new Error(`Error cargando ${htmlUrl}`);
        const html = await response.text();
        document.getElementById(id).innerHTML = html;
        if (window.lucide) lucide.createIcons(); // Activar iconos tras inyectar
    } catch (err) {
        console.error(err);
    }
}

function migoApp() {
    return {
        userInput: '', loading: false, correction: '', isBlocked: false,
        popups: { config: false, trans: false, user: false },
        config: { rigor: 'Normal', modo: 'Colloquial' },
        messages: [{ role: 'migo', text: 'Hello! Ready to learn?' }],

        async init() {
            // El index.html llama a las otras "webs" (componentes)
            await Promise.all([
                injectModule('mod-navbar', '/components/navbar.html'),
                injectModule('mod-corrections', '/components/corrections.html'),
                injectModule('mod-chat-main', '/components/chat-main.html'),
                injectModule('mod-config', '/components/config-modal.html'),
                injectModule('mod-trans', '/components/trans-modal.html'),
                injectModule('mod-user', '/components/user-modal.html')
            ]);

            this.$watch('messages', () => {
                const el = document.getElementById('chat-scroll');
                if (el) setTimeout(() => el.scrollTop = el.scrollHeight, 50);
            });
        },

        async send() {
            if (!this.userInput.trim() || this.loading || this.isBlocked) return;
            const text = this.userInput;
            this.messages.push({ role: 'user', text });
            this.userInput = ''; this.loading = true;
            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...this.config, messages: this.messages })
                });
                const data = await res.json();
                this.messages.push({ role: 'migo', text: data.reply });
                this.correction = data.hasError ? `<div class="fix-box">${data.fix}</div>` : "Perfect!";
                if (data.blocked && this.config.rigor === 'Strict') this.isBlocked = true;
            } catch (e) { 
                this.messages.push({ role: 'migo', text: "Error de conexión." });
            } finally { 
                this.loading = false; 
                if(window.lucide) lucide.createIcons(); 
            }
        },
        unblock() { this.isBlocked = false; this.correction = ''; }
    }
}