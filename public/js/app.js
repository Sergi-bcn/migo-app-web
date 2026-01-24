async function loadComponent(id, url) {
    const res = await fetch(url);
    if (res.ok) {
        document.getElementById(id).innerHTML = await res.text();
        if (window.lucide) lucide.createIcons();
    }
}

function migoApp() {
    return {
        userInput: '', loading: false, correction: '',
        transES: '', transEN: '', resES: '', resEN: '',
        popups: { config: false, trans: false, user: false },
        config: { rigor: 'Normal', modo: 'Colloquial' },
        messages: [{ role: 'migo', text: 'Hello! I am Migo. Ready? / ¡Hola! Soy Migo. ¿Listo?' }],

        async init() {
            await Promise.all([
                loadComponent('mw-navbar', '/components/navbar.html'),
                loadComponent('mw-corrections', '/components/corrections.html'),
                loadComponent('mw-chat', '/components/chat-main.html'),
                loadComponent('mw-popup-config', '/components/config-modal.html'),
                loadComponent('mw-popup-trans', '/components/trans-modal.html'),
                loadComponent('mw-popup-user', '/components/user-modal.html')
            ]);
        },

        togglePopup(name) { this.popups[name] = !this.popups[name]; },

        async translate(sl, tl, text) {
            if (!text.trim()) { this.resEN = ''; this.resES = ''; return; }
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURI(text)}`;
            try {
                const res = await fetch(url);
                const data = await res.json();
                if (tl === 'en') this.resEN = data[0][0][0];
                else this.resES = data[0][0][0];
            } catch (e) { console.error("Error", e); }
        },

        async send() {
            if (!this.userInput.trim() || this.loading) return;
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
                this.correction = data.hasError ? `<div class="fix-card">${data.fix}</div>` : "Perfect! / ¡Perfecto!";
            } finally { 
                this.loading = false; 
                if(window.lucide) lucide.createIcons();
                setTimeout(() => { 
                    const chat = document.getElementById('chat-scroll');
                    if(chat) chat.scrollTop = chat.scrollHeight; 
                }, 100);
            }
        }
    }
}