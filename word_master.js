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
    const response = await fetch(dailyWordURL);
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
        alert("Word too short!");
        return;
    }
    // 2. handle invalid word
    validateWord(wordBuffer).then((isValid) => {
        console.log(isValid);
        if (isValid === false) {
            alert("Invalid word!");
            return;
        }
        // 3. check against word of the day and...
        if (wordBuffer === wordle) {
            // 4. win condition
            console.log("You win! " + wordBuffer);
            alert("You win!");
            gameOver = true;
            wordBuffer = '';
        } else {
            // 5. non-win condition
            console.log("Guess incorrect: " + wordBuffer);
            if (currentIdx[0] === lastRow) {
                // game over
                alert("You lose!");
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
    wordBuffer = wordBuffer.substring(0, currentIdx[1]);
}

function letterTile(key) {
    let tile = getTile();
    
    if (currentIdx[1] === lastCol && tile.innerHTML.length === 1) {
        return;
    } else {
        tile.innerHTML = key;
        wordBuffer += key;
        if (currentIdx[1] !== lastCol) {
            currentIdx[1]++;
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
}

init();
