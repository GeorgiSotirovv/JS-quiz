
//Statement that check is the questions are loaded
if (!window.QUESTIONS || !Array.isArray(window.QUESTIONS)) {
    alert("Questions file not found or invalid. Make sure questions.js is in the same folder.");
}
const questions = window.QUESTIONS || [];

//DOM elements
const qEl = document.getElementById('question');    // container for the question text
const oEl = document.getElementById('options');     // container for the answer buttons
const pEl = document.getElementById('progress');    // shows the quiz progress
const rBtn = document.getElementById('restartBtn'); // "New Game" button
const b5050 = document.getElementById('btn5050');   // 50:50 lifeline button
const bFriend = document.getElementById('btnFriend'); // Phone a Friend lifeline button
const bAud = document.getElementById('btnAudience');  // Ask the Audience lifeline button


//State of the game 
let current = 0;


//Render logic. Show us the 4 answer options as buttons (A–D)
function renderQuestionText() {
    pEl.textContent = `Question ${current + 1}/${questions.length}`;
    qEl.textContent = questions[current].q;
}

//Show us the 4 answer options as buttons (A–D)
function renderOptions() {
    const item = questions[current]; // get current question
    oEl.innerHTML = ''; // clear old options

    ["A", "B", "C", "D"].forEach((label, i) => {
        const btn = document.createElement('button'); // create a button
        btn.className = 'option'; // add style class
        btn.innerHTML = `<strong>${label}</strong> ${item.opts[i]}`; // set label + text
        btn.onclick = () => handleAnswer(i, btn); // check answer when clicked
        oEl.appendChild(btn); // add button to page
    });
}

// Answers logic
function handleAnswer(i, btn) {
    const item = questions[current];        // get the current question
    const correctIndex = item.correct;      // find the correct answer index

    // disable all option buttons after one is clicked
    [...oEl.children].forEach(b => b.disabled = true);

    //If the selected answer is correct
    if (i === correctIndex) {
        btn.classList.add('correct'); // mark selected button as correct (green)

        setTimeout(() => {
            current++; // move to next question
            if (current < questions.length) {
                renderQuestionText(); // show new question
                renderOptions();      // show new options
            } else {
                alert('Congrats! You finished all questions 🎉'); // end message
                current = 0; // reset game
                renderQuestionText();
                renderOptions();
            }
        }, 600);

        //If the selected answer is wrong
    } else {
        btn.classList.add('wrong'); // mark selected button as wrong (red)
        oEl.children[correctIndex].classList.add('correct'); // show correct answer

        setTimeout(() => {
            alert('Wrong answer. Starting a new game.'); // message
            current = 0; // reset game
            renderQuestionText();
            renderOptions();
        }, 800);
    }
}

// logic for "new game" button
function restart() {
    current = 0;
    [b5050, bFriend, bAud].forEach(b => b.classList.remove('used'));
    renderQuestionText();
    renderOptions();
}
rBtn.onclick = restart;


//50:50 lifeline logic
b5050.onclick = () => {

    // stop if already used
    if (b5050.classList.contains('used')) {
        return;
    }

    const correct = questions[current].correct; // correct answer index
    let removed = 0; // how many wrong answers removed

    // loop through all options and hide 2 wrong ones
    for (let i = 0; i < oEl.children.length; i++) {
        if (i !== correct && removed < 2) {
            oEl.children[i].style.visibility = "hidden"; // hide wrong option
            removed++;
        }
    }

    alert("50:50 used — two wrong answers removed."); // show message
    b5050.classList.add('used'); // mark this joker as used
};


//Audience lifeline logic
bAud.onclick = () => {

    // stop if already used
    if (bAud.classList.contains('used')) {
        return;
    }

    const correct = questions[current].correct; // correct answer index
    let perc = [0, 0, 0, 0]; // store percentages
    let remaining = 100; // total percent left

    // give correct answer between 40% and 60%
    perc[correct] = 40 + Math.floor(Math.random() * 21);
    remaining -= perc[correct];

    // split the rest across wrong answers
    const wrongAnswers = [0, 1, 2, 3].filter(i => i !== correct);

    for (let i = 0; i < wrongAnswers.length; i++) {
        const isLast = (i === wrongAnswers.length - 1);
        let value;

        if (isLast) {
            value = remaining; // give leftover % to last wrong answer
        } else {
            value = Math.floor(Math.random() * (remaining + 1));
            remaining -= value;
        }

        perc[wrongAnswers[i]] = value;
    }

    // build result message
    let message = "Audience vote:\n";
    for (let i = 0; i < 4; i++) {
        message += ["A", "B", "C", "D"][i] + ": " + perc[i] + "%\n";
    }

    alert(message); // show audience vote
    bAud.classList.add('used'); // mark joker as used
};


//Phone a Friend lifeline logic
bFriend.onclick = () => {

    // stop if already used
    if (bFriend.classList.contains('used')) {
        return;
    }

    const correct = questions[current].correct; // correct answer index
    let guess;
    const chance = Math.random(); // random number 0–1

    // 70% chance friend gives the correct answer
    if (chance < 0.7) {
        guess = correct;
    } else {
        // otherwise pick a random wrong answer
        const wrongAnswers = [0, 1, 2, 3].filter(i => i !== correct);
        const randomIndex = Math.floor(Math.random() * wrongAnswers.length);
        guess = wrongAnswers[randomIndex];
    }

    alert("Your friend thinks it's option " + ["A", "B", "C", "D"][guess] + "."); // show friend's answer
    bFriend.classList.add('used'); // mark joker as used
};


function start() {
    renderQuestionText();
    renderOptions();
}

start();
