const tiles = document.querySelectorAll('.tile');
const loading = document.querySelector('.info-bar');
const firstRow = 0;
const lastRow = 5;
const firstCol = 0;
const lastCol = 4;
const wordle = 'HELLO';

// Indices translate to [row, column]
let currentIdx = [firstRow, firstCol];
let wordBuffer = '';

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function submitGuess() {    
    // 1. handle invalid word
    if (wordBuffer.length !== 5) {
        // invalid animation
        return;
    }
    // 2. check against word of the day and...
    if (wordBuffer === wordle) {
        // 3. win condition
        console.log("You win! " + wordBuffer);
    } else {
        // 4. non-win condition
        console.log("Guess incorrect: " + wordBuffer);
        if (currentIdx[0] === 5) {
            // game over
            wordBuffer = '';
            alert("You lose!");
        } else {
            wordBuffer = '';
            currentIdx[0]++;
            currentIdx[1] = 0;
        }
    }
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
    document.addEventListener('keydown', function handleKeyPress (event) {
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
    });
}

init();
