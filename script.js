let isBlocked = false;
let requiredText = "";
let currentRigor = "relaxed";

/* POPUPS */
function togglePopup(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = el.style.display === "block" ? "none" : "block";
}

/* CHAT */
function handleChatEnter(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function addChatMessage(text, type, error = false) {
    const chat = document.getElementById("chat-box");
    const div = document.createElement("div");
    div.className = `message ${type} ${error ? "error-msg" : ""}`;
    div.innerHTML = `
        <span class="msg-content">${text}</span>
        <button class="copy-msg-btn" onclick="copyText(this)">📋</button>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function copyText(btn) {
    const text = btn.parentElement.querySelector(".msg-content").innerText;
    navigator.clipboard.writeText(text);
}

/* SEND MESSAGE */
async function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();
    if (!text) return;

    addChatMessage(text, "user");
    input.value = "";

    if (isBlocked) {
        if (text === requiredText) {
            isBlocked = false;
            addChatMessage("Good! Let's continue 👍", "migo");
        } else {
            addChatMessage(`Please type exactly: "${requiredText}"`, "migo", true);
        }
        return;
    }

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, rigor: currentRigor })
        });

        const data = await res.json();

        if (data.wrong && data.right) {
            isBlocked = true;
            requiredText = data.right;
            addChatMessage(data.reply, "migo", true);
            logCorrection(data.wrong, data.right);
        } else {
            addChatMessage(data.reply, "migo");
        }

    } catch (e) {
        addChatMessage("Server error 😕", "migo", true);
    }
}

/* CORRECTIONS */
function logCorrection(wrong, right) {
    const log = document.getElementById("correction-log");
    const div = document.createElement("div");
    div.innerHTML = `
        <div style="color:red;text-decoration:line-through">${wrong}</div>
        <div style="color:green;font-weight:800">➜ ${right}</div>
    `;
    log.prepend(div);
}

/* OPTIONS */
function selectOption(el, target, value) {
    [...el.parentElement.children].forEach(c => c.classList.remove("active"));
    el.classList.add("active");
    document.getElementById(target).innerText = el.innerText;
    if (target === "status-rigor") currentRigor = value;
}

/* TRANSLATOR */
async function translateNow(sl, tl) {
    const text = document.getElementById("in-es").value;
    const out = document.getElementById("out-en");
    if (!text) return;
    out.innerText = "...";

    const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    out.innerText = data[0].map(x => x[0]).join("");
}
