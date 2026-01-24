async function loadComponent(id, url) {
    const res = await fetch(url);
    if (res.ok) {
        document.getElementById(id).innerHTML = await res.text();
        if (window.lucide) lucide.createIcons();
    }
}

function migoApp() {
    return {
        userInput: '', loading: false, correction: '', isBlocked: false,
        transES: '', transEN: '', // Variables para el traductor
        popups: { config: false, trans: false, user: false },
        config: { rigor: 'Normal', modo: 'Colloquial' },
        messages: [{ role: 'migo', text: 'Hello! I am Migo. Ready to learn?' }],

        async init() {
            await Promise.all([
                loadComponent('mw-navbar', '/components/navbar.html'),
                loadComponent('mw-corrections', '/components/corrections.html'),
                loadComponent('mw-chat', '/components/chat-main.html'),
                loadComponent('mw-popup-config', '/components/config-modal.html'),
                loadComponent('mw-popup-trans', '/components/trans-modal.html'),
                loadComponent('mw-popup-user', '/components/user-modal.html')
            ]);
            this.$watch('messages', () => {
                const el = document.getElementById('chat-scroll');
                if(el) setTimeout(() => el.scrollTop = el.scrollHeight, 50);
            });
        },

        async translate(type) {
            console.log("Traduciendo:", type);
            // Aquí iría la llamada a tu API de traducción
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
                    body: JSON.stringify({ rigor: this.config.rigor, modo: this.config.modo, messages: this.messages })
                });
                const data = await res.json();
                this.messages.push({ role: 'migo', text: data.reply });
                this.correction = data.hasError ? `<div class="fix-card">${data.fix}</div>` : "Perfect!";
                if (data.blocked && this.config.rigor === 'Strict') this.isBlocked = true;
            } catch (e) { console.error(e); }
            finally { this.loading = false; lucide.createIcons(); }
        },
        unblock() { this.isBlocked = false; this.correction = ''; }
    }
}