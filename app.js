const countryName = document.querySelector('#country-name');
const cityNameInput = document.querySelector('#city-name-input');
const submitButton = document.querySelector('#submitButton');
let listJSON = [];
const errorMessage = document.querySelector('#errorMessage');
let countryObject = {};
const resultDiv = document.querySelector('#resultDiv');
const resultDivText = resultDiv.querySelector('p');
const formDiv = document.querySelector('#formDiv');
const playAgainButton = document.querySelector('#playAgainButton');
const countryUl = resultDiv.querySelector('#countryUl');
const introDiv = document.querySelector('#introDiv');
const startButton = introDiv.querySelector('#startButton');
const playerName = introDiv.querySelector('#playerName');
let playerCount = [];
const counterDiv = document.querySelector('#counterDiv');
const modalNameSpan = document.querySelector('#modalNameSpan');
const newPlayerButton = document.querySelector('#newPlayerButton');
const nameErrorMessage = document.querySelector('#nameErrorMessage');
const cancelModals = document.querySelectorAll('.cancelModal');

//check if the user's broswer supports Local Storage
function supportsLocalStorage() {
  try {
  return 'localStorage' in window && window['localStorage'] !== null;
} catch(e) {
  return false;
}
}

function getExistingLocalData(playerName) {
    playerCount = localStorage.getItem('playerData');
    if(playerCount) {
      return JSON.parse(playerCount);
    } else {
      playerCount = {
        'name' : playerName,
        'correct' : 0,
        'incorrect' : 0
      }
      localStorage.setItem('playerData', JSON.stringify(playerCount));
      return playerCount;
    }
  }

function updateLocalStorage(playerCount) {
  localStorage.setItem('playerData', JSON.stringify(playerCount));
}

function updateCounterDiv() {
  counterDiv.style.display = "";
  counterDiv.firstElementChild.firstElementChild.textContent = 'Player: ' + playerCount.name;
  counterDiv.firstElementChild.firstElementChild.nextElementSibling.textContent = 'Questions Answered: ' + (playerCount.correct + playerCount.incorrect);
  counterDiv.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.textContent = 'Questions Correct: ' +  playerCount.correct;
  counterDiv.firstElementChild.lastElementChild.previousElementSibling.textContent = 'Questions Incorrect: ' +  playerCount.incorrect;
  if(counterDiv.firstElementChild.firstElementChild.nextElementSibling.textContent !== 'Questions Answered: 0') {
    counterDiv.firstElementChild.lastElementChild.textContent = 'Win Percentage: ' + ((playerCount.correct / (playerCount.correct + playerCount.incorrect)) * 100).toFixed(2) + '%';
  }
}

// If playerData already exists, display their name on the intro page
function existingPlayer() {
  if(playerCount.name) {
    const nameBox = document.createElement('div');
    nameBox.textContent = 'You are currently playing as ' + playerCount.name;
    nameBox.className = 'text-center nameBox text-success';
    introDiv.firstElementChild.nextElementSibling.nextElementSibling.insertBefore(nameBox, introDiv.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild);
  }
}

//if the player enters a different name in the name box, prompt them if they want to create a new player.
function resetPlayerData() {
  if(playerName.value !== "" && playerName.value !== playerCount.name) {
    modalNameSpan.textContent = playerCount.name;
    $('#myModal').modal('show');
    newPlayerButton.addEventListener('click', () => {
      localStorage.removeItem('playerData');
      playerCount = getExistingLocalData(playerName.value);
      introDiv.style.display = "none";
      formDiv.style.display = "block";
      $('#myModal').modal('hide');
      updateCounterDiv();
    });
    for(i = 0; i < cancelModals.length; i+= 1) {
      cancelModals[i].addEventListener('click', () => {
        playerName.value = "";
      });
    }
  } else {
    introDiv.style.display = "none";
    formDiv.style.display = "block";
  }
}


//get a random number and return the corresponding country/city object pair matching that number in the json list
function getRandomObject() {
  //find a number between 1 and 244
  const randomNum = Math.floor((Math.random() * 244) + 1);
  for(i = 0; i < listJSON.length; i += 1) {
    const objectNum = listJSON[i].SNo;
    if(randomNum === objectNum) {
      console.log(listJSON[i]);
      return listJSON[i];
    }
  }
}

function appendCountryName(countryObject) {
  countryName.textContent = countryObject.Country;
}

function countryUlData(countryObject) {
  countryUl.firstElementChild.innerHTML = "<strong>Country:</strong> " + countryObject.Country;
  countryUl.firstElementChild.nextElementSibling.innerHTML = "<strong>Capital City:</strong> " + countryObject["Capital City"];
  if(countryObject.Notes !== "") {
    countryUl.lastElementChild.innerHTML = "<strong>Notes:</strong> " + countryObject.Notes;
    countryUl.lastElementChild.style.display = "";
  } else {
    countryUl.lastElementChild.style.display = "none";
  }
}

//Use AJAX to get the country/city values from the JSON file
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      listJSON = JSON.parse(xhr.responseText);
      // for (let i = 0; i < listJSON.length; i += 1) {
      //   constlistJSON[0].Country;
      //   }
      countryObject = getRandomObject();
      appendCountryName(countryObject);
      countryUlData(countryObject);

    } else if (xhr.status === 404) {
        //file not found
        console.log("error: file not found")
        alert(xhr.statusText);
    } else {
        //server had a problem
        console.log("error: server had a problem")
        alert(xhr.statusText);
    }
  }
};
xhr.open('GET', 'https://raw.githubusercontent.com/Dannaroo/capital-city-quiz/gh-pages/country-city-list.json');
// xhr.open('GET', 'country-city-list.json');
xhr.send();

if(supportsLocalStorage) {
  playerCount = JSON.parse(localStorage.getItem('playerData'));
  if(playerCount) {
    existingPlayer();
  }
}

startButton.addEventListener('click', (event) => {
  event.preventDefault();
  if(playerName.value === "" && !playerCount) {
    nameErrorMessage.style.display = "";
    return;
  }
  if(supportsLocalStorage) {
    playerCount = getExistingLocalData(playerName.value);
    resetPlayerData();
    updateCounterDiv();



  }// supports Local Storage
});

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  let userResponse = cityNameInput.value.toUpperCase();
  console.log(userResponse);
  console.log(countryObject["Capital City"]);
  let correctCity = countryObject["Capital City"]
  //check if the correct city has ' (' in the name and remove if it does.
  if(correctCity.indexOf(' (') != -1) {
    const slicedNameIndex = correctCity.indexOf(' (');
    const slicedName = correctCity.slice(0, slicedNameIndex);
    correctCity = slicedName;
    console.log(slicedName);
  }
  if(userResponse === "") {
    errorMessage.textContent = "Please enter a city name."
    errorMessage.style.display = "";
  } else if(userResponse === correctCity.toUpperCase()) {
    formDiv.style.display = "none";
    resultDiv.style.display = "";
    resultDivText.textContent = "Correct!"
    resultDiv.className = "resultDivSuccess text-center m-5 p-4";
    playerCount.correct += 1;
    updateLocalStorage(playerCount);
    updateCounterDiv();
  } else {
    formDiv.style.display = "none";
    resultDiv.style.display = "";
    resultDivText.textContent = "Sorry, the correct answer is: " + countryObject["Capital City"];
    resultDiv.className = "resultDivFailure text-center m-5 p-4";
    playerCount.incorrect += 1;
    updateLocalStorage(playerCount);
    updateCounterDiv();
  }
});

playAgainButton.addEventListener('click', (event) => {
  event.preventDefault();
  resultDiv.style.display = "none";
  countryObject = getRandomObject();
  appendCountryName(countryObject);
  countryUlData(countryObject);
  formDiv.style.display = "";
  cityNameInput.value = "";

});
