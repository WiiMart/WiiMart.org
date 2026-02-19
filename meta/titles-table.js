document.addEventListener('DOMContentLoaded', async () => {
    // Check for old browsers (e.g., Nintendo/PlayStation)
    const userAgent = navigator.userAgent.toLowerCase();
    const isOldBrowser = userAgent.includes('nintendo') || userAgent.includes('playstation');

    if (isOldBrowser) {
        const btnsDiv = document.querySelector('.table-notice');
        if (btnsDiv) {
            btnsDiv.innerHTML = `<p style="color:#ed3434;font-weight:bold;">Your browser is unsupported, please load this page on a modern device.</p>`;
        }
        return;
    }

    const tableNotice = document.querySelector('.table-notice');
    const tableContainer = document.querySelector('.table-container');
    const table = document.getElementById('titles');
    const btnsDiv = document.getElementById('btns');
    const regionSpan = document.getElementById('region');
    const returnButton = document.querySelector('.table-container button');
    
    const sortSelect = document.getElementById('sortBy');
    const filterControllerSelect = document.getElementById('filterController');
    
    const filterConsoleFilterSelect = document.getElementById('filterConsoleFilter'); 
    
    const filterInclusionSelect = document.getElementById('filterInclusion'); 

    let allGamesData = [];
    let currentRegionGames = [];

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
    };

    const purplePublishers = [
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
        "Team Twiizers"
    ];

    function initControllerDropdown() {
        Object.keys(controllerMap).forEach(filename => {
            const option = document.createElement('option');
            option.value = filename;
            option.textContent = controllerMap[filename];
            filterControllerSelect.appendChild(option);
        });
    }
    initControllerDropdown();

    function populateConsoleDropdown() {
        filterConsoleFilterSelect.innerHTML = '<option value="all">All Consoles</option>';
        
        const uniqueConsoles = new Set();
        currentRegionGames.forEach(game => {
            if (game.console) {
                uniqueConsoles.add(game.console);
            }
        });

        Array.from(uniqueConsoles).sort().forEach(consoleName => {
            const option = document.createElement('option');
            option.value = consoleName;
            option.textContent = consoleName;
            filterConsoleFilterSelect.appendChild(option);
        });
    }

    function getControllerStringFromHTML(htmlString) {
        if (!htmlString || htmlString.trim() === '') {
            return { text: "Missing", style: "color:red;font-weight:bold;" };
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        const imgElements = tempDiv.querySelectorAll('img');
        const filenames = Array.from(imgElements).map(img => {
            const src = img.getAttribute('src');
            const filename = src.split('/').pop();
            return filename;
        });

        const names = filenames.map(img => controllerMap[img] || img).filter(name => name !== undefined && name !== '');

        if (names.length === 0) {
            if (htmlString.includes('Balance Board')) {
                return { text: "Wii Balance Board" };
            }
            return { text: "Missing", style: "color:red;font-weight:bold;" };
        } else if (names.length === 1) {
            return { text: names[0] };
        } else if (names.length === 2) {
            return { text: `${names[0]} and ${names[1]}` };
        } else {
            const last = names.pop();
            return { text: `${names.join(', ')}, and ${last}` };
        }
    }

    function formatTitle(title) {
        if (!title) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = title.replace(/&apos;/g, "'");
        return tempDiv.innerHTML;
    }

    async function fetchGamesData() {
        try {
            const response = await fetch('/meta/games.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allGamesData = data.map(game => {
                const combinedTitle = game.title2 && game.title2 !== '' ? `${game.title1} ${game.title2}` : game.title1;
                const isCustom = purplePublishers.includes(game.publisher);
                return {
                    ...game,
                    title: combinedTitle,
                    isCustom: isCustom
                };
            });
            console.log('JSON data successfully loaded and pre-processed!');
        } catch (error) {
            console.error('Error fetching or parsing the JSON file:', error);
            tableNotice.innerHTML = `<p style="color:#ed3434;">Error loading data. Please check the console for details.</p>`;
        }
    }

    function parseDate(dateStr) {
        if (!dateStr) return 0;
        const d = Date.parse(dateStr);
        return isNaN(d) ? 0 : d;
    }

    function parsePoints(pointsStr) {
        if (!pointsStr) return 0;
        const p = parseInt(pointsStr);
        return isNaN(p) ? 0 : p;
    }

    function updateTable() {
        let processedGames = currentRegionGames.filter(game => {
            
            const inclusionFilter = filterInclusionSelect.value;
            if (inclusionFilter === 'custom') {
                if (!game.isCustom) return false;
            } else if (inclusionFilter === 'original') {
                if (game.isCustom) return false;
            }

            const consoleFilter = filterConsoleFilterSelect.value;
            if (consoleFilter !== 'all') {
                if (game.console !== consoleFilter) return false;
            }

            const ctrlFilter = filterControllerSelect.value;
            const gameCtrls = game.controllers || "";
            
            if (ctrlFilter === 'none') {
                const ctrlData = getControllerStringFromHTML(gameCtrls);
                if (ctrlData.text !== "Missing") return false;
            } else if (ctrlFilter !== 'all') {
                if (!gameCtrls.includes(ctrlFilter)) return false;
            }

            return true;
        });

        const sortMode = sortSelect.value;
        processedGames.sort((a, b) => {
            if (sortMode === 'dateNew') {
                return parseDate(b.date) - parseDate(a.date);
            } else if (sortMode === 'dateOld') {
                return parseDate(a.date) - parseDate(b.date);
            } else if (sortMode === 'pointsHigh') {
                return parsePoints(b.points) - parsePoints(a.points);
            } else if (sortMode === 'pointsLow') {
                return parsePoints(a.points) - parsePoints(b.points);
            } else {
                const titleA = (a.title || "").toUpperCase();
                const titleB = (b.title || "").toUpperCase();
                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
            }
        });

        renderTable(processedGames);
    }

    function renderTable(games) {
        const allKeys = new Set();
        games.forEach(game => {
            Object.keys(game).forEach(key => allKeys.add(key));
        });
        
        allKeys.delete('title1');
        allKeys.delete('title2');
        allKeys.add('title');

        const sortedKeys = ['id', 'console', 'title', 'publisher', 'date', 'points', 'genre', 'players', 'controllers', 'language', 'thumbnail', 'size', 'rating', 'ratingdetails'];
        
        table.innerHTML = '';

        if (games.length === 0) {
            table.innerHTML = '<tr><td colspan="14" style="text-align:center; padding: 20px;">No results found.</td></tr>';
            return;
        }

        const headerRow = document.createElement('tr');
        sortedKeys.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key.toUpperCase();
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        games.forEach(game => {
            const row = document.createElement('tr');
            
            if (game.isCustom) {
                row.style.color = "#d940ffff";
            }
            
            sortedKeys.forEach(key => {
                const cell = document.createElement('td');
                const cellValue = game[key];

                if (key === 'thumbnail') {
                    if (game.id && game.thumbnail) {
                        const link = document.createElement('a');
                        link.href = `https://oss-auth.thecheese.io/oss/ccs/${game.id}/${game.thumbnail}`;
                        link.textContent = 'View';
                        link.target = '_blank';
                        cell.appendChild(link);
                    } else {
                        cell.textContent = '';
                    }
                } else if (key === 'controllers') {
                    const controllerData = getControllerStringFromHTML(cellValue);
                    cell.textContent = controllerData.text;
                    if (controllerData.style) {
                        cell.setAttribute('style', controllerData.style);
                    }
                } else if (key === 'title') {
                    cell.innerHTML = formatTitle(cellValue);
                } else {
                    cell.textContent = cellValue !== undefined ? cellValue : '';
                }
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
    }

    sortSelect.addEventListener('change', updateTable);
    filterControllerSelect.addEventListener('change', updateTable);
    filterConsoleFilterSelect.addEventListener('change', updateTable); 
    filterInclusionSelect.addEventListener('change', updateTable);

    btnsDiv.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const selectedRegion = event.target.textContent;
            
            regionSpan.textContent = selectedRegion;

            sortSelect.value = 'alpha';
            filterControllerSelect.value = 'all';
            filterInclusionSelect.value = 'all';

            currentRegionGames = allGamesData.filter(game => game.region === selectedRegion);

            populateConsoleDropdown();

            updateTable();

            tableNotice.style.display = 'none';
            tableContainer.style.display = 'block';
        }
    });

    returnButton.addEventListener('click', () => {
        tableContainer.style.display = 'none';
        tableNotice.style.display = 'block';
        table.innerHTML = '';
        regionSpan.textContent = '';
        currentRegionGames = [];
        filterConsoleFilterSelect.innerHTML = '<option value="all">All Consoles</option>';
    });

    await fetchGamesData();
});