// import * as fs from 'fs';

var loginAnswer;
var TRIPS = {};
var PHOTOS = {};
var PHOTO_DIR = "Photos/";
var SELECTEDPHOTONUM;
var NUM_PHOTOS;

// index
async function openJSON(path) {
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

async function loadAllHome() {
    TRIPS = await openJSON('trips.json');

    timeTogether();
    layoutOurTrips();
    layoutTripsToTake();
    console.log("About to load the photo gallery...");
    loadPhotoGallery();
    console.log("Done loading the photo gallery.");
    layoutTimeline();

    let url = new URL(window.location);
    let searchParams = url.searchParams;
    let goToDiv = searchParams.get('section');

    if (goToDiv) {
        scrollToDiv(goToDiv);
    }
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

function startEndDates(start, end) {
    let datesStr = makeDate(start.month, start.day, start.year);
    if (end) {
        datesStr = datesStr + " - ";
        datesStr = datesStr + makeDate(end.month, end.day, end.year);
    }

    return datesStr;
}

function layoutTrip(trip, ind) {
    console.log("ind: " + ind);
    console.log("    trip:");
    console.log(trip);
    console.log("    primary photo:" + trip.primary_photo);

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
    photo.onclick = function() {clickTrip(trip.name)};
    photo.setAttribute("src", PHOTO_DIR + trip.primary_photo);
    photo.setAttribute("alt", PHOTOS[trip.primary_photo]);
    // photo.src = PHOTO_DIR + trip.primary_photo;
    // photo.alt = PHOTOS[trip.primary_photo];
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
    modifyButton.classList.add("orange-transparent-button");
    modifyButton.innerHTML = "Modify Trip";
    row2col1.appendChild(modifyButton);
    // row 2 col 2: title ("trip X: <title>") and dates as ps
    let row2col2 = document.createElement("div");
    row2col2.classList.add("col-9");
    row2.appendChild(row2col2);
    let title = document.createElement("a");
    title.setAttribute('id','title');
    title.style.textAlign = "right";
    title.innerHTML = "Trip #" + (ind + 1).toString() + ": " + trip.name;
    title.onclick = function() {clickTrip(trip.name)};
    row2col2.appendChild(title);

    let dates = document.createElement("p");
    dates.innerHTML = startEndDates(trip.start_date, trip.end_date);
    dates.style.textAlign = "right";
    row2col2.appendChild(dates);

    return tripDiv;

}

function layoutOurTrips() {
    console.log("we are laying out trips");

    let container = document.getElementById("ourtrips");
    // TRIPS = await openJSON('trips.json');

    let trips = Object.keys(TRIPS);
    console.log("Trips: ");
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

        let tripDiv = layoutTrip(TRIPS[trips[ind]], ind);

        col.appendChild(tripDiv);

        ind = ind + 1;
    }
}

// need to finish this function and create form page
function goToAddTripForm() {
    // go to the add trip form
    console.log("going to add trip form");
}

function clickTrip(tripName) {
    let url = new URL(window.location);
    let searchParams = url.searchParams;

    searchParams.delete('section');

    searchParams.set('tripName', tripName);
    url.search = searchParams.toString();
    let newURL = url.toString();
    newURL = newURL.replace('home.html','trip-info.html');
    window.location.href = newURL;
}

// trip info page
function makeLocationString(location) {
    let country = location.country;
    let state = location.state;
    let city = location.city;

    let returnStr = "";

    if (country == "United States of America") {
        returnStr = city;
        if (state) {
            returnStr = returnStr + ", " + state;
        }
    } else {
        if (city) {
            returnStr = city;
            if (state) {
                returnStr = returnStr + ", " + state;
            }
            if (country) {
                returnStr = returnStr + ", " + country;
            }
        } else {
            if (state) {
                returnStr = state;
                if (country) {
                    returnStr = returnStr + " " + country;
                }
            } else {
                returnStr = country;
            }
        }
    }
    
    return returnStr;
}

function makeAllLocationString(locations) {
    let locStr = makeLocationString(locations[0]);

    if (locations.length > 1) {
        if (locations.length == 2) {
            locStr = locStr + " and ";
        } else {
            locStr = locStr + ", ";
        }
        for (let j = 1; j < locations.length; j++) {
            let location = locations[j];
            locStr = locStr + makeLocationString(location);
            if (j + 2 < locations.length) {
                locStr = locStr + ", ";
            }
            if (j + 2 == locations.length) {
                locStr = locStr + ", and ";
            }
        }
    }

    return locStr;
}

async function loadTripInfo() {
    TRIPS = await openJSON('trips.json');
    PHOTOS = await openJSON('photos.json');

    // get trip name from the URL
    let url = new URL(window.location);
    let searchParams = url.searchParams;
    let tripName = searchParams.get('tripName');
    let tripInfo = TRIPS[tripName];

    let h1Title = document.getElementById("trip-title");
    let pAddedBy = document.getElementById("added-by");
    let h2Date = document.getElementById("trip-date");
    let h3Location = document.getElementById("trip-location");
    let pDesc = document.getElementById("trip-desc");
    let img = document.getElementById("trip-img");
    let pCaption = document.getElementById("trip-img-caption");

    h1Title.innerHTML = tripInfo.name;
    pAddedBy.innerHTML = "Added by: " + tripInfo.added_by;
    h2Date.innerHTML = startEndDates(tripInfo.start_date, tripInfo.end_date);
    h3Location.innerHTML = makeAllLocationString(tripInfo.locations);
    pDesc.innerHTML = tripInfo.description;
    img.src = PHOTO_DIR + tripInfo.primary_photo;
    pCaption.innerHTML = PHOTOS[tripInfo.primary_photo];

    loadPhotoGallery(tripInfo.photos);
}

// trips we'd like to take
async function layoutTripsToTake() {
    let domesticUl = document.getElementById("tripstotake-domestic-ul");
    let internationalUl = document.getElementById("tripstotake-international-ul");
    let res = await openJSON('futuretrips.json');
    let futureTrips = res.futuretrips;
    
    for (let i = 0; i < futureTrips.length; i++) {
        let trip = futureTrips[i];
        let locations = trip.locations;
        let li = document.createElement("li");
        li.style.textAlign = "left"; // find a way to do this in CSS?

        let domestic = true;

        if (locations[0].country != "United States of America") {
            domestic = false;
        }

        let locStr = makeAllLocationString(locations);

        li.innerHTML = locStr;
        if (domestic) {
            domesticUl.appendChild(li);
        } else {
            internationalUl.appendChild(li);
        }
    }
    
}

// Photo gallery
function createPhotoGalleryPhotos(paths, photoGalleryDiv) {
    for (let i = 0; i < paths.length; i++) {
        let img = document.createElement("img");
        img.src = PHOTO_DIR + paths[i];
        img.onclick = function() {selectPhoto(paths[i], i)};
        photoGalleryDiv.appendChild(img);
        img.setAttribute("id", "photo-" + i);
    }
}

// could refine this to retrieve and write to the Photos directory
async function loadPhotoGallery(photoPaths=null) {
    PHOTOS = await openJSON('photos.json');
    NUM_PHOTOS = Object.keys(PHOTOS).length;

    let photoGallery = document.getElementById("photogallery");
    let paths;

    if (photoPaths) {
        paths = photoPaths;
    } else {
        paths = Object.keys(PHOTOS);

        // trying the directory version
        // let url = "https://api.github.com/repos/mchang35/xlmc/git/trees/master?recursive=1";
    }

    NUM_PHOTOS = paths.length;

    createPhotoGalleryPhotos(paths, photoGallery);

    // open Photos directory and put all paths into a list
    // let fs = require('fs');
    // let photoPaths = fs.readdirSync('Photos/');

    // console.log("Photo paths");
    // console.log(photoPaths);

    // for each photo: create img item, with src as the path
    // add img item to the photogallery div
}

function setSelectedPhoto(path, ind) {

    let splitPath = path.split("/");
    let refinedPath = splitPath[splitPath.length - 1];

    let selectedPhotoImg = document.getElementById("selected-photo");
    selectedPhotoImg.src = PHOTO_DIR + refinedPath;

    let captionP = document.getElementById("selected-photo-caption");
    captionP.innerHTML = PHOTOS[refinedPath];

    SELECTEDPHOTONUM = ind;
    document.getElementById("photo-num").innerHTML = String(ind + 1);
}

function selectPhoto(path, ind) {
    // open the selected-photo-overlay
    let overlay = document.getElementById("photo-gallery-modal");
    overlay.style.display = "block";

    setSelectedPhoto(path, ind);

    document.getElementById("total-photos").innerHTML = String(NUM_PHOTOS);
}

function nextPrevPhoto(dir) {
    let newNum = SELECTEDPHOTONUM;

    if (dir > 0) {
        newNum = SELECTEDPHOTONUM + 1;
        if (newNum > NUM_PHOTOS) {
            newNum = 0;
        }
    } else {
        newNum = SELECTEDPHOTONUM - 1;
        if (newNum < 0) {
            newNum = NUM_PHOTOS - 1;
        }
    }
    
    let newPath = document.getElementById("photo-" + newNum).src;

    setSelectedPhoto(newPath, newNum);
    SELECTEDPHOTONUM = newNum;

}

function closeSelectedPhoto() {
    document.getElementById("photo-gallery-modal").style.display = "none";
}

function goTo(htmlPath) {
    window.location.href = htmlPath;
}

// primarily for the photoGallery.html and trip-info.html files
function goBackHome(divContainer) {
    let url = new URL(window.location);
    let searchParams = url.searchParams;

    searchParams.delete('tripName');

    searchParams.set('section', divContainer);
    url.search = searchParams.toString();
    let newURL = url.toString();

    let URLparts = newURL.split(".html")[0].split("/");
    let currPage = URLparts[URLparts.length - 1];

    newURL = newURL.replace(currPage + '.html','home.html');
    window.location.href = newURL;
}

// special dates
// not finished
function sortDates(dates) {
    let sortedDates = [];
    
    // should return an array of sorted date objects
}

function appendDateInfoToCol(p, col) {
    col.appendChild(p);
}

function makeTimelineItem(timelineDiv, index, dateInfo) {
    // create the row and col divs
    let row = document.createElement("div");
    row.classList.add("row");
    let left = document.createElement("div");
    left.classList.add("col","timeline-item-l");
    let right = document.createElement("div");
    right.classList.add("col","timeline-item-r");
    row.appendChild(left);
    row.appendChild(right);
    timelineDiv.appendChild(row);

    // setting up date-specific stuff
    let text = document.createElement("p");
    text.classList.add("timeline-text");
    let dateSpan = document.createElement("span");
    dateSpan.classList.add("timeline-date");

    // get information from the dateInfo object
    let start = dateInfo.date.start;
    let startStr = makeDate(start.month, start.day, start.year);

    let end;
    let endStr;

    if (dateInfo.date.end) {
        end = dateInfo.date.end;
        endStr = makeDate(end.month, end.day, end.year);
    }

    let fullDateStr = startStr;
    if (endStr) {
        fullDateStr = fullDateStr + " - " + endStr;
    }

    let desc = dateInfo.description;

    // setting the element values
    dateSpan.innerHTML = fullDateStr;
    text.innerHTML = "<span class='timeline-date'>" + fullDateStr + "</span>:\n" + desc;

    // set up the div on the left or right side according to index
    if (index % 2 == 0) {
        appendDateInfoToCol(text, left);
    } else {
        appendDateInfoToCol(text, right);
    }
}

async function layoutTimeline() {
    let res = await openJSON('specialdates.json');
    let dates = res.dates;

    let timelineDiv = document.getElementById("timeline");

    for (let i = 0; i < dates.length; i++) {
        makeTimelineItem(timelineDiv, i, dates[i]);
    }
}

// not finished
function goToEditTimeline() {
    // go to a new page
}

// photo gallery PAGE
// not finished
function goToAddPhotos() {
    
}