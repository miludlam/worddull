const letters = document.querySelectorAll('.tile');
const loading = document.querySelector('.info-bar');
const wordle = '';

// Index translates to [row, column]
let currentIdx = [0, 0];

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function submitGuess() {
    console.log("Submitting...");
    
    // 1. handle invalid
    // 2. check against word of the day and
    // 3. win condition
    // 4. non-win condition 
}

function updateTile(key) {
    // Handle invalid index
    if (currentIdx[1] > 4 || currentIdx[1] < 0) {
        return;
    }

    let pos = 'row_' + currentIdx[0] + '_' + currentIdx[1];
    console.log("Updating..." + pos);
    
    let tile = document.getElementById(pos)

    if (key === 'Backspace') {
        if (currentIdx[1] >= 0) {
            currentIdx[1]--;
            tile.innerHTML = '';
        }
    } else {
        if (currentIdx[1] <= 4) {
            tile.innerHTML = key;
            currentIdx[1]++;
        }
    }
}

async function init() {

    document.addEventListener('keydown', function handleKeyPress (event) {
        const key = event.key;

        switch (key) {
            case 'Enter':
                submitGuess();
                break;
            case 'Backspace':
                updateTile(key);
                break;
            default:
                updateTile(key.toUpperCase());
                break;
        }
    });
}

init();
