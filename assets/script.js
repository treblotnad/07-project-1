var searchBtn = document.getElementById("searchBtn");
var searchText = document.getElementById("search-input");
var modalParkPicker = document.getElementById("modalParkPicker");
var modalContent = document.getElementById("modalContent");
var requestUrl = "https://developer.nps.gov/api/v1/parks?limit=500&api_key=";

var apiKey = "Y4jn9Z8wuXTpAzOWaleVwq7CizZECJdzBZfX1a2Y";
var parkData = "";
var parkArray = [];

function searchPark(parkName) {
  parkArray = [];
  fetch(requestUrl + apiKey)
    .then(function (response) {
      if (!response.ok) throw new Error(response.text);
      return response.json();
    })
    .then(function (data) {
      filterParks(data, parkName);
    });
}

function filterParks(data, parkName) {
  var parkCount = 0;

  for (let i = 0; i < data.data.length; i++) {
    if (data.data[i].fullName.toLowerCase().includes(parkName)) {
      var parkIndex = i;
      parkArray[parkCount] = {
        parkName: data.data[i].fullName.toLowerCase(),
        parkCountIndex: parkCount,
        parkArrayIndex: parkIndex,
      };
      parkCount++;
    }
    // console.log(data.data[1]);
  }
  parkData = data;
  openModal();
  createModalButtons(parkArray);
}

function openModal() {
  modalParkPicker.classList.add("is-active");
}

function closeModal() {
  modalParkPicker.classList.remove("is-active");
}

function createModalButtons(parkArray) {
  modalContent.textContent = "";
  if (parkArray.length == 0) {
    var parkBtn = document.createElement("button");
    parkBtn.classList.add(
      "button",
      "is-fullwidth",
      "is-size-5",
      "has-text-black",
      "m-1"
    );
    parkBtn.textContent = "No park was found, please try again";
    modalContent.appendChild(parkBtn);
  }
  for (let i = 0; i < parkArray.length; i++) {
    var parkBtn = document.createElement("button");
    parkBtn.classList.add(
      "button",
      "is-fullwidth",
      "is-size-5",
      "has-text-black",
      "m-1"
    );
    parkBtn.textContent = parkArray[i].parkName;
    modalContent.appendChild(parkBtn);
  }
}

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (searchText.value.length < 3) {
    return;
  }
  console.log(searchText.value.toLowerCase());
  searchPark(searchText.value.toLowerCase());
});

modalContent.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("button")) {
    closeModal();
    if (e.target.textContent == "No park was found, please try again") {
      return;
    }
    localStorage.clear();
    addSearchHistory(e.target.textContent);

    document.location = "./results.html";
  }
});

function addSearchHistory(parkSearched) {
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.getItem(i) == parkSearched) {
      return;
    }
  }

  localStorage.setItem(localStorage.length, parkSearched);
}
