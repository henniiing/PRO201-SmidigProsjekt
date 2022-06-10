let questionCount = 0; // teller for antall spørsmål som har blitt vist. initialiseres til 0 og kan inkrementere opptil 9
let score = 0; // teller for riktige besvarelser i quiz. initialiseres til 0 og kan inkrementere opptil 10
let ans; // mottar et tall som refererer til riktig svar på spørsmål. brukerens besvarelse sjekkes mot dette tallet.
let timedOut = 0;
let rand; // variabel som skal motta et tilfeldig tall som benyttes for å hente et tilfeldig spørsmål
let record = []; // array som kontinuerlig lagrer tallene knyttet til alle spørsmålene vist i quiz-en så spørsmål ikke gjentas
let status = 0; // bestemmer om løkken som genererer spørsmål skal kjøre eller ei. løkken stopper når verdien settes til 1

// forenkler koden så variabler som refererer til HTML-elementer slipper å inkludere document.getElementById()
function $(id) {
    return document.getElementById(id);
}

// variabler som holder en referanse til hvert sitt element i HTML-koden
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

let tracker; // holder tallet for det aktuelle spørsmålet og angir dets farge avhengig av om avgitt svar er riktig eller ei
let countDown; // igangsetter og avslutter tidsuret
let secsInput = 30; // bestemmer antall sekunder tidsuret teller ned fra. vi har satt den til 30 for å gi god tid.
let seconds = secsInput; // mottar tallet 30 fra secsInput. Innholdet forandrer seg etter hvert som tidsuret teller ned fra 30 til 0. Denne variabelen kan virke overflødig, men er nødvendig fordi vi trenger å beholde verdien 30 i secsInput når vi skal starte tidsuret på ny når neste spørsmål vises. Derfor må seconds og secsInput separeres.
let t; // holder selve tidsuret. det lastes inn i HTML-elementet med id satt til timer

// henter et tilfeldig spørsmål og tilhørende svaralternativer
function setQuestion(qCount, rand) {
    let ques = questions[rand]; // henter objektet (med spørsmål og svar) fra filen questions.js som samsvarer det tilfeldige tallet rand holder
    question.textContent = (qCount + 1) + ". " + ques.question; // gjengir spørsmålet fra objektet
    option1.textContent = ques.option1; // gjengir svaralternativ 1 fra objektet
    option2.textContent = ques.option2; // gjengir svaralternativ 2 fra objektet
    option3.textContent = ques.option3; // gjengir svaralternativ 3 fra objektet
    option4.textContent = ques.option4; // gjengir svaralternativ 4 fra objektet
}

// gir info til bruker om progresjonen i en pågående quiz-seanse
function changeProgressBar(qCount) {
    progress.innerHTML = "Spørsmål " + (qCount + 1) + " av 10"; // viser brukeren med tall hvor langt man har kommet i quiz
    tracker = $("no" + (qCount + 1)); // setter tallet for det aktuelle spørsmålet
    tracker.style.backgroundColor = "#cc7a00"; // setter en oransje farge på sirkelen for det aktuelle spprsmålet inntil det er besvart
}

// setter standard-farge for hver av svaralternativ-elementene. disse benyttes for å tilbakestille bakgrunnsfargen når bruker har trykket et valg for så å trykke seg bort fra det
function defaultOptionColors() {
    button1.style.backgroundColor = "#AF4879"; // setter lilla bakgrunnsfarge
    button2.style.backgroundColor = "#5EC8E5"; // setter lyseblå bakgrunnsfarge
    button3.style.backgroundColor = "#FFD457"; // setter gul bakgrunnsfarge
    button4.style.backgroundColor = "#67B346"; // setter grønn bakgrunnsfarge
}

// laster inn data for quiz
function getQuestion(qCount, rand) {

    if (qCount == 9) { // hvis quiz har kommet til det siste spørsmålet
        submit.innerHTML = "Sjekk resultat"; // endrer tekst på submit-knapp fra «Neste spørsmål» til «Sjekk resultat»
        submit.style.backgroundColor = "#00b300"; // endrer bakgrunnsfargen på submit-knapp fra grå til grønn
    }

    if (qCount > 9) { // hvis quiz har kommet forbi det siste spørsmålet
        return; // ingen spørsmål lastes inn. funksjonen slutter fungere
    }

    // hvis ingen av de to betingelsene ovenfor er oppfylt, vil de fire funksjonene nedenfor kjøres
    setQuestion(qCount, rand); // henter et tilfeldig spørsmål og tilhørende svaralternativer
    changeProgressBar(qCount); // gir info om progresjonen i quiz
    defaultOptionColors(); // setter standard-bakgrunnsfarge for svaralternativene

    startTimer(seconds, "timer"); // henter tidsuret og laster det inn i elementet med id satt til "timer"
}

function setCorrect() { // hvis bruker har registrert riktig svaralternativ på et spørsmål
    score++; // øker score med ett poeng
    tracker.style.backgroundColor = "#009900"; // setter grønn bakgrunnsfarge
}

function setWrong() { // hvis bruker har registrert feil svaralternativ på et spørsmål
    tracker.style.backgroundColor = "#cc0000"; // setter rød bakgrunnsfarge
}

// gjengir sluttresultatet av brukerens innsats fra quiz med poengscore
function finalScore() {
    if (score > 5) {
        result.innerHTML = "Gratulerer. Du fikk flere enn fem riktige svar. <br> Din score ble " + score + "!";
    }
    else {
        result.innerHTML = "Du fikk færre enn seks riktige svar. <br> Din score ble " + score + "!<br><br>Prøv igjen. Du kan helt sikkert gjøre bedre";
    }
}

function setResultPage() {
    quizSet.style.display = "none"; // setter boksen med visning av quiz-en til å bli skjult
    resultBox.style.display = "block"; // setter boksen med visning av quiz-resultatet til å bli vist
    progress.innerHTML = "Quiz gjennomført"; // skriver en tekst
    timer.textContent = "00:00"; // skriver en tekst som viser at tidsuret ikke er i funksjon
    finalScore(); // kaller på en funksjon som gjengir resultatet av brukerens innsats i quiz-en
}

// returnerer et tilfeldig tall mellom 0 og 9 som refererer til et spørsmål som ikke allerede er stilt i quiz. 
function randomGenerator() {
    while (status == 0) { // så lenge status er satt til 0 kjøres løkken
        rand = Math.round(Math.random() * questions.length); // genererer et tilfeldig tall mellom 0 og 9
        if (rand !== questions.length) { // så lenge det tilfeldig genererte tallet ikke er lik 10
            for (var j = 0; j < record.length; j++) { // løkke kjører gjennom array med tall som refererer til spørsmål som allerede er stilt i quiz
                if (rand === record[j]) { // hvis det tilfeldige tallet har en match i array-et med lagrede spørsmål
                    break; // avbryter løkken for å kjøre løkken på ny. i praksis betyr det at spørsmålet allerede er stilt. vi trenger kjøre løkken på ny for å generere et nytt tall som ikke allerede finnes i array-et.
                }

                else if (j == record.length - 1) { // hvis løkken har kjørt gjennom array-et med lagrede spørsmål uten å finne en match blant de lagrede tallene i array-et betyr det at tallet er unikt, dvs at spørsmålet det refererer til ikke har blitt stilt i quiz enda
                    record[questionCount] = rand; // lagre det unike tallet i array-et så spørsmålet det refererer til ikke blir stilt igjen senere i samme quiz
                    status = 1; // avslutt løkken
                }
            }
        }
    }
    status = 0; // status settes tilbake til 0 så løkken kan kjøres på ny når neste spørsmål skal hentes

    return rand; // returnerer det tilfeldige tallet mellom 0 og 9 som ikke matcher med noen av de lagrede tallene i array-et med allerede stilte spørsmål
}

// tidsuret med nedtelling
function startTimer(secs, elem) {
    t = $(elem); // variabel som holder timer-elementet
    t.innerHTML = "00:" + secs; // skriver tidsuret til timer-elementet i HTML-koden

    if (secs < 0) { // hvis tidsuret har tellet ned til verdien 0
        clearTimeout(countDown); // stopper tidsuret

        // hvis ingen av svaralternativene er trykket på (innen tiden er ute)
        if (button1.style.backgroundColor !== "rgb(26, 255, 26)" && button2.style.backgroundColor !== "rgb(26, 255, 26)" && button3.style.backgroundColor !== "rgb(26, 255, 26)" && button4.style.backgroundColor !== "rgb(26, 255, 26)") {
            if (questionCount == 9) { // hvis siste spørsmål i quiz
                setWrong(); // setter tracker til rød bakgrunnsfarge
                setResultPage(); // viser brukerens sluttresultat fra quiz
                return; // stopper funksjonen fra å kjøre videre
            }
            setWrong(); // setter tracker til rød bakgrunnsfarge
            secs = secsInput; // tilbakestiller tidsuret for neste spørsmål
            getQuestion(++questionCount, randomGenerator()); // henter nytt spørsmål
        }

        // hvis et svaralternativ er trykket på
        else {
            if (questionCount == 9) { // hvis siste spørsmål i quiz
                if (ans === questions[rand].answer) { // hvis svaralternativet valgt av bruker er riktig svar
                    setCorrect(); // øker brukerens score med ett poeng og setter tracker tilhørende spørsmålet til grønn bakgrunnsfarge
                }
                else { // hvis svaralternativet valgt av bruker er feil svar
                    setWrong(); // setter tracker tilhørende spørsmålet til rød bakgrunnsfarge
                }
                setResultPage(); // viser brukerens sluttresultat fra quiz
                return; // stopper funksjonen fra å kjøre videre
            }

            // hvis spørsmåler ikke er det siste i quiz
            if (ans == questions[rand].answer) { // hvis svaralternativet valgt av bruker er riktig svar
                setCorrect(); // øker brukerens score med ett poeng og setter tracker tilhørende spørsmålet til grønn bakgrunnsfarge
                secs = secsInput; // tilbakestiller tidsuret for neste spørsmål
                getQuestion(++questionCount, randomGenerator()); // henter nytt spørsmål
            }
            else { // hvis svaralternativet valgt av bruker er feil svar
                setWrong(); // setter tracker tilhørende spørsmålet til rød bakgrunnsfarge
                secs = secsInput; // tilbakestiller tidsuret for neste spørsmål
                getQuestion(++questionCount, randomGenerator()); // henter nytt spørsmål
            }

        }
        return; // stopper funksjonen
    }

    // de to nedenforstående linjene skaper i praksis tidsurets nedtelling
    secs--; // reduserer tallet det holder med 1
    countDown = setTimeout('startTimer(' + secs + ',"' + elem + '")', 1000); // med tidsintervall på 1000 millisekunder (dvs 1 sekund) kjøres funksjonen på ny.

}

option1.addEventListener("click", optionSelect);
option2.addEventListener("click", optionSelect);
option3.addEventListener("click", optionSelect);
option4.addEventListener("click", optionSelect);

function optionSelect(e) {
    let parentEl = e.target.parentElement;
    parentEl.style.backgroundColor = "#1aff1a";

    switch (e.target.id) {
        case "option1": button2.style.backgroundColor = "#5EC8E5";
            button3.style.backgroundColor = "#FFD457";
            button4.style.backgroundColor = "#67B346";
            break;
        case "option2": button1.style.backgroundColor = "#AF4879";
            button3.style.backgroundColor = "#FFD457";
            button4.style.backgroundColor = "#67B346";
            break;
        case "option3": button1.style.backgroundColor = "#AF4879";
            button2.style.backgroundColor = "#5EC8E5";
            button4.style.backgroundColor = "#67B346";
            break;
        case "option4": button1.style.backgroundColor = "#AF4879";
            button2.style.backgroundColor = "#5EC8E5";
            button3.style.backgroundColor = "#FFD457";
            break;
    }

    ans = parseInt(e.target.id.replace("option", ""), 10);
}

submit.addEventListener("click", nextQuestion);

function nextQuestion() {
    console.log(button1.style.backgroundColor);
    console.log(button1.style.backgroundColor !== "rgb(26, 255, 26)");
    if (button1.style.backgroundColor !== "rgb(26, 255, 26)" && button2.style.backgroundColor !== "rgb(26, 255, 26)" && button3.style.backgroundColor !== "rgb(26, 255, 26)" && button4.style.backgroundColor !== "rgb(26, 255, 26)") { // sjekker først om bakgrunnsfargen på noen av de fire valgalternativene i quiz-en er blitt lysegrønn.
        Hvis man har gjort et valg i quiz - en ved å trykke en av de fire alternativene, vil boksen med det valgte alternativet ha fått lysegrønn bakgrunnsfarge.
        Hvis ingen av dem har den fargen, vil en alert - boks dukke opp på skjermen med beskjed om å «Vennligst velge et svaralternativ»
        alert("Vennligst velg et svaralternativ");
        return; // stopper funksjonen fra å kjøre videre
    }
    else {
        clearTimeout(countDown);
        secs = secsInput;

        if (questionCount == 9 && questionCount != 10) {
            if (ans == questions[rand].answer) { // hvis svaralternativet valgt av bruker er riktig svar
                setCorrect(); // øker brukerens score med ett poeng og setter tracker tilhørende spørsmålet til grønn bakgrunnsfarge
            }
            else {
                setWrong(); // setter tracker tilhørende spørsmålet til rød bakgrunnsfarge
            }
            setResultPage(); // viser brukerens sluttresultat fra quiz
            return; // stopper funksjonen fra å kjøre videre
        }

        if (ans == questions[rand].answer) { // hvis svaralternativet valgt av bruker er riktig svar
            setCorrect(); // øker brukerens score med ett poeng og setter tracker tilhørende spørsmålet til grønn bakgrunnsfarge
            getQuestion(++questionCount, randomGenerator()); // henter nytt spørsmål
        }
        else {
            setWrong(); // setter tracker tilhørende spørsmålet til rød bakgrunnsfarge
            getQuestion(++questionCount, randomGenerator()); // henter nytt spørsmål
        }
    }
}

// klikk på knappen merket med teksten «Ta quiz på ny» kaller på funksjonen retakeTest()
retake.addEventListener("click", retakeTest);

// laster inn siden på ny
function retakeTest() {
    window.location.reload();
}

// genererer et tilfeldig tall mellom 0 og 9
rand = Math.round(Math.random() * questions.length);
while (rand == questions.length) {
    rand = Math.round(Math.random() * questions.length);
}

record[0] = rand;

// scriptet kjøres igang når nettleseren laster inn siden
// kaller på funksjonen getQuestion()
window.onload = getQuestion(questionCount, rand);


