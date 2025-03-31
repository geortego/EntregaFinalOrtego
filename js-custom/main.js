document.addEventListener("DOMContentLoaded", () => {
    const solicitarTab = document.querySelector('a[href="solicitar.html"]');

    if (solicitarTab) {
        solicitarTab.addEventListener("click", (event) => {
            event.preventDefault();
            const userConfirmed = confirm(
                "Para acceder a Solicitar entrevista, primero debe registrarse.\n\n¿Desea ir a la página de Ingreso?"
            );
            if (userConfirmed) {
                window.location.href = "ingreso.html";
            }
        });
    }
});