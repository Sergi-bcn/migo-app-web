export const renderNavbar = () => {
    return `
    <nav class="navbar" style="display:flex; justify-content:space-between; align-items:center; padding:1.5rem 10%; background:#fff; border-bottom:1px solid #eaeaea; position:sticky; top:0; z-index:1000;">
        <div class="logo" style="display:flex; align-items:center; gap:8px; font-weight:bold; font-size:1.3rem;">
            <i data-lucide="zap" style="color:#0070f3;"></i>
            <span>Migo</span>
        </div>
        <div class="nav-links" style="display:flex; gap:25px; align-items:center;">
            <a href="#features" style="text-decoration:none; color:#666; font-size:0.9rem;">Funciones</a>
            <button style="background:#000; color:#fff; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; font-weight:500;">Descargar</button>
        </div>
    </nav>
    `;
};