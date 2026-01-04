function togglePopup(event, popupId) {
    if (event) event.stopPropagation();
    const popup = document.getElementById(popupId);
    if (!popup) return;

    popup.classList.toggle('active');

    // Lógica de desplazamiento automático
    const config = document.getElementById('popup-config');
    const translate = document.getElementById('popup-translate');

    if (config.classList.contains('active') && translate.classList.contains('active')) {
        // Si ambas están abiertas, movemos la de configuración a la izquierda
        // 380px (ancho traductor) + 20px (separación) = 400px
        config.style.right = "400px";
    } else {
        // Si no, vuelve a su sitio
        config.style.right = "0px";
    }
}