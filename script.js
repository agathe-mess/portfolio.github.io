document.addEventListener("DOMContentLoaded", () => {
    const headers = document.querySelectorAll(".projects-header");

    // Traiter les éléments sans la classe "inverted"
    headers.forEach(header => {
        if (!header.classList.contains('inverted')) {
            const bgImage = header.querySelector(".projects-header-image")?.getAttribute("data-bg");
            if (bgImage) {
                header.style.setProperty("--bg-image", `url(${bgImage})`);
            }
        }
    });

    // Traiter les éléments avec la classe "inverted"
    headers.forEach(header => {
        if (header.classList.contains('inverted')) {
            const bgImage = header.querySelector(".projects-header-image")?.getAttribute("data-bg");
            if (bgImage) {
                header.style.setProperty("--bg-image", `url(${bgImage})`);
            }
        }
    });
});
