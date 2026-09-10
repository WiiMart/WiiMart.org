(() => {
    let titleClicks = 0;

    function playSound(source) {
        const audio = new Audio(source);
        const result = audio.play();
        if (result && typeof result.catch === "function") {
            result.catch(() => undefined);
        }
    }

    function swimFish() {
        const fish = document.createElement("img");
        fish.id = "fishiee";
        fish.src = "/media/fishie_swim_right-twa.gif";
        fish.alt = "";
        document.body.appendChild(fish);
        window.setTimeout(() => fish.remove(), 800);
    }

    function handleTitleClick(event) {
        event.preventDefault();
        const title = event.currentTarget;
        const skip = document.getElementById("animskip");
        titleClicks += 1;
        if (titleClicks === 1) {
            playSound("/media/sound-fishie-scream1.wav");
            title.style.color = "#ff9d1e";
            if (skip) {
                skip.style.display = "inline-block";
            }
            return;
        }
        if (titleClicks === 2) {
            playSound("/media/sound-fishie-scream2.wav");
            title.style.color = "#e66f00";
            return;
        }
        playSound("/media/sound-fishie-scream3.wav");
        title.style.color = "#db7012";
        document.body.style.transition = ".5s ease-in-out";
        document.body.style.filter = "blur(3px)";
        swimFish();
        window.setTimeout(() => {
            document.body.style.filter = "blur(0px)";
            window.location.href = "/";
        }, 480);
    }

    function cycleEmblem() {
        const emblem = document.getElementById("emCycle");
        if (!emblem) {
            return;
        }
        const sources = ["meta/em-wiiware.svg", "meta/em-virtual-console.svg", "meta/em-channels.svg"];
        let index = 0;
        const fadeDuration = 300;
        const displayDuration = 1200;
        const cycle = () => {
            emblem.classList.add("fade");
            window.setTimeout(() => {
                index = (index + 1) % sources.length;
                emblem.src = sources[index];
                emblem.classList.remove("fade");
                window.setTimeout(cycle, displayDuration + fadeDuration);
            }, fadeDuration);
        };
        window.setTimeout(cycle, displayDuration);
    }

    document.addEventListener("DOMContentLoaded", () => {
        const title = document.getElementById("fishietitle");
        if (title) {
            title.addEventListener("click", handleTitleClick);
        }
        cycleEmblem();
    });
})();
