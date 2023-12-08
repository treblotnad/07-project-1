var searchBtn = document.getElementById("searchBtn");
var searchText = document.getElementById("searchText");
var parkInfo = document.getElementById("parkInfo");
var requestUrl = "https://developer.nps.gov/api/v1/parks?limit=500&api_key=";
var apiKey = "apiKeyPark";

var myHeaders = new Headers();
myHeaders.append("X-eBirdApiToken", "apikeyBird");

function searchBirds(lat, lng) {
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
    dist: 25,
    back: 14,
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
  for (let i = 0; i < data.data.length; i++) {
    if (data.data[i].fullName.toLowerCase().includes(parkName)) {
      console.log(data.data[i].fullName);
      var parkIndex = i;
      console.log(parkIndex);
    }
  }
  parkInfo.textContent = data.data[parkIndex].fullName;
  console.log(data.data[parkIndex]);
  var parkLatitude = data.data[parkIndex].latitude;
  var parkLongitude = data.data[parkIndex].longitude;
  searchBirds(parkLatitude, parkLongitude);
}

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (searchText.value.length < 3) {
  }
  searchPark(searchText.value.toLowerCase());
});
