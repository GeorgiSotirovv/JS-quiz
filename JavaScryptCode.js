
//Statement that check is the questions are loaded
if (!window.QUESTIONS || !Array.isArray(window.QUESTIONS)) {
    alert("Questions file not found or invalid. Make sure questions.js is in the same folder.");
}
const questions = window.QUESTIONS || [];

//DOM elements
const questionBox = document.getElementById('question');    // container for the question text
const optionsBox = document.getElementById('options');     // container for the answer buttons
const progressBox = document.getElementById('progress');    // shows the quiz progress
const restartBtn = document.getElementById('restartBtn'); // "New Game" button
const btn5050 = document.getElementById('btn5050');   // 50:50 lifeline button
const btnFriend = document.getElementById('btnFriend'); // Phone a Friend lifeline button
const btnAudience = document.getElementById('btnAudience');  // Ask the Audience lifeline button


//State of the game 
let CurrentState = 0;


//Render logic. Show us the 4 answer options as buttons (A–D)
function renderQuestionText() {
    progressBox.textContent = `Question ${CurrentState + 1}/${questions.length}`;
    questionBox.textContent = questions[CurrentState].q; 
}

//Show us the 4 answer options as buttons (A–D)
function renderOptions() {
    const item = questions[CurrentState]; // get current question
    optionsBox.innerHTML = ''; // clear old options

    ["A", "B", "C", "D"].forEach((label, i) => {
        const btn = document.createElement('button'); // create a button
        btn.className = 'option'; // add style class
        btn.innerHTML = `<strong>${label}</strong> ${item.opts[i]}`; // set label + text
        btn.onclick = () => handleAnswer(i, btn); // check answer when clicked
        optionsBox.appendChild(btn); // add button to page
    });
}

// Answers logic
function handleAnswer(i, btn) {
    const item = questions[CurrentState];        // get the current question
    const correctIndex = item.correct;      // find the correct answer index

    // disable all option buttons after one is clicked
    [...optionsBox.children].forEach(b => b.disabled = true);

    //If the selected answer is correct
    if (i === correctIndex) {
        btn.classList.add('correct'); // mark selected button as correct (green)

        setTimeout(() => {
            CurrentState++; // move to next question
            if (CurrentState < questions.length) {
                renderQuestionText(); // show new question
                renderOptions();      // show new options
            } else {
                alert('Congrats! You finished all questions 🎉'); // end message
                CurrentState = 0; // reset game
                renderQuestionText();
                renderOptions();
            }
        }, 600);

        //If the selected answer is wrong
    } else {
        btn.classList.add('wrong'); // mark selected button as wrong (red)
        optionsBox.children[correctIndex].classList.add('correct'); // show correct answer

        setTimeout(() => {
            alert('Wrong answer. Starting a new game.'); // message
            CurrentState = 0; // reset game
            renderQuestionText();
            renderOptions();
        }, 800);
    }
}

// logic for "new game" button
function restart() {
    CurrentState = 0;
    [btn5050, btnFriend, btnAudience].forEach(b => b.classList.remove('used'));
    renderQuestionText();
    renderOptions();
}
restartBtn.onclick = restart;


//50:50 lifeline logic
btn5050.onclick = () => {

    // stop if already used
    if (btn5050.classList.contains('used')) {
        return;
    }

    const correct = questions[CurrentState].correct; // correct answer index
    let removed = 0; // how many wrong answers removed

    // loop through all options and hide 2 wrong ones
    for (let i = 0; i < optionsBox.children.length; i++) {
        if (i !== correct && removed < 2) {
            optionsBox.children[i].style.visibility = "hidden"; // hide wrong option
            removed++;
        }
    }

    alert("50:50 used — two wrong answers removed."); // show message
    btn5050.classList.add('used'); // mark this joker as used
};


//Audience lifeline logic
btnAudience.onclick = () => {

    // stop if already used
    if (btnAudience.classList.contains('used')) {
        return;
    }

    const correct = questions[CurrentState].correct; // correct answer index
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
    btnAudience.classList.add('used'); // mark joker as used
};


//Phone a Friend lifeline logic
btnFriend.onclick = () => {

    // stop if already used
    if (btnFriend.classList.contains('used')) {
        return;
    }

    const correct = questions[CurrentState].correct; // correct answer index
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
    btnFriend.classList.add('used'); // mark joker as used
};


function start() {
    renderQuestionText();
    renderOptions();
}

start();
