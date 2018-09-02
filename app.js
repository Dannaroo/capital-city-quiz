const countryName = document.querySelector('#country-name');
const cityNameInput = document.querySelector('#city-name-input');
const submitButton = document.querySelector('#submitButton');
let listJSON = [];
const errorMessage = document.querySelector('#errorMessage');
let countryObject = {};

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
    // xhr.open('GET', 'https://raw.githubusercontent.com/Dannaroo/capital-city-quiz/gh-pages/country-city-list.json');
    xhr.open('GET', 'country-city-list.json');
    xhr.send();

    submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      let userResponse = cityNameInput.value;
      if(userResponse === "") {
        errorMessage.textContent = "Please enter a city name."
        errorMessage.style.display = "";
      } else if(userResponse = countryObject["Capital City"]) {
        errorMessage.style.display = "";
        errorMessage.textContent = "Correct!"
      } else {
        errorMessage.style.display = "";
        errorMessage.textContent = "Sorry, the correct answer is: " + countryObject["Capital City"];
      }
    });
