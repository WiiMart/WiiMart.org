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
    let allGamesData = [];

    const controllerMap = {
        "B_08_RvlCtrl.gif": "Wii Remote",
        "B_08_NunchukCtrl.gif": "Nunchuk",
        "B_08_ClassicCtrl.gif": "Classic Controller",
        "B_08_WheelCtrl.gif": "Wii Wheel",
        "B_08_GcCtrl.gif": "Nintendo GameCube Controller",
        "B_08_ZapperCtrl.gif": "Wii Zapper",
        "B_08_SpeakCtrl.gif": "Wii Speak",
        "B_08_KeyboardCtrl.gif": "Standard USB Keyboard",
        "B_08_BalanceCtrl.gif": "Wii Balance Board",
        "B_08_DSCtrl.gif": "Nintendo DS",
        "B_08_MicrophoneCtrl.gif": "Microphone",
        "B_08_MotionCtrl.gif": "Wii Remote Plus",
        "B_08_TWLCtrl.gif": "Nintendo DSi",
    };

    const purplePublishers = [
        "Subnetic",
        "A for Animation",
        "dustinbriggs1991",
        "saulfabreg",
        "ThatOneYoshi",
        "RM05",
        "idkwhereisthisname",
        "ForgottenArchive",
        "RedYoshiKart",
        "RollPlayStation"
    ];

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
                return {
                    ...game,
                    title: combinedTitle
                };
            });
            console.log('JSON data successfully loaded and pre-processed!');
        } catch (error) {
            console.error('Error fetching or parsing the JSON file:', error);
            tableNotice.innerHTML = `<p style="color:#ed3434;">Error loading data. Please check the console for details.</p>`;
        }
    }

    function renderTable(games) {
        games.sort((a, b) => {
            const titleA = a.title.toUpperCase();
            const titleB = b.title.toUpperCase();
            if (titleA < titleB) {
                return -1;
            }
            if (titleA > titleB) {
                return 1;
            }
            return 0;
        });

        const allKeys = new Set();
        games.forEach(game => {
            Object.keys(game).forEach(key => allKeys.add(key));
        });
        
        allKeys.delete('title1');
        allKeys.delete('title2');
        allKeys.add('title');

        const sortedKeys = ['id', 'console', 'title', 'publisher', 'date', 'points', 'genre', 'players', 'controllers', 'language', 'thumbnail', 'size', 'rating', 'ratingdetails'];
        
        table.innerHTML = '';

        const headerRow = document.createElement('tr');
        sortedKeys.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key.toUpperCase();
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        games.forEach(game => {
            const row = document.createElement('tr');
            
            if (purplePublishers.includes(game.publisher)) {
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

    btnsDiv.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const selectedRegion = event.target.textContent;
            
            regionSpan.textContent = selectedRegion;

            const filteredGames = allGamesData.filter(game => game.region === selectedRegion);

            renderTable(filteredGames);

            tableNotice.style.display = 'none';
            tableContainer.style.display = 'block';
        }
    });

    returnButton.addEventListener('click', () => {
        tableContainer.style.display = 'none';
        tableNotice.style.display = 'block';
        table.innerHTML = '';
        regionSpan.textContent = '';
    });

    await fetchGamesData();
});

// fun fact, the gem in Gemdation stands for Gemini
// ok bro
// orb ko