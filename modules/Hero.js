export const renderHero = () => {
    return `
    <section class="hero" style="padding:100px 10% 60px; text-align:center; background:#fff;">
        <div style="margin-bottom:20px;">
            <span style="background:#e6f2ff; color:#0070f3; padding:6px 15px; border-radius:20px; font-size:0.8rem; font-weight:600;">Versión Modular 2.0</span>
        </div>
        <h1 style="font-size:clamp(2.5rem, 8vw, 4.5rem); letter-spacing:-3px; margin:0 0 20px 0; line-height:1; font-weight:800; color:#000;">
            Gestiona tu vida con <br> 
            <span style="background:linear-gradient(90deg, #0070f3, #00dfd8); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Migo App</span>
        </h1>
        <p style="color:#666; font-size:1.25rem; max-width:650px; margin:0 auto 40px; line-height:1.6;">
            La herramienta minimalista diseñada para que te enfoques en lo que realmente importa. Sin distracciones, solo productividad.
        </p>
        <div style="display:flex; gap:15px; justify-content:center;">
            <button style="background:#000; color:#fff; border:none; padding:15px 35px; border-radius:8px; font-size:1rem; font-weight:600; cursor:pointer;">Pruébalo Gratis</button>
            <button style="background:#fff; color:#000; border:1px solid #eaeaea; padding:15px 35px; border-radius:8px; font-size:1rem; font-weight:600; cursor:pointer;">Ver Demo</button>
        </div>
    </section>
    `;
};