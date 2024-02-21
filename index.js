// Class 4 Weather App [JS Mini Projects]

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variables need????

let oldTab = userTab;
const API_KEY = "8a8a35761741a7c2495b7e11693e4000";
oldTab.classList.add("current-tab");
getfromSessionStorage();    // jab initially koi app ko load karte hai to ho sakta hai ki hamare session storage mein latitude and longitude present ; to use check karne ke liye function call kiya

function switchTab(newTab) {                          // oldTab = currentTab ; newTab = clickedTab
    if(newTab != oldTab) {                     
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //kya search form wala container is invisible?, then make it visible 
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main pehle search wale tab par tha, abb your weather tab visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagaya hu, toh weather bhi display karna padega, so let's check local storage first
            //for coordinates, if we have saved them there
            getfromSessionStorage();
        }
    }
}


userTab.addEventListener("click", () => {
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if coordinates are alredy present in session storage  
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);   // json.parse() convert json string into json object 
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const{lat, lon} = coordinates;    // lat and lon nikalo coordinates ke andar se
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        // console.log("Error Found", err);

    }
}

function renderWeatherInfo(weatherInfo)  {
    //firstly, we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;  //weather info mein jo name hai use cityName mein store kiya
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;  //read Documentation "Important Things to Know" in JS[Mini projects] in codeHelp
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}

function getLocation() {
    if(navigator.geolocation) {                  // this line is use to check that my browser supports geolocation or not 
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //HW - show an alert for no geolocation support available 
        alert("No geolocation support available");
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "") 
        return;              // city name nahi dala isliye weather data nahi milega
    else{
        fetchSearchWeatherInfo(cityName);
    }    
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //HW
    }
}





















// const API_KEY = "8a8a35761741a7c2495b7e11693e4000";

// function renderWeatherInfo(data) {
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;      //add some text content in newpara

//     document.body.appendChild(newPara);
// }

// async function fetchWeatherDetails() {                 //this function fetch weather data using API
//     try {
//         let city = "goa";

//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

//         const data = await response.json();
//         console.log("weather data:->", data);

//         renderWeatherInfo(data);                       //this function shows details on UI
//     }

//     catch (err) {
//         //handle the error here
//     }
//     //https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric

// }

// async function getCustomWeatherDetails() {

//     try {
//         let latitude = 15.6333;
//         let longitude = 18.3333;

//         let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
//         let data = await result.json();

//         console.log(data);

//     }
//     catch (err) {
//         console.log("Error Found", err);
//     }

// }

// function switchTab(newTab) {

//     apiErrorContainer.classList.remove("active");

//     if (newTab !== oldTab) {
//         oldTab.classList.remove("current-tab");
//         oldTab = newTab;
//         oldTab.classList.add("current-tab");

//         if (!searchForm.classList.contains("active")) {
//             userInfoContainer.classList.remove("active");
//             grantAccessContainer.classList.remove("active");
//             searchForm.classList.add("active");
//         }
//         else {
//             searchForm.classList.remove("active");
//             userInfoContainer.classList.remove("active");
//             //getfromSessionStorage();
//         }

//         // console.log("Current Tab", oldTab);
//     }
// }

// function getLocation() {
//     if (navigator.geolocation) {             // this line is use to check that my browser supports geolocation or not 
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else {
//         console.log("No geolocation Support");
//     }
// }

// function showPosition(position) {
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;

//     console.log(lat);
//     console.log(longi);
// }


// const userTab = document.querySelector("[data-userWeather]");
// const searchTab = document.querySelector("[data-searchWeather]");
// const userContainer = document.querySelector(".weather-container");

// const grantAccessContainer = document.querySelector(".grant-location-container");
// const searchForm = document.querySelector("[data-searchForm]");
// const loadingScreen = document.querySelector(".loading-container");
// const userInfoContainer = document.querySelector(".user-info-container");

// //initially vairables need????

// let oldTab = userTab;
// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
// oldTab.classList.add("current-tab");
// getfromSessionStorage();

// function switchTab(newTab) {
//     if(newTab != oldTab) {
//         oldTab.classList.remove("current-tab");
//         oldTab = newTab;
//         oldTab.classList.add("current-tab");

//         if(!searchForm.classList.contains("active")) {
//             //kya search form wala container is invisible, if yes then make it visible
//             userInfoContainer.classList.remove("active");
//             grantAccessContainer.classList.remove("active");
//             searchForm.classList.add("active");
//         }
//         else {
//             //main pehle search wale tab pr tha, ab your weather tab visible karna h 
//             searchForm.classList.remove("active");
//             userInfoContainer.classList.remove("active");
//             //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
//             //for coordinates, if we haved saved them there.
//             getfromSessionStorage();
//         }
//     }
// }

// userTab.addEventListener("click", () => {
//     //pass clicked tab as input paramter
//     switchTab(userTab);
// });

// searchTab.addEventListener("click", () => {
//     //pass clicked tab as input paramter
//     switchTab(searchTab);
// });

// //check if cordinates are already present in session storage
// function getfromSessionStorage() {
//     const localCoordinates = sessionStorage.getItem("user-coordinates");
//     if(!localCoordinates) {
//         //agar local coordinates nahi mile
//         grantAccessContainer.classList.add("active");
//     }
//     else {
//         const coordinates = JSON.parse(localCoordinates);
//         fetchUserWeatherInfo(coordinates);
//     }

// }

// async function fetchUserWeatherInfo(coordinates) {
//     const {lat, lon} = coordinates;
//     // make grantcontainer invisible
//     grantAccessContainer.classList.remove("active");
//     //make loader visible
//     loadingScreen.classList.add("active");

//     //API CALL
//     try {
//         const response = await fetch(
//             `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
//           );
//         const  data = await response.json();

//         loadingScreen.classList.remove("active");
//         userInfoContainer.classList.add("active");
//         renderWeatherInfo(data);
//     }
//     catch(err) {
//         loadingScreen.classList.remove("active");
//         //HW

//     }

// }

// function renderWeatherInfo(weatherInfo) {
//     //fistly, we have to fethc the elements 

//     const cityName = document.querySelector("[data-cityName]");
//     const countryIcon = document.querySelector("[data-countryIcon]");
//     const desc = document.querySelector("[data-weatherDesc]");
//     const weatherIcon = document.querySelector("[data-weatherIcon]");
//     const temp = document.querySelector("[data-temp]");
//     const windspeed = document.querySelector("[data-windspeed]");
//     const humidity = document.querySelector("[data-humidity]");
//     const cloudiness = document.querySelector("[data-cloudiness]");

//     //fetch values from weatherINfo object and put it UI elements
//     cityName.innerText = weatherInfo?.name;
//     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
//     desc.innerText = weatherInfo?.weather?.[0]?.description;
//     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
//     temp.innerText = weatherInfo?.main?.temp;
//     windspeed.innertext = weatherInfo?.wind?.speed;
//     humidity.innertext = weatherInfo?.main?.humidity;
//     cloudiness.innerText = weatherInfo?.clouds?.all;


// }

// function getLocation() {
//     if(navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else {
//         //HW - show an alert for no gelolocation support available
//     }
// }

// function showPosition(position) {

//     const userCoordinates = {
//         lat: position.coords.latitude,
//         lon: position.coords.longitude,
//     }

//     sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
//     fetchUserWeatherInfo(userCoordinates);

// }

// const grantAccessButton = document.querySelector("[data-grantAccess]");
// grantAccessButton.addEventListener("click", getLocation);

// const searchInput = document.querySelector("[data-searchInput]");

// searchForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     let cityName = searchInput.value;

//     if(cityName === "")
//         return;
//     else 
//         fetchSearchWeatherInfo(cityName);
// })

// async function fetchSearchWeatherInfo(city) {
//     loadingScreen.classList.add("active");
//     userInfoContainer.classList.remove("active");
//     grantAccessContainer.classList.remove("active");

//     try {
//         const response = await fetch(
//             `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
//           );
//         const data = await response.json();
//         loadingScreen.classList.remove("active");
//         userInfoContainer.classList.add("active");
//         renderWeatherInfo(data);
//     }
//     catch(err) {
//         //hW
//     }
// }