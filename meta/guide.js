(() => {
    function showPanel(panelId) {
        const target = document.getElementById(panelId);
        if (!target) {
            return;
        }
        document.querySelectorAll(".row > .box").forEach(panel => {
            panel.style.display = "none";
        });
        target.style.display = "block";
    }

    async function copyCode(codeBlock) {
        const code = codeBlock.textContent.trim();
        try {
            await navigator.clipboard.writeText(code);
            codeBlock.classList.add("copied-flash");
            window.setTimeout(() => codeBlock.classList.remove("copied-flash"), 500);
        } catch {
            window.alert("Could not automatically copy the code. Please select and copy it manually.");
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("code").forEach(codeBlock => {
            codeBlock.tabIndex = 0;
            codeBlock.setAttribute("role", "button");
            codeBlock.setAttribute("aria-label", `Copy ${codeBlock.textContent.trim()}`);
        });
        document.addEventListener("click", event => {
            const origin = event.target instanceof Element ? event.target : null;
            const panelButton = origin ? origin.closest("[data-show-panel]") : null;
            if (panelButton) {
                showPanel(panelButton.dataset.showPanel);
                return;
            }
            const codeBlock = origin ? origin.closest("code") : null;
            if (codeBlock) {
                void copyCode(codeBlock);
            }
        });
        document.addEventListener("keydown", event => {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }
            const codeBlock = event.target instanceof Element ? event.target.closest("code") : null;
            if (codeBlock) {
                event.preventDefault();
                void copyCode(codeBlock);
            }
        });
    });
})();
