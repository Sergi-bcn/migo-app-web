let zCounter = 100;

function bringToFront(id) {
    zCounter++;
    const target = document.getElementById(id);
    if (target) {
        target.style.zIndex = zCounter;
        // Animación suave de enfoque
        target.style.transform = "scale(1.01)";
        setTimeout(() => target.style.transform = "scale(1)", 150);
    }
}

// Inicialización: repartir un poco las ventanas si se solapan
window.onload = () => {
    console.log("Migo Desktop Loaded");
};