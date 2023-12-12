var searchBtn = document.getElementById("searchBtn");
var searchText = document.getElementById("searchText");
var parkInfo = document.getElementById("parkInfo");
var modalParkPicker = document.getElementById("modalParkPicker");
var modalContent = document.getElementById("modalContent");
var searchHistory = document.getElementById("searchHistory");
var requestUrl = "https://developer.nps.gov/api/v1/parks?limit=500&api_key=";

var apiKey = "Y4jn9Z8wuXTpAzOWaleVwq7CizZECJdzBZfX1a2Y";
var parkData = "";
var parkArray = [];
var myHeaders = new Headers();
myHeaders.append("X-eBirdApiToken", "144remuqd7dn");

function searchBirds(lat, lng) {
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
    dist: 25,
    back: "1",
    sort: "species",
  };
  fetch(
    "https://api.ebird.org/v2/data/obs/geo/recent?" +
      "lat=" +
      lat +
      "&lng=" +
      lng,
    requestOptions
  )
    .then((response) => response.text())
    .then(function (result) {
      console.log(JSON.parse(result));
    })
    .catch((error) => console.log("error", error));
}
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

function pickPark(pickedPark) {
  for (let i = 0; i < parkArray.length; i++) {
    if (pickedPark == parkArray[i].parkName) {
      var parkLatitude = parkData.data[parkArray[i].parkArrayIndex].latitude;
      var parkLongitude = parkData.data[parkArray[i].parkArrayIndex].longitude;
      searchBirds(parkLatitude, parkLongitude);
    }
  }
  renderHistory();
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
    addSearchHistory(e.target.textContent);
    if (document.location.pathname == "/index.html") {
      document.location = "./results.html";
    }

    pickPark(e.target.textContent.toLowerCase());
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

function renderHistory() {
  while (searchHistory.firstChild) {
    searchHistory.removeChild(searchHistory.firstChild);
  }

  for (
    let i = localStorage.length - 1;
    i > -1;
    //i needs to be greater than -1 or greater than localStorage.length -1
    i--
  ) {
    var historyBtn = document.createElement("button");
    historyBtn.textContent = localStorage[i];
    historyBtn.classList.add(
      "button",
      "is-large",
      "tile",
      "is-child",
      "history",
      "is-size-7"
    );
    searchHistory.appendChild(historyBtn);
  }
}

if (document.location.pathname == "/results.html") {
  renderHistory();
  if (localStorage.length > 0) {
    console.log(localStorage.getItem(localStorage.length - 1).toLowerCase());
    searchPark(localStorage.getItem(localStorage.length - 1).toLowerCase());
  }
}

searchHistory.addEventListener("click", function (e) {
  e.preventDefault();
  if (!e.target.classList.contains("history")) {
    return;
  }
  var clickedBtn = e.target.textContent;
  searchPark(clickedBtn);
});
