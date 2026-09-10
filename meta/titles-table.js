(() => {
    const controllerMap = {
        "B_08_RvlCtrl.gif": "Wii Remote",
        "B_08_MotionCtrl.gif": "Wii Remote Plus",
        "B_08_NunchukCtrl.gif": "Nunchuk",
        "B_08_ClassicCtrl.gif": "Classic Controller",
        "B_08_BalanceCtrl.gif": "Wii Balance Board",
        "B_08_SpeakCtrl.gif": "Wii Speak",
        "B_08_ZapperCtrl.gif": "Wii Zapper",
        "B_08_WheelCtrl.gif": "Wii Wheel",
        "B_08_GcCtrl.gif": "Nintendo GameCube Controller",
        "B_08_KeyboardCtrl.gif": "Standard USB Keyboard",
        "B_08_MicrophoneCtrl.gif": "Microphone",
        "B_08_DSCtrl.gif": "Nintendo DS"
    };

    const customPublishers = new Set([
        "Subnetic",
        "Subnetic, dustinbriggs1991",
        "A for Animation",
        "A For Animation",
        "Ryoku/dustinbriggs1991",
        "dustinbriggs1991",
        "dustinbriggs91",
        "dustinbriggs1991, Subnetic",
        "saulfabreg",
        "saulfabreg, Subnetic",
        "ThatOneYoshi",
        "RM05",
        "idkwhereisthisname",
        "ForgottenArchive",
        "Onion Mastori",
        "RedYoshiKart",
        "UselessMan",
        "RollPlayStation",
        "Waluigi",
        "Team Twiizers",
        "ZodiaKGalXy"
    ]);

    const columns = ["id", "console", "title", "publisher", "date", "points", "genre", "players", "controllers", "language", "thumbnail", "size", "rating", "ratingdetails"];

    function validTimestamp(year, month = 1, day = 1) {
        const date = new Date(Date.UTC(year, month - 1, day));
        if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
            return null;
        }
        return date.getTime();
    }

    function parseDate(value, region) {
        if (typeof value !== "string" || value.trim() === "") {
            return null;
        }
        const date = value.trim().normalize("NFKC");
        let match = date.match(/^(\d{4})(?:年|년)\s*(?:(\d{1,2})(?:月|월)\s*)?(?:(\d{1,2})(?:日|일))?$/);
        if (match) {
            return validTimestamp(Number(match[1]), Number(match[2] || 1), Number(match[3] || 1));
        }
        match = date.match(/^(\d{4})$/);
        if (match) {
            return validTimestamp(Number(match[1]));
        }
        match = date.match(/^(\d{1,2})[-/.](\d{4})$/);
        if (match) {
            return validTimestamp(Number(match[2]), Number(match[1]));
        }
        match = date.match(/^(\d{1,2})[-/.](\d{1,2})[-/.]\$?(\d{4})$/);
        if (!match) {
            return null;
        }
        const first = Number(match[1]);
        const second = Number(match[2]);
        const year = Number(match[3]);
        const usesMonthFirst = region === "US" || region === "JP" || region === "none" || region === "";
        const preferred = usesMonthFirst
            ? validTimestamp(year, first, second)
            : validTimestamp(year, second, first);
        if (preferred !== null) {
            return preferred;
        }
        return usesMonthFirst
            ? validTimestamp(year, second, first)
            : validTimestamp(year, first, second);
    }

    function parsePoints(value) {
        const points = Number.parseInt(value, 10);
        return Number.isFinite(points) ? points : 0;
    }

    function controllerNames(html) {
        if (typeof html !== "string" || html.trim() === "") {
            return [];
        }
        const names = [];
        const sourcePattern = /\bsrc\s*=\s*["']([^"']+)["']/gi;
        let match;
        while ((match = sourcePattern.exec(html)) !== null) {
            const filename = match[1].split("/").pop();
            if (filename && controllerMap[filename]) {
                names.push(controllerMap[filename]);
            }
        }
        if (names.length === 0 && html.includes("Balance Board")) {
            names.push("Wii Balance Board");
        }
        return [...new Set(names)];
    }

    function formatControllerNames(names) {
        if (names.length === 0) {
            return "Missing";
        }
        if (names.length === 1) {
            return names[0];
        }
        if (names.length === 2) {
            return `${names[0]} and ${names[1]}`;
        }
        return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
    }

    function appendFormattedTitle(cell, value) {
        const template = document.createElement("template");
        template.innerHTML = String(value || "").replace(/&apos;/g, "&#39;");
        template.content.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                cell.appendChild(document.createTextNode(node.textContent));
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "SUP") {
                const superscript = document.createElement("sup");
                superscript.textContent = node.textContent;
                cell.appendChild(superscript);
            } else {
                cell.appendChild(document.createTextNode(node.textContent));
            }
        });
    }

    function compareNullableDates(left, right, newestFirst) {
        if (left === null && right === null) {
            return 0;
        }
        if (left === null) {
            return 1;
        }
        if (right === null) {
            return -1;
        }
        return newestFirst ? right - left : left - right;
    }

    document.addEventListener("DOMContentLoaded", () => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isOldBrowser = userAgent.includes("nintendo") || userAgent.includes("playstation");
        const tableNotice = document.querySelector(".table-notice");
        if (isOldBrowser) {
            if (tableNotice) {
                tableNotice.innerHTML = '<p style="color:#ed3434;font-weight:bold;">Your browser is unsupported, please load this page on a modern device.</p>';
            }
            return;
        }

        const tableContainer = document.querySelector(".table-container");
        const table = document.getElementById("titles");
        const buttons = document.getElementById("btns");
        const regionOutput = document.getElementById("region");
        const returnButton = document.querySelector("[data-return-to-regions]");
        const sortSelect = document.getElementById("sortBy");
        const controllerSelect = document.getElementById("filterController");
        const consoleSelect = document.getElementById("filterConsoleFilter");
        const inclusionSelect = document.getElementById("filterInclusion");
        if (!tableNotice || !tableContainer || !table || !buttons || !regionOutput || !returnButton || !sortSelect || !controllerSelect || !consoleSelect || !inclusionSelect) {
            return;
        }

        let allGames = [];
        let currentGames = [];
        let requestedRegion = null;

        Object.entries(controllerMap).forEach(([filename, name]) => {
            const option = document.createElement("option");
            option.value = filename;
            option.textContent = name;
            controllerSelect.appendChild(option);
        });

        function populateConsoleOptions() {
            consoleSelect.replaceChildren(new Option("All Consoles", "all"));
            const names = [...new Set(currentGames.map(game => game.console).filter(Boolean))].sort((left, right) => left.localeCompare(right));
            names.forEach(name => consoleSelect.add(new Option(name, name)));
        }

        function renderTable(games) {
            table.replaceChildren();
            const body = document.createElement("tbody");
            if (games.length === 0) {
                const row = document.createElement("tr");
                const cell = document.createElement("td");
                cell.colSpan = columns.length;
                cell.style.textAlign = "center";
                cell.style.padding = "20px";
                cell.textContent = "No results found.";
                row.appendChild(cell);
                body.appendChild(row);
                table.appendChild(body);
                return;
            }
            const head = document.createElement("thead");
            const headerRow = document.createElement("tr");
            columns.forEach(column => {
                const heading = document.createElement("th");
                heading.scope = "col";
                heading.textContent = column.toUpperCase();
                headerRow.appendChild(heading);
            });
            head.appendChild(headerRow);
            const fragment = document.createDocumentFragment();
            games.forEach(game => {
                const row = document.createElement("tr");
                if (game.isCustom) {
                    row.style.color = "#d940ffff";
                }
                columns.forEach(column => {
                    const cell = document.createElement("td");
                    const value = game[column];
                    if (column === "thumbnail" && game.id && game.thumbnail) {
                        const link = document.createElement("a");
                        link.href = `https://oss-auth.thecheese.io/oss/ccs/${encodeURIComponent(game.id)}/${encodeURIComponent(game.thumbnail)}`;
                        link.textContent = "View";
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";
                        cell.appendChild(link);
                    } else if (column === "controllers") {
                        const names = game.controllerNames;
                        cell.textContent = formatControllerNames(names);
                        if (names.length === 0) {
                            cell.style.color = "red";
                            cell.style.fontWeight = "bold";
                        }
                    } else if (column === "title") {
                        appendFormattedTitle(cell, value);
                    } else {
                        cell.textContent = value === undefined || value === null ? "" : String(value);
                    }
                    row.appendChild(cell);
                });
                fragment.appendChild(row);
            });
            body.appendChild(fragment);
            table.append(head, body);
        }

        function updateTable() {
            const filtered = currentGames.filter(game => {
                if (inclusionSelect.value === "custom" && !game.isCustom) {
                    return false;
                }
                if (inclusionSelect.value === "original" && game.isCustom) {
                    return false;
                }
                if (consoleSelect.value !== "all" && game.console !== consoleSelect.value) {
                    return false;
                }
                if (controllerSelect.value === "none" && game.controllerNames.length > 0) {
                    return false;
                }
                if (controllerSelect.value !== "all" && controllerSelect.value !== "none" && !String(game.controllers || "").includes(controllerSelect.value)) {
                    return false;
                }
                return true;
            });
            const sortMode = sortSelect.value;
            filtered.sort((left, right) => {
                let result = 0;
                if (sortMode === "dateNew" || sortMode === "dateOld") {
                    result = compareNullableDates(left.dateTimestamp, right.dateTimestamp, sortMode === "dateNew");
                } else if (sortMode === "pointsHigh") {
                    result = right.pointsValue - left.pointsValue;
                } else if (sortMode === "pointsLow") {
                    result = left.pointsValue - right.pointsValue;
                }
                if (result !== 0) {
                    return result;
                }
                return left.titleText.localeCompare(right.titleText, undefined, { sensitivity: "base" });
            });
            renderTable(filtered);
        }

        function selectRegion(region) {
            regionOutput.textContent = region;
            sortSelect.value = "alpha";
            controllerSelect.value = "all";
            inclusionSelect.value = "all";
            currentGames = allGames.filter(game => game.region === region);
            populateConsoleOptions();
            updateTable();
            tableNotice.style.display = "none";
            tableContainer.style.display = "block";
        }

        const loadPromise = fetch("/meta/games.json", { credentials: "same-origin" })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new TypeError("Invalid title data");
                }
                allGames = data.map(game => {
                    const title = game.title2 ? `${game.title1 || ""} ${game.title2}` : String(game.title1 || "");
                    const titleTemplate = document.createElement("template");
                    titleTemplate.innerHTML = title.replace(/&apos;/g, "&#39;");
                    return {
                        ...game,
                        title,
                        titleText: titleTemplate.content.textContent || title.replace(/<[^>]*>/g, ""),
                        isCustom: customPublishers.has(game.publisher),
                        controllerNames: controllerNames(game.controllers),
                        dateTimestamp: parseDate(game.date, game.region),
                        pointsValue: parsePoints(game.points)
                    };
                });
                if (requestedRegion) {
                    selectRegion(requestedRegion);
                }
            })
            .catch(() => {
                tableNotice.innerHTML = '<p style="color:#ed3434;">Error loading data. Please check the console for details.</p>';
            });

        [sortSelect, controllerSelect, consoleSelect, inclusionSelect].forEach(control => {
            control.addEventListener("change", updateTable);
        });

        buttons.addEventListener("click", event => {
            const button = event.target instanceof Element ? event.target.closest("button") : null;
            if (!button) {
                return;
            }
            requestedRegion = button.textContent.trim();
            if (allGames.length > 0) {
                selectRegion(requestedRegion);
            } else {
                void loadPromise;
            }
        });

        returnButton.addEventListener("click", () => {
            tableContainer.style.display = "none";
            tableNotice.style.display = "block";
            table.replaceChildren();
            regionOutput.textContent = "";
            currentGames = [];
            requestedRegion = null;
            consoleSelect.replaceChildren(new Option("All Consoles", "all"));
        });
    });
})();
