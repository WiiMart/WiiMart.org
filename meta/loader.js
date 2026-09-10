(() => {
    let loadingAudio = null;
    let volumeTimer = null;
    let stopTimer = null;

    window.spinnerallowed = true;

    function getSpinnerBackground() {
        return document.getElementById("wscspinnerbg");
    }

    function stopspinner() {
        const background = getSpinnerBackground();
        if (background) {
            background.style.display = "none";
        }
        if (stopTimer) {
            window.clearTimeout(stopTimer);
            stopTimer = null;
        }
        if (volumeTimer) {
            window.clearTimeout(volumeTimer);
            volumeTimer = null;
        }
        if (loadingAudio) {
            loadingAudio.pause();
            loadingAudio = null;
        }
    }

    function raiseLoadingVolume() {
        if (!loadingAudio) {
            return;
        }
        const nextVolume = Math.min(0.4, loadingAudio.volume + 0.01);
        loadingAudio.volume = nextVolume;
        if (nextVolume < 0.4) {
            volumeTimer = window.setTimeout(raiseLoadingVolume, 100);
        }
    }

    function showspinner() {
        if (!window.spinnerallowed) {
            window.spinnerallowed = true;
            return;
        }
        const background = getSpinnerBackground();
        if (!background) {
            return;
        }
        stopspinner();
        background.style.display = "block";
        stopTimer = window.setTimeout(stopspinner, 3100);
        try {
            loadingAudio = new Audio("/media/load.wav");
            loadingAudio.loop = true;
            loadingAudio.volume = 0.01;
            const playResult = loadingAudio.play();
            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(() => {
                    loadingAudio = null;
                });
            }
            raiseLoadingVolume();
        } catch {
            loadingAudio = null;
        }
    }

    function loadrimg() {
        const spinner = document.getElementById("wscspinner");
        if (spinner) {
            spinner.style.outline = "none";
        }
    }

    function isConsoleBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        return userAgent.includes("wii") || userAgent.includes("nintendo");
    }

    function shouldShowForLink(link) {
        if (link.hasAttribute("download") || link.hasAttribute("data-no-spinner")) {
            return false;
        }
        if (link.target && link.target.toLowerCase() !== "_self") {
            return false;
        }
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || /^(?:javascript:|mailto:|tel:)/i.test(href)) {
            return false;
        }
        let destination;
        try {
            destination = new URL(href, window.location.href);
        } catch {
            return false;
        }
        if (destination.origin !== window.location.origin) {
            return false;
        }
        return destination.pathname !== window.location.pathname || destination.search !== window.location.search;
    }

    document.addEventListener("DOMContentLoaded", () => {
        const background = getSpinnerBackground();
        if (background) {
            background.style.display = "none";
        }
        const spinner = document.getElementById("wscspinner");
        if (spinner) {
            if (spinner.complete) {
                loadrimg();
            } else {
                spinner.addEventListener("load", loadrimg, { once: true });
            }
        }
        if (isConsoleBrowser()) {
            window.spinnerallowed = false;
            return;
        }
        document.addEventListener("click", event => {
            const origin = event.target instanceof Element ? event.target : event.target.parentElement;
            const link = origin ? origin.closest("a[href]") : null;
            if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }
            if (link.hasAttribute("data-history-back")) {
                if (window.history.length > 1) {
                    event.preventDefault();
                    window.history.back();
                }
                return;
            }
            if (shouldShowForLink(link)) {
                showspinner();
            }
        });
    });

    window.addEventListener("pageshow", stopspinner);
    window.addEventListener("pagehide", stopspinner);
    window.showspinner = showspinner;
    window.stopspinner = stopspinner;
    window.loadrimg = loadrimg;
})();
