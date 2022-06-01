let questionCount = 0;
let score = 0;
let ans;
let timedOut = 0;
let rand;
let record = [];
let status = 0;

function $(id) {
    return document.getElementById(id);
}

let quiz = $("quiz");
let quizSet = $("quizSet");
let resultBox = $("resultBox");
let question = $("question");
let option1 = $("option1");
let option2 = $("option2");
let option3 = $("option3");
let option4 = $("option4");
let submit = $("submit");
let progress = $("progress");
let result = $("result");
let retake = $("retake");
let button1 = $("btn1");
let button2 = $("btn2");
let button3 = $("btn3");
let button4 = $("btn4");

let tracker;
let countDown;
let secsInput = 10;
let seconds = secsInput;
let t;

function setQuestion(qCount, rand) {
    let ques = questions[rand];
    question.textContent = (qCount + 1) + ". " + ques.question;
    option1.textContent = ques.option1;
    option2.textContent = ques.option2;
    option3.textContent = ques.option3;
    option4.textContent = ques.option4;
}

function changeProgressBar(qCount) {
    progress.innerHTML = "Spørsmål " + (qCount + 1) + " av 10";
    tracker = $("no" + (qCount + 1));
    tracker.style.backgroundColor = "#cc7a00";
}

function defaultOptionColors() {
    button1.style.backgroundColor = "#AF4879";
    button2.style.backgroundColor = "#5EC8E5";
    button3.style.backgroundColor = "#FFD457";
    button4.style.backgroundColor = "#67B346";
}

function getQuestion(qCount, rand) {
    if (qCount == 9) {
        submit.innerHTML = "Sjekk resultat";
        submit.style.backgroundColor = "#00b300";
    }

    if (qCount > 9) {
        return;
    }

    setQuestion(qCount, rand);
    changeProgressBar(qCount);
    defaultOptionColors();

    startTimer(seconds, "timer");
}

function setCorrect() {
    score++;
    tracker.style.backgroundColor = "#009900";
}

function setWrong() {
    tracker.style.backgroundColor = "#cc0000";
}

function finalScore() {
    if (score > 5) {
        result.innerHTML = "Gratulerer. Du fikk flere enn fem riktige svar. <br> Din score ble " + score + "!";
    }
    else {
        result.innerHTML = "Beklager. Du fikk færre enn seks riktige svar. <br> Din score ble " + score + "!";
    }
}

function setResultPage() {
    quizSet.style.display = "none";
    resultBox.style.display = "block";
    progress.innerHTML = "Quiz gjennomført";
    timer.textContent = "00:00";
    finalScore();
}

function randomGenerator() {
    while (status == 0) {
        rand = Math.round(Math.random() * questions.length);
        if (rand !== questions.length) {
            for (var j = 0; j < record.length; j++) {
                if (rand === record[j]) {
                    break;
                }

                else if (j == record.length - 1) {
                    record[questionCount] = rand;
                    status = 1;
                }
            }
        }
    }
    status = 0;

    return rand;
}

function startTimer(secs, elem) {
    t = $(elem);
    t.innerHTML = "00:" + secs;

    if (secs < 0) {
        clearTimeout(countDown);

        if (button1.style.backgroundColor !== "rgb(26, 255, 26)" && button2.style.backgroundColor !== "rgb(26, 255, 26)" && button3.style.backgroundColor !== "rgb(26, 255, 26)" && button4.style.backgroundColor !== "rgb(26, 255, 26)") {
            if (questionCount == 9) {
                setWrong();
                setResultPage();
                return;
            }
            setWrong();
            secs = secsInput;
            getQuestion(++questionCount, randomGenerator());
        }

        else {
            if (questionCount == 9) {
                if (ans === questions[rand].answer) {
                    setCorrect();
                }
                else {
                    setWrong();
                }
                setResultPage();
                return;
            }

            if (ans == questions[rand].answer) {
                setCorrect();
                secs = secsInput;
                getQuestion(++questionCount, randomGenerator());
            }

            else {
                setWrong();
                secs = secsInput;
                getQuestion(++questionCount, randomGenerator());
            }

        }
        return;
    }

    secs--;
    countDown = setTimeout('startTimer(' + secs + ',"' + elem + '")', 1000);

}

option1.addEventListener("click", optionSelect);
option2.addEventListener("click", optionSelect);
option3.addEventListener("click", optionSelect);
option4.addEventListener("click", optionSelect);

function optionSelect(e) {
    let parentEl = e.target.parentElement;
    parentEl.style.backgroundColor = "#1aff1a";

    switch (e.target.id) {
        case "option1": button2.style.backgroundColor = "#e6f3ff";
            button3.style.backgroundColor = "#e6f3ff";
            button4.style.backgroundColor = "#e6f3ff";
            break;
        case "option2": button1.style.backgroundColor = "#e6f3ff";
            button3.style.backgroundColor = "#e6f3ff";
            button4.style.backgroundColor = "#e6f3ff";
            break;
        case "option3": button1.style.backgroundColor = "#e6f3ff";
            button2.style.backgroundColor = "#e6f3ff";
            button4.style.backgroundColor = "#e6f3ff";
            break;
        case "option4": button1.style.backgroundColor = "#e6f3ff";
            button2.style.backgroundColor = "#e6f3ff";
            button3.style.backgroundColor = "#e6f3ff";
            break;
    }

    ans = parseInt(e.target.id.replace("option", ""), 10);
}

submit.addEventListener("click", nextQuestion);

function nextQuestion() {
    console.log(button1.style.backgroundColor);
    console.log(button1.style.backgroundColor !== "rgb(26, 255, 26)");
    if (button1.style.backgroundColor !== "rgb(26, 255, 26)" && button2.style.backgroundColor !== "rgb(26, 255, 26)" && button3.style.backgroundColor !== "rgb(26, 255, 26)" && button4.style.backgroundColor !== "rgb(26, 255, 26)") {
        alert("Vennligst velg et svaralternativ");
        return;
    }
    else {
        clearTimeout(countDown);
        secs = secsInput;

        if (questionCount == 9 && questionCount != 10) {
            if (ans == questions[rand].answer) {
                setCorrect();
            }
            else {
                setWrong();
            }
            setResultPage();
            return;
        }

        if (ans == questions[rand].answer) {
            setCorrect();
            getQuestion(++questionCount, randomGenerator());
        }
        else {
            setWrong();
            getQuestion(++questionCount, randomGenerator());
        }
    }
}

retake.addEventListener("click", retakeTest);

function retakeTest() {
    window.location.reload();
}

rand = Math.round(Math.random() * questions.length);
while (rand == questions.length) {
    rand = Math.round(Math.random() * questions.length);
}

record[0] = rand;

window.onload = getQuestion(questionCount, rand);


