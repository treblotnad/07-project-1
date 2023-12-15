var searchBtn = document.getElementById("searchBtn");
var searchText = document.getElementById("search-input");
var parkInfo = document.getElementById("parkInfo");
var modalParkPicker = document.getElementById("modalParkPicker");
var modalContent = document.getElementById("modalContent");
var searchHistory = document.getElementById("searchHistory");
var clearHistoryBtn = document.getElementById("clearHistory");
var birdCards = document.getElementById("birdCards");
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
      renderBirds(JSON.parse(result));
    })
    .catch((error) => console.log("error", error));
}
function searchPark(parkName, firstTime = false) {
  parkArray = [];
  fetch(requestUrl + apiKey)
    .then(function (response) {
      if (!response.ok) throw new Error(response.text);
      return response.json();
    })
    .then(function (data) {
      filterParks(data, parkName, firstTime);
    });
}

function filterParks(data, parkName, firstTime) {
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
  if (!firstTime) {
    openModal();
    createModalButtons(parkArray);
  } else {
    pickPark(parkName);
  }
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
      var parkWeb = parkData.data[parkArray[i].parkArrayIndex].url;
      var parkImage = parkData.data[parkArray[i].parkArrayIndex].images[0].url;
      var title = parkData.data[parkArray[i].parkArrayIndex].images[0].title;
      var credit = parkData.data[parkArray[i].parkArrayIndex].images[0].credit;
      var parkDescription =
        parkData.data[parkArray[i].parkArrayIndex].description;
      var parkEmail =
        parkData.data[parkArray[i].parkArrayIndex].contacts.emailAddresses[0]
          .emailAddress;
      searchBirds(parkLatitude, parkLongitude);
      console.log(parkData.data[parkArray[i].parkArrayIndex]);
      console.log(
        parkData.data[parkArray[i].parkArrayIndex].contacts.emailAddresses[0]
          .emailAddress
      );
      hero(
        pickedPark,
        parkWeb,
        parkImage,
        title,
        credit,
        parkDescription,
        parkEmail
      );
    }
  }
  renderHistory();
}

var heroParkName = document.getElementById("fullName");
var heroParkImage = document.getElementById("parkImage");
var parkLink = document.getElementById("parkLink");
var imageTitle = document.getElementById("imageTitle");
var imagesCredit = document.getElementById("credit");
var description = document.getElementById("descriptionOfPark");
var parkInfo = document.getElementById("parkInfo");

function hero(
  parkName,
  parkWeb,
  parkImage,
  title,
  credit,
  parkDescription,
  parkEmail
) {
  heroParkName.textContent = parkName.toUpperCase();
  parkLink.setAttribute("href", parkWeb);
  parkLink.setAttribute("target", "_blank");
  heroParkImage.style.backgroundImage = `url(${parkImage})`;
  heroParkImage.style.backgroundSize = "cover";
  heroParkImage.style.backgroundRepeat = "no-repeat";
  imageTitle.textContent = title;
  imagesCredit.textContent = "Photo by:" + credit;
  description.textContent = parkDescription;
  parkInfo.textContent = "Email us @:" + parkEmail;
  parkInfo.setAttribute("href", "mailto:" + parkEmail);
  // park hours
  // park
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

searchHistory.addEventListener("click", function (e) {
  e.preventDefault();
  if (!e.target.classList.contains("history")) {
    return;
  }
  var clickedBtn = e.target.textContent;
  searchPark(clickedBtn);
});

clearHistoryBtn.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.clear();
  renderHistory();
});

function renderBirds(birdArray) {
  while (birdCards.firstChild) {
    birdCards.removeChild(birdCards.firstChild);
  }
  var birdNum = birdArray.length;
  var birdDisplayCount = 24;
  var birdIndex = 0;
  if (birdNum < 24) {
    birdDisplayCount = birdNum;
  }

  for (let i = 0; i < birdDisplayCount; i++) {
    var cardBank = document.createElement("div");
    for (let j = 0; j < 3; j++) {
      var comName = birdArray[birdIndex].comName;
      var locationSeen = birdArray[birdIndex].locName;
      var obsDate = birdArray[birdIndex].obsDt;
      var sciName = birdArray[birdIndex].sciName;
      var birdCount = birdArray[birdIndex].howMany;

      var cardToAdd = document.createElement("a");
      var cardContent = document.createElement("div");
      var mediaContent = document.createElement("div");
      var nameContent = document.createElement("p");
      var obsDateContent = document.createElement("p");
      var sciNameContent = document.createElement("p");

      cardBank.classList.add("columns", "is-centered", "mb-3");
      cardToAdd.classList.add("card", "column", "is-4");
      cardContent.classList.add("card-content");
      mediaContent.classList.add("media-content");
      nameContent.classList.add("title", "is-4");
      sciNameContent.classList.add("subtitle", "is-6");
      obsDateContent.classList.add("content");
      cardToAdd.setAttribute(
        "href",
        "https://www.google.com/search?tbm=isch&q=" + comName
      );
      cardToAdd.setAttribute("target", "_blank");

      nameContent.textContent = comName;
      sciNameContent.textContent = sciName;
      obsDateContent.textContent =
        birdCount + " last Seen: " + obsDate + " at " + locationSeen;

      cardBank.appendChild(cardToAdd);
      cardToAdd.appendChild(cardContent);
      cardContent.appendChild(mediaContent);
      mediaContent.appendChild(nameContent);
      mediaContent.appendChild(sciNameContent);
      mediaContent.appendChild(obsDateContent);

      if (birdIndex == birdDisplayCount - 1) {
        break;
      }
      birdIndex++;
    }
    i = i + 2;
    birdCards.appendChild(cardBank);
  }
}

if (localStorage.length > 0) {
  renderHistory();
  searchPark(localStorage.getItem(localStorage.length - 1).toLowerCase(), true);
}
