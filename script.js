const inputGroup = document.querySelector('.input-group');
let tries = 0;
let mistakes = [];

async function getWord() {
    const response = await fetch('https://random-word-api.herokuapp.com/word?lang=fr');
    const words = await response.json();
    return words[0];
}

function shuffle(letters) {
    let copy = [...letters];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.join('');
}

function resetTries() {
    tries = 0;
    updateTries();
}

function resetMistakes() {
    mistakes = [];
    updateMistakes();
}

function updateMistakes() {
    document.getElementById('mistakes').innerText = mistakes.join(', ');
}

function updateTries() {
    document.getElementById('tries-label').innerText = `Tries (${tries}/5):`;
}

function createInputs(letters) {
    return letters.map(() => {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('letter-input');
        inputGroup.appendChild(input);
        return input;
    });
}

function addInputEventListeners(inputs, letters) {
    inputs.forEach((input, i) => {
        input.addEventListener('input', () => {
            handleInputEvent(input, i, inputs, letters);
        });
    });
}

function checkCorrectResponse(inputs, letters) {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value !== letters[i]) {
            return false;
        }
    }
    return true;
}

function handleInputEvent(input, i, inputs, letters) {
    if (input.value === letters[i]) {
        if (i < inputs.length - 1) {
            inputs[i + 1].focus();
        } else if (checkCorrectResponse(inputs, letters)) {
            alert('🎉 Success');
        }
    } else {
        if (input.value.length == 0) return
        handleMistake(input);
    }
}

function handleMistake(input) {
    if (!mistakes.includes(input.value)) {
        mistakes.push(input.value);
        updateMistakes();
    }
    input.value = '';
    tries++;
    updateTries();
    if (tries >= 5) {
        resetGame();
    }
}

async function resetGame() {
    const word = await getWord();
    inputGroup.innerHTML = '';
    resetTries();
    resetMistakes();
    const letters = word.split('');
    document.getElementById('word').innerText = shuffle(letters);
    let inputs = createInputs(letters);
    addInputEventListeners(inputs, letters);
    if (inputs.length > 0) {
        inputs[0].focus();
    }
}

function resetInputs() {
    resetTries();
    resetMistakes();
    document.querySelectorAll('.letter-input').forEach(input => input.value = '');
}

document.getElementById('random').addEventListener('click', resetGame);
document.getElementById('reset').addEventListener('click', resetInputs);

resetGame();