const letters = document.querySelectorAll('.tile');
const loading = document.querySelector('.info-bar');
const firstRow = 0;
const lastRow = 5;
const firstCol = 0;
const lastCol = 4;
const wordle = '';

// Indices translate to [row, column]
let currentIdx = [firstRow, firstCol];

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function submitGuess() {
    console.log("Submitting...");
    
    // 1. handle invalid word
    // 2. check against word of the day and...
    // 3. win condition
    // 4. non-win condition 
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
}

function letterTile(key) {
    let tile = getTile();
    
    if (currentIdx[1] === lastCol && tile.innerHTML.length === 1) {
        return;
    } else {
        console.log(tile);
        tile.innerHTML = key;
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
