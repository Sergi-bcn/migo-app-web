export const renderFeatures = () => {
    return `
    <section id="features" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:30px; padding:60px 10%; background:#fafafa; border-top:1px solid #eaeaea;">
        <div style="background:#fff; padding:30px; border-radius:12px; border:1px solid #eaeaea; transition:0.3s;" onmouseover="this.style.borderColor='#0070f3'" onmouseout="this.style.borderColor='#eaeaea'">
            <i data-lucide="shield" style="color:#0070f3; margin-bottom:15px;"></i>
            <h3 style="margin:10px 0; font-size:1.4rem;">Seguridad Total</h3>
            <p style="color:#666; line-height:1.5;">Tus datos se encriptan localmente para que nadie más tenga acceso a ellos.</p>
        </div>
        <div style="background:#fff; padding:30px; border-radius:12px; border:1px solid #eaeaea; transition:0.3s;" onmouseover="this.style.borderColor='#0070f3'" onmouseout="this.style.borderColor='#eaeaea'">
            <i data-lucide="layout" style="color:#0070f3; margin-bottom:15px;"></i>
            <h3 style="margin:10px 0; font-size:1.4rem;">Diseño Modular</h3>
            <p style="color:#666; line-height:1.5;">Personaliza tu panel de control arrastrando y soltando las piezas que necesites.</p>
        </div>
    </section>
    `;
};