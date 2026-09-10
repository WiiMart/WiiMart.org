(() => {
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("figure").forEach(figure => {
            const image = figure.querySelector("img");
            const sound = figure.querySelector("audio");
            if (!image || !sound) {
                return;
            }
            image.tabIndex = 0;
            image.setAttribute("role", "button");
            image.setAttribute("aria-label", `Play sound for ${image.alt || "credit"}`);
            const play = () => {
                const playback = new Audio(sound.src);
                const result = playback.play();
                if (result && typeof result.catch === "function") {
                    result.catch(() => undefined);
                }
            };
            image.addEventListener("click", play);
            image.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    play();
                }
            });
        });
    });
})();
