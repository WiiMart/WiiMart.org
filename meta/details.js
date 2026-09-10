(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");

    function restoreDate(details, date, container) {
        const summary = details.querySelector("summary");
        if (!summary || !container || !container.contains(date)) {
            return;
        }
        date.style.removeProperty("float");
        summary.appendChild(date);
        container.remove();
    }

    function moveDate(details, date) {
        if (!date.parentElement || date.parentElement.tagName.toLowerCase() !== "summary") {
            return;
        }
        date.style.float = "none";
        const container = document.createElement("div");
        container.dataset.movedDate = "";
        container.style.textAlign = "center";
        container.style.marginTop = "10px";
        container.style.fontStyle = "normal";
        container.appendChild(date);
        details.appendChild(container);
    }

    function refreshImportantInfoDates() {
        document.querySelectorAll(".details-impt-info").forEach(details => {
            const date = details.querySelector(".date");
            if (!date) {
                return;
            }
            const container = details.querySelector("[data-moved-date]");
            if (mediaQuery.matches) {
                moveDate(details, date);
            } else {
                restoreDate(details, date, container);
            }
        });
    }

    document.addEventListener("DOMContentLoaded", refreshImportantInfoDates);
    if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", refreshImportantInfoDates);
    } else {
        mediaQuery.addListener(refreshImportantInfoDates);
    }
    window.refreshImportantInfoDates = refreshImportantInfoDates;
})();
