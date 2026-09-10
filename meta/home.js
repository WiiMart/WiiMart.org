(() => {
    function showUpdateNotice() {
        const notice = document.getElementById("wednesdaytitles");
        if (notice && new Date().getDay() === 3) {
            notice.style.display = "block";
        }
    }

    function setHelpVisibility(visible) {
        const help = document.getElementById("whatiswsw");
        const background = document.getElementById("backgroundd");
        const openButton = document.querySelector("[data-open-update-help]");
        const closeButton = document.querySelector("[data-close-update-help]");
        if (help) {
            help.style.display = visible ? "block" : "none";
            help.setAttribute("aria-hidden", visible ? "false" : "true");
        }
        if (openButton) {
            openButton.setAttribute("aria-expanded", visible ? "true" : "false");
        }
        if (background) {
            background.style.display = visible ? "block" : "none";
            if (visible) {
                background.style.backgroundImage = "url('/meta/fadebg-wmw.png')";
            }
        }
        if (visible && closeButton) {
            closeButton.focus();
        } else if (!visible && openButton && document.activeElement === closeButton) {
            openButton.focus();
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        showUpdateNotice();
        const openButton = document.querySelector("[data-open-update-help]");
        const closeButton = document.querySelector("[data-close-update-help]");
        if (openButton) {
            openButton.addEventListener("click", event => {
                event.preventDefault();
                setHelpVisibility(true);
            });
        }
        if (closeButton) {
            closeButton.addEventListener("click", () => setHelpVisibility(false));
        }
        document.addEventListener("keydown", event => {
            const help = document.getElementById("whatiswsw");
            if (event.key === "Escape" && help?.getAttribute("aria-hidden") === "false") {
                setHelpVisibility(false);
            }
        });
    });

    window.WiiMartWednesday = showUpdateNotice;
    window.whatiswmw = () => setHelpVisibility(true);
    window.whatiswmwclose = () => setHelpVisibility(false);
})();
