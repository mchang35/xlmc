
var loginAnswer;

async function openQuestions() {
    console.log("loading questions...")
    let res = await fetch('questions.json');
    data = await res.json();
    return data.qs_and_as;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function loginQuestion() {
    // on load for the div
    let questions = await openQuestions();
    console.log("we are in loginQuestion");
    console.log(questions);
    let q_num = getRandomInt(questions.length);
    let loginQuestion = questions[q_num].question;
    loginAnswer = questions[q_num].answer;
    console.log(loginQuestion);

    let p = document.getElementById("login-question");
    p.innerHTML = loginQuestion;
}

function scrollToDiv(divId) {
    let div = document.getElementById(divId);
    div.scrollIntoView();
}

function login() {
    console.log("We have clicked Log In");
    userAnswer = document.getElementById("login-answer").value;
    // if answer is correct
    if (userAnswer.toLowerCase() == loginAnswer.toLowerCase()) {
        console.log("let's go to the next page");
        window.location.href = "home.html";
    } else { // if answer is not correct
        let incorrectMsgP = document.getElementById("incorrect-answer-message");
        incorrectMsgP.innerHTML = "Oops! That wasn't the correct answer or your answer may have been incorrectly spelled or formatted. Please try again."
    }   
}

function elapsedX(int, elapsed) {
    console.log("int: " + int)
    let conversions = [1000,60,60,24,365];
    let size = 1;
    let new_elapsed = elapsed;
    for (let i = 0; i < int; i++) {
        size = size * conversions[i];
    }
    let elapsedX = Math.floor(elapsed / size);
    new_elapsed = elapsed % size;
    return [elapsedX, new_elapsed];
}

function timeStr(num, unit) {
    let return_str = num + " " + unit;
    if (num > 1) {
        return_str = return_str + "s";
    }
    if (unit != "second") {
        return_str += ", "
    }
    if (unit == "minute") {
        return_str += "and "
    }
    return return_str;
}

function timeTogether() {
    console.log("time together is being calculated...");
    let today = new Date();
    let start = new Date('2020-08-07');

    let elapsed = (today - start);
    
    let elapsedYr = 0;
    let elapsedDay = 0;
    let elapsedHr = 0;
    let elapsedMin = 0;
    let elapsedS = 0;

    [elapsedYr, elapsed] = elapsedX(5, elapsed);
    [elapsedDay, elapsed] = elapsedX(4, elapsed);
    [elapsedHr, elapsed] = elapsedX(3, elapsed);
    [elapsedMin, elapsed] = elapsedX(2, elapsed);
    [elapsedS, elapsed] = elapsedX(1, elapsed);

    let yrStr = timeStr(elapsedYr, "year");
    let dayStr = timeStr(elapsedDay, "day");
    let hrStr = timeStr(elapsedHr, "hour");
    let minStr = timeStr(elapsedMin, "minute");
    let sStr = timeStr(elapsedS, "second");

    let elapsedDiv = document.getElementById("elapsed");
    elapsedDiv.innerHTML = yrStr + dayStr + hrStr + minStr + sStr + " down..."
}