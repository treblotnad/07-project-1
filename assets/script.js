var searchBtn = document.getElementById("searchBtn");
var searchText = document.getElementById("searchText");
var requestUrl = "https://developer.nps.gov/api/v1/parks?limit=500&api_key=";
var apiKey = "";

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
  //   console.log(data.data[465].fullName);
  //   console.log(data.data[465].fullName.toLowerCase().includes(parkName));
  for (let i = 0; i < data.data.length; i++) {
  // console.log(data.data[i].fullName);
    // console.log(parkName);
    if (data.data[i].fullName.toLowerCase().includes(parkName)) {
      console.log(data.data[i].fullName);
      var parkIndex = i;
      console.log(parkIndex);
    }
  }
  //   console.log(parkIndex);
  //   console.log(data.data[parkIndex].fullName);
  //   return parkIndex;
}

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  searchPark(searchText.value);
});
