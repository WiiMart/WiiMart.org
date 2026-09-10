(() => {
    function updateConversions(activeInput, inputs) {
        const value = Number.parseFloat(activeInput.value) || 0;
        if (activeInput === inputs.blocks) {
            inputs.megabytes.value = (value * 0.128).toFixed(2);
            inputs.gigabytes.value = (value * 0.000125).toFixed(4);
        } else if (activeInput === inputs.megabytes) {
            inputs.blocks.value = (value / 0.128).toFixed(2);
            inputs.gigabytes.value = (value / 1024).toFixed(4);
        } else {
            inputs.megabytes.value = (value * 1024).toFixed(2);
            inputs.blocks.value = (value * 1024 / 0.128).toFixed(2);
        }
    }

    function generateCode() {
        const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        const segments = Array.from({ length: 4 }, () => {
            return Array.from({ length: 4 }, () => charset[Math.floor(Math.random() * charset.length)]).join("");
        });
        const output = document.getElementById("code");
        if (output) {
            output.textContent = segments.join("-");
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const inputs = {
            blocks: document.getElementById("blocks"),
            megabytes: document.getElementById("mega"),
            gigabytes: document.getElementById("giga")
        };
        if (inputs.blocks && inputs.megabytes && inputs.gigabytes) {
            Object.values(inputs).forEach(input => {
                input.addEventListener("input", () => updateConversions(input, inputs));
            });
        }
        const generateButton = document.querySelector("[data-generate-code]");
        if (generateButton) {
            generateButton.addEventListener("click", generateCode);
        }
    });

    window.generateCode = generateCode;
})();
