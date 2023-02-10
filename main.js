
var loginAnswer;

// index
async function openJSON(path) {
    console.log("loading questions...")
    let res = await fetch(path);
    data = await res.json();
    return data;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function loginQuestion() {
    // on load for the div
    let res = await openJSON('questions.json');
    let questions = res.qs_and_as;
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

// home

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

function loadAllHome() {
    timeTogether();
    layoutOurTrips();
}

// our trips
function makeDate(month, day, year) {
    let monthStr = "";
    switch (month) {
        case 1:
            monthStr = "January";
            break;
        case 2:
            monthStr = "February";
            break;
        case 3:
            monthStr = "March";
            break;
        case 4:
            monthStr = "April";
            break;
        case 5:
            monthStr = "May";
            break;
        case 6:
            monthStr = "June";
            break;
        case 7:
            monthStr = "July";
            break;
        case 8:
            monthStr = "August";
            break;
        case 9:
            monthStr = "September";
            break;
        case 10:
            monthStr = "October";
            break;
        case 11:
            monthStr = "November";
            break;
        case 12:
            monthStr = "December";
            break;
    }
    let return_str = monthStr;
    if (day) {
        return_str = return_str + " " + day.toString() + ",";
    }
    return_str = return_str + " " + year.toString();
    return return_str;
}

function layoutTrip(trip, ind) {
    // create a div for the trip == make it a grid
    let tripDiv = document.createElement("div");
    tripDiv.classList.add("trip");
    // row 1
    let row1 = document.createElement("div");
    row1.classList.add("row");
    tripDiv.appendChild(row1);
    // row 1 col: photo
    let row1col = document.createElement("div");
    row1col.classList.add("col");
    row1.appendChild(row1col);
    let photo = document.createElement("img");
    // photo.classList.add("img-responsive");
    photo.src = trip.primary_photo;
    row1col.appendChild(photo);

    // row 2
    let row2 = document.createElement("div");
    row2.classList.add("row");
    tripDiv.appendChild(row2);
    // row 2 col 1 -- col-3: button to modify
    let row2col1 = document.createElement("div");
    row2col1.classList.add("col-3");
    row2.appendChild(row2col1);
    let modifyButton = document.createElement("button");
    modifyButton.innerHTML = "Modify Trip";
    row2col1.appendChild(modifyButton);
    // row 2 col 2: title ("trip X: <title>") and dates as ps
    let row2col2 = document.createElement("div");
    row2col2.classList.add("col-9");
    row2.appendChild(row2col2);
    let title = document.createElement("p");
    title.style.textAlign = "right";
    title.innerHTML = "Trip #" + (ind + 1).toString() + ": " + trip.name;
    row2col2.appendChild(title);

    let dates = document.createElement("p");
    let startDate = trip.start_date;
    let datesStr = makeDate(startDate.month, startDate.day, startDate.year);
    let endDate = trip.end_date;
    if (endDate) {
        datesStr = datesStr + " - ";
        datesStr = datesStr + makeDate(endDate.month, endDate.day, endDate.year);
    }
    dates.innerHTML = datesStr;
    dates.style.textAlign = "right";
    row2col2.appendChild(dates);

    return tripDiv;

}


async function layoutOurTrips() {
    let container = document.getElementById("ourtrips-container");
    let res = await openJSON('trips.json');
    let trips = res.trips;
    console.log("we are in layoutOurTrips");
    console.log(trips);

    let ind = 0;
    let row;
    let col;

    while (ind < trips.length) {
        let formatNum = ind % 6;
        if (formatNum == 0 || formatNum == 2 || formatNum == 3 || formatNum == 5) {
            row = document.createElement("div");
            row.classList.add("row");
            container.appendChild(row);
        }
        col = document.createElement("div");
        let colClass = "col";
        if (formatNum == 0 || formatNum == 4) {
            colClass = "col-8";
        } else if (formatNum == 1 || formatNum == 3) {
            colClass = "col-4";
        }
        col.classList.add(colClass);
        row.appendChild(col);

        let tripDiv = layoutTrip(trips[ind], ind);

        col.appendChild(tripDiv);

        ind = ind + 1;
    }
}

// trips we'd like to take

// special dates

// business ideas