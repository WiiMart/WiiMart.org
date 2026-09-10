(() => {
    const storageKey = "bgmcurrenttime";
    let player = null;
    let audio = null;
    let playButton = null;
    let closeButton = null;
    let fadeFrame = null;
    let resumeTime = 0;
    let persistPlayback = true;

    function readResumeTime() {
        try {
            const value = Number.parseFloat(localStorage.getItem(storageKey) || "0");
            return Number.isFinite(value) && value > 0 ? value : 0;
        } catch {
            return 0;
        }
    }

    function saveResumeTime() {
        if (!audio || !persistPlayback) {
            return;
        }
        try {
            localStorage.setItem(storageKey, String(audio.currentTime || 0));
        } catch {
            return;
        }
    }

    function isConsoleBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        return userAgent.includes("wii") || userAgent.includes("nintendo");
    }

    function setButtonState(playing) {
        if (!playButton) {
            return;
        }
        playButton.textContent = playing ? "Pause" : "Play";
        playButton.setAttribute("aria-pressed", playing ? "true" : "false");
        playButton.disabled = false;
    }

    function cancelFade() {
        if (fadeFrame !== null) {
            cancelAnimationFrame(fadeFrame);
            fadeFrame = null;
        }
    }

    function fadeToPlaybackVolume() {
        cancelFade();
        const startedAt = performance.now();
        const startVolume = 0.01;
        const targetVolume = 0.8;
        playButton.disabled = true;
        const step = now => {
            const progress = Math.min(1, (now - startedAt) / 1000);
            audio.volume = startVolume + (targetVolume - startVolume) * progress;
            if (progress < 1 && !audio.paused) {
                fadeFrame = requestAnimationFrame(step);
                return;
            }
            fadeFrame = null;
            playButton.disabled = false;
        };
        fadeFrame = requestAnimationFrame(step);
    }

    async function playBGM(useFade = false) {
        if (!audio) {
            return;
        }
        if (resumeTime > 0 && audio.currentTime === 0) {
            try {
                audio.currentTime = Math.min(resumeTime, Number.isFinite(audio.duration) ? audio.duration : resumeTime);
            } catch {
                audio.currentTime = 0;
            }
        }
        audio.volume = useFade ? 0.01 : 0.8;
        try {
            await audio.play();
            setButtonState(true);
            if (useFade) {
                fadeToPlaybackVolume();
            }
            resumeTime = 0;
        } catch {
            setButtonState(false);
        }
    }

    function pauseBGM() {
        if (!audio) {
            return;
        }
        cancelFade();
        audio.pause();
        saveResumeTime();
        setButtonState(false);
    }

    function activatebgmplayer() {
        if (!player) {
            return;
        }
        player.classList.add("bgmplayerdisplayed");
        const title = document.getElementById("bgmplrtitle");
        if (title) {
            title.textContent = "BGM player";
            title.style.marginTop = "0px";
        }
        player.style.backdropFilter = "blur(1.8px)";
    }

    function deactivatebgmplayer() {
        if (!player) {
            return;
        }
        player.classList.remove("bgmplayerdisplayed");
        const title = document.getElementById("bgmplrtitle");
        if (title) {
            title.textContent = "bgm plr..";
            title.style.marginTop = "-5px";
        }
        player.style.backgroundColor = "#0000";
        player.style.border = "1px solid #34BEED";
        player.style.backdropFilter = "blur(0px)";
    }

    function focusPlayer() {
        const background = document.getElementById("backgroundd");
        activatebgmplayer();
        player.classList.add("bgmplayeropenanim");
        player.style.opacity = "100%";
        player.style.backgroundColor = "#1164e9da";
        player.style.border = "4px solid #34ededff";
        if (background) {
            background.style.display = "block";
            background.style.backgroundImage = "url('/meta/fadebg-bgm.png')";
        }
        window.setTimeout(() => {
            player.classList.remove("bgmplayeropenanim");
            player.classList.add("bgmplayerdisplayed");
            player.style.backgroundImage = "url('/meta/fadebg-bgm.png')";
            player.style.backgroundColor = "#0000";
            player.style.border = "2px solid #34BEED";
            if (background) {
                background.style.display = "none";
            }
        }, 500);
    }

    function initializePlayer() {
        player = document.getElementById("bgmplayer");
        if (!player || isConsoleBrowser()) {
            return;
        }
        playButton = document.getElementById("shopbgm");
        closeButton = document.getElementById("closebgm");
        if (!playButton || !closeButton) {
            return;
        }
        const source = player.dataset.audioSrc || "/meta/shop.wav";
        persistPlayback = player.dataset.audioPersist !== "false";
        resumeTime = persistPlayback ? readResumeTime() : 0;
        audio = new Audio(source);
        audio.loop = true;
        audio.preload = "metadata";
        audio.addEventListener("ended", () => setButtonState(false));
        audio.addEventListener("error", () => {
            pauseBGM();
            player.style.display = "none";
        });
        playButton.addEventListener("click", event => {
            event.stopPropagation();
            if (audio.paused) {
                void playBGM(resumeTime > 0);
            } else {
                pauseBGM();
            }
        });
        closeButton.addEventListener("click", event => {
            event.stopPropagation();
            deactivatebgmplayer();
        });
        player.addEventListener("click", event => {
            if (event.target === player || event.target.id === "bgmplayerBG" || event.target.id === "bgmplrtitle") {
                activatebgmplayer();
            }
        });
        window.setTimeout(() => {
            player.style.display = "block";
            setButtonState(false);
            if (resumeTime > 0 && persistPlayback) {
                focusPlayer();
            }
        }, 200);
    }

    document.addEventListener("DOMContentLoaded", initializePlayer);
    window.addEventListener("pagehide", saveResumeTime);
    window.playBGM = playBGM;
    window.pauseBGM = pauseBGM;
    window.activatebgmplayer = activatebgmplayer;
    window.deactivatebgmplayer = deactivatebgmplayer;
})();
