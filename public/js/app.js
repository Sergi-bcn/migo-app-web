async function loadComponent(id, url) {
    try {
        const res = await fetch(url);
        if (res.ok) {
            document.getElementById(id).innerHTML = await res.text();
            if (window.lucide) lucide.createIcons();
        }
    } catch (e) { console.error("Error cargando componente:", id, e); }
}

function migoApp() {
    return {
        userInput: '', loading: false, correction: '', isBlocked: false,
        transES: '', transEN: '', resES: '', resEN: '',
        popups: { config: false, trans: false, user: false },
        config: { rigor: 'Normal', modo: 'Colloquial' },
        messages: [{ role: 'migo', text: 'Hello! I am Migo. Ready to learn?' }],

        async init() {
            // Cargamos todo al iniciar
            await loadComponent('mw-navbar', '/components/navbar.html');
            await loadComponent('mw-corrections', '/components/corrections.html');
            await loadComponent('mw-chat', '/components/chat-main.html');
            await loadComponent('mw-popup-config', '/components/config-modal.html');
            await loadComponent('mw-popup-trans', '/components/trans-modal.html');
            await loadComponent('mw-popup-user', '/components/user-modal.html');
        },

        togglePopup(name) {
            // Cambia el estado individualmente permitiendo que varias estén abiertas
            this.popups[name] = !this.popups[name];
        },

        async translate(sl, tl, text) {
            if (!text.trim()) return;
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURI(text)}`;
            try {
                const res = await fetch(url);
                const data = await res.json();
                if (tl === 'en') this.resEN = data[0][0][0];
                else this.resES = data[0][0][0];
            } catch (e) { console.error("Error", e); }
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
                this.correction = data.hasError ? `<div class="fix-card">${data.fix}</div>` : "¡Perfecto!";
                if (data.blocked && this.config.rigor === 'Strict') this.isBlocked = true;
            } finally { 
                this.loading = false; 
                lucide.createIcons();
                setTimeout(() => { document.getElementById('chat-scroll').scrollTop = 99999; }, 100);
            }
        },
        unblock() { this.isBlocked = false; this.correction = ''; }
    }
}