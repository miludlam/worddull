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
    let pos = 'row_' + currentIdx[0] + '_' + currentIdx[1];
    console.log("Updating..." + pos);
    
    let tile = document.getElementById(pos)

    if (key === 'Backspace') {
        tile.innerHTML = '';
        currentIdx[1]--;
    } else {
        tile.innerHTML = key;
        currentIdx[1]++;
    }
}

async function init() {

    document.addEventListener('keydown', function handleKeyPress (event) {
        const key = event.key;

        switch (key) {
            case 'Enter':
                if (currentIdx[1] !== 4) {
                    event.preventDefault();
                } else {
                    submitGuess();
                }
                break;
            case 'Backspace':
                if (currentIdx[1] === 0) {
                    event.preventDefault();
                } else {
                    updateTile(key);
                }
                break;
            default:
                if (!isLetter(key) || currentIdx[1] > 4) {
                    event.preventDefault();
                } else {
                    updateTile(key.toUpperCase());
                }
                break;
        }
    });
}

init();
