
var start = true;
var questions;
var q_num;
// openQuestions();

async function openQuestions() {
    console.log("loading questions...")
    let res = await fetch('questions.json');
    data = await res.json();
    console.log("initial data from json:")
    console.log(data)
    questions = data.qs_and_as;
    console.log("Qs and As:")
    console.log(questions);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function loginQuestion() {
    // on load for the div
    await openQuestions();
    console.log("we are in loginQuestion");
    console.log(questions);
    q_num = getRandomInt(questions.length);
    let loginQuestion = questions[q_num].question;
    console.log(loginQuestion);

    let p = document.getElementById("login-question");
    p.innerHTML = loginQuestion;
}

function scrollToLogin() {
    let loginDiv = document.getElementById("login-container");
    loginDiv.scrollIntoView();
}

function login() {
    console.log("We have clicked Log In");
    // get the answer
    userAnswer = document.getElementById("login-answer").value;
    // if answer is correct
    if (userAnswer.toLowerCase() == questions[q_num].answer.toLowerCase()) {
        // go to the next page
        console.log("let's go to the next page");
    } else { // if answer is not correct
        let incorrectMsgP = document.getElementById("incorrect-answer-message");
        incorrectMsgP.innerHTML = "Oops! That wasn't the correct answer or your answer may have been incorrectly spelled or formatted. Please try again."
    }   
}