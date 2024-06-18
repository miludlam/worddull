const letters = document.querySelectorAll('.tile');
const loading = document.querySelector('.info-bar');

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function submitGuess() {
    console.log("Submitting...");
}

function updateTile() {
    console.log("Updating...");
}

async function init() {

    document.addEventListener('keydown', function handleKeyPress (event) {
        const action = event.key;

        switch (action) {
            case 'Enter':
                submitGuess();
                break;
            case 'Backspace':
                updateTile();
                break;
            default:
                if (!isLetter(action)) {
                    event.preventDefault();
                } else {
                    updateTile();
                }
                break;
        }
    });
}

init();
