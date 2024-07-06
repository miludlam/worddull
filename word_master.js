const dailyWordURL = "https://words.dev-apis.com/word-of-the-day";
const wordValidatorURL = "https://words.dev-apis.com/validate-word";
let wordle = '';
let isValid;

const tiles = document.querySelectorAll('.tile');
const loading = document.querySelector('.info-bar');
const firstRow = 0;
const lastRow = 5;
const firstCol = 0;
const lastCol = 4;

// Indices translate to [row, column]
let currentIdx = [firstRow, firstCol];
let wordBuffer = '';
let gameOver = false;

async function wordOfTheDay() {
    // connect to API and parse response
    const response = await fetch(dailyWordURL, {
        cache: "no-cache"
    });
    const result = await response.json();
    // now that we have gained the word, hide the spinning eggplant
    loading.classList.add("hidden");

    return result.word;
}

async function validateWord(guess) {
    // build JSON to POST
    let data = {
        word: guess,
    };

    // Display eggplant while we await JSON response
    loading.classList.remove("hidden");

    // connect to API to validate word
    const response = await fetch(wordValidatorURL, {
        method: "POST",
        body: JSON.stringify(data),
    });
    const result = await response.json();

    // Now that we have response, seggsy eggplant
    loading.classList.add("hidden");

    return result.validWord;
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function submitGuess() {    
    // 1. handle invalid word length
    if (wordBuffer.length !== wordle.length) {
        // invalid animation
        animateInvalid();
        return;
    }
    // 2. handle invalid word
    validateWord(wordBuffer).then((isValid) => {
        if (isValid === false) {
            animateInvalid();
            return;
        }

        // 3. check against word of the day and...
        if (wordBuffer === wordle) {
            // 4. win condition
            paintTiles(true);
            
            wordBuffer = '';
            gameOver = true;
        } else {
            paintTiles(false);

            // 5. non-win condition
            if (currentIdx[0] === lastRow) {
                // game over
                alert("You lose! Word: " + wordle);
                wordBuffer = '';
                gameOver = true;
            } else {
                wordBuffer = '';
                currentIdx[0]++;
                currentIdx[1] = 0;
            }
        }
    });
}

function animateInvalid() {
    let tileRow = getRowOfTiles();
    tileRow.forEach(tile => {
        tile.classList.add('guess-invalid');
    });
    setTimeout(function () {
        tileRow.forEach(tile => {
            tile.classList.remove('guess-invalid');
        })
    }, 1000);
}

function clearTile(key) {
    // Can only be at row 0 if tile is already empty
    if (currentIdx[1] === firstCol) {
        return;
    } 

    let tile = getTile();

    if (currentIdx[1] === lastCol && tile.innerHTML.length === 1) {
        tile.innerHTML = '';
    } else {
        currentIdx[1]--;
        tile = getTile();
        tile.innerHTML = '';
    }
    tile.classList.remove('tile-filled');
    wordBuffer = wordBuffer.substring(0, currentIdx[1]);
}

function letterTile(key) {
    let tile = getTile();
    
    if (currentIdx[1] === lastCol && tile.innerHTML.length === 1) {
        return;
    } else {
        tile.innerHTML = key;
        tile.classList.add('tile-filled');
        wordBuffer += key;
        if (currentIdx[1] !== lastCol) {
            currentIdx[1]++;
        }
    }
}

function paintTiles(winner = false) {
    // get current row
    let tileRow = getRowOfTiles();
    const wordMap = mapIt(wordle.split(""));
    let delay = 100;

    if (winner) {
        tileRow.forEach(tile => {
            tile.classList.add('tile-correct');
        });
    } else {
        // Handle correct guesses first to make sure map is updated
        for (let i = firstCol; i <= lastCol; i++) {
            let tile = tileRow[i];
            if (tile.innerHTML == wordle[i]) {
                tile.style.animationDelay = delay;
                tile.classList.add('tile-correct');
                wordMap[wordle[i]]--;
                delay += 100;
            }
        }

        for (let i = firstCol; i <= lastCol; i++) {
            let tile = tileRow[i];

            if (tile.innerHTML == wordle[i]) {
                // do nothing as this case is handled above
            } else if (wordle.includes(tile.innerHTML) && wordMap[tile.innerHTML] > 0) {
                tile.classList.add('tile-present');
                wordMap[tile.innerHTML]--;
            } else {
                tile.classList.add('tile-absent');
            }
        }
    }
}

// A simple getter to return the ID of the current tile
function getCurrentTileID() {
    return 'row_' + currentIdx[0] + '_' + currentIdx[1];
}

// Returns the current tile in the gameboard
function getTile() {
    return document.getElementById(getCurrentTileID());
}

function getRowOfTiles() {
    let tileRow = [];
    for (let i = firstCol; i <= lastCol; i++) {
        let tileID = 'row_' + currentIdx[0] + '_' + i;
        tileRow.push(document.getElementById(tileID));
    }
    return tileRow;
}

function mapIt(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        const letter = array[i];
        if (obj[letter]) {
            obj[letter++];
        } else {
            obj[letter] = 1;
        }
    }
    return obj;
}

async function init() {
    wordOfTheDay().then(function (word) {
        wordle = word.toUpperCase();
    });

    document.addEventListener('keydown', function handleKeyPress (event) {
        if (!gameOver) {
            const key = event.key;

            if (key === 'Enter') {
                submitGuess();
            } else if (key === 'Backspace') {
                clearTile(key);
            } else if (isLetter(key)) {
                letterTile(key.toUpperCase());
            } else {
                event.preventDefault();
            }
        }
    });
    
    document.addEventListener('click', function handleKeyPress (event) {
        if (!gameOver) {
            const bClick = event.target.dataset.key;

            if (bClick === 'Enter') {
                submitGuess();
            } else if (bClick === 'Backspace') {
                clearTile(bClick);
            } else if (isLetter(bClick)) {
                letterTile(bClick.toUpperCase());
            } else {
                event.preventDefault();
            }
        }
    });

}

init();
