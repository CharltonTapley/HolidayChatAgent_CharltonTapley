var coll = document.getElementsByClassName("collapsible");
var conversationType = "";
var reference = "";
var firstName = "";
var tempRating = "";
var category = "";

//Collapse and Expand chat bot
for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");

    var content = this.nextElementSibling;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

//Gets time to be used as the time stamp on UI
function getTime() {
  let today = new Date();
  hours = today.getHours();
  minutes = today.getMinutes();

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let time = hours + ":" + minutes;
  return time;
}

// Gets the first message
function firstBotMessage() {
  conversationType = "Name";
  let firstMessage = "Hello, what is your name?";
  document.getElementById("botStarterMessage").innerHTML =
    '<p class="botText"><span>' + firstMessage + "</span></p>";

  let time = getTime();

  $("#chat-timestamp").append(time);
  document.getElementById("userInput").scrollIntoView(false);
}

firstBotMessage();

//Gets dataset and filters based on users input
async function getFilteredResults(tempRating, category) {
  const response = await fetch("./Dataset.json", {});
  const json = await response.json();

  return json.filter(
    (obj) => obj.TempRating == tempRating && obj.Category == category
  );
}

//Gets bots response based on users input
function getBotResponse(input) {
  if (conversationType === "TempRating") {
    tempRating = input;
    conversationType = "Category";
    return "Would you like a lazy of an active holiday?";
  } else if (conversationType === "Category") {
    category = input;
    conversationType = "Results";
    let filteredResults = getFilteredResults(tempRating, category).then(
      (results) => {
        pushResponse(results);
      }
    );
  } else if (conversationType === "Name") {
    firstName = input;
    conversationType = "Blank";
    return (
      "Hi " +
      firstName.charAt(0).toUpperCase() +
      firstName.slice(1) +
      ", how can I help?"
    );
  } else if (conversationType === "Reference") {
    reference = input;
    conversationType = "Results";
    let filteredResults = getReferencedHoliday(reference).then((results) => {
      pushReference(results);
    });
  } else {
    if (input == "look for a holiday") {
      conversationType = "TempRating";
      return "Would you like a cold, mild or hot holiday?";
    } else if (input == "look up a reference") {
      conversationType = "Reference";
      return "Please enter a reference number: ";
    } else if (input == "thanks" || input == "thank you") {
      return "No problem!";
    } else if (input == "goodbye") {
      return "Have a good day!";
    } else if (input == "help") {
      return 'Try "Look for a holiday"  or "Look up a reference" to get started.';
    } else {
      return 'I am confused... try typing "help".';
    }
  }
}

// Push a response
function pushResponse(response) {
  $("#chatbox").append(
    '<p class="botText"><span>' +
      "I would recommend for you " +
      firstName.charAt(0).toUpperCase() +
      firstName.slice(1) +
      ": " +
      "</span></p>"
  );
  const keyValue = (input) =>
    Object.entries(input).forEach(([key, value]) => {
      holidays.push(value);
    });
  response.forEach((holiday) => {
    holidays = [];
    keyValue(holiday);
    let botHtml =
      '<p class="botText"><span>' +
      "Reference: " +
      holidays[0] +
      ", Hotel " +
      holidays[1] +
      ", which is in " +
      holidays[2] +
      ", " +
      holidays[3] +
      " costing £" +
      holidays[9] +
      "." +
      "</span></p>";
    $("#chatbox").append(botHtml);
  });
  document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

// Retrieves the response
function getHardResponse(userText) {
  let botResponse = getBotResponse(userText.toLowerCase());
  if (botResponse === undefined) {
  } else {
    let botHtml = '<p class="botText"><span>' + botResponse + "</span></p>";
    $("#chatbox").append(botHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);
  }
}

//Gets the text from the input box and processes it
function getResponse() {
  let userText = $("#textInput").val();
  let userHtml = '<p class="userText"><span>' + userText + "</span></p>";

  $("#textInput").val("");
  $("#chatbox").append(userHtml);
  document.getElementById("chat-bar-bottom").scrollIntoView(true);

  setTimeout(() => {
    getHardResponse(userText);
  }, 1000);
}

// Handles sending text via button clicks
function buttonSendText(sampleText) {
  let userHtml = '<p class="userText"><span>' + sampleText + "</span></p>";

  $("#textInput").val("");
  $("#chatbox").append(userHtml);
  document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

function sendButton() {
  getResponse();
}

//Gets response based on the reference
async function getReferencedHoliday(reference) {
  const response = await fetch("./Dataset.json", {});
  const json = await response.json();

  return json.filter((obj) => obj.HolidayReference == reference);
}

//Pushes reference to the user
function pushReference(response) {
  const keyValue = (input) =>
    Object.entries(input).forEach(([key, value]) => {
      holidays.push(value);
    });
  response.forEach((holiday) => {
    holidays = [];
    keyValue(holiday);
    let botHtml =
      '<p class="botText"><span>' +
      "Reference: " +
      holidays[0] +
      "\nHotel name: " +
      holidays[1] +
      "\nCity: " +
      holidays[2] +
      "\nContinent: " +
      holidays[3] +
      "\nCountry: " +
      holidays[4] +
      "\nCategory: " +
      holidays[5] +
      "\nStar rating: " +
      holidays[6] +
      "\nTemperature rating: " +
      holidays[7] +
      "\nLocation: " +
      holidays[8] +
      "\nPrice per night: £" +
      holidays[9];
    ("</span></p>");
    $("#chatbox").append(botHtml);
  });
  document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

// Press enter to send a message
$("#textInput").keypress(function (e) {
  if (e.which == 13) {
    getResponse();
  }
});
