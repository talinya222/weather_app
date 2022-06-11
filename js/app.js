(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    let apiKey = "98a6dfc4cfd0678e6de2a9776e4559f9";
    let weatherAppBody = document.querySelector(".wrapper");
    function showCoords(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        axios.get(apiUrl).then(showWeather);
    }
    if (weatherAppBody) navigator.geolocation.getCurrentPosition(showCoords);
    window.addEventListener("load", (function() {
        document.body.insertAdjacentHTML("afterbegin", `\t<div class="preloader">\n\t\t\t\t<div class="preloader__row">\n\t\t\t\t\t<div class="preloader__item"></div>\n\t\t\t\t\t<div class="preloader__item"></div>\n\t\t\t\t</div>\n\t\t\t</div>`);
        let preloader = document.querySelector(".preloader");
        preloader.classList.add("loaded_hiding");
        setTimeout((function() {
            document.documentElement.classList.add("loaded");
            preloader.classList.remove("loaded_hiding");
        }), 3e3);
    }));
    let userCity = document.querySelector(".form-header__input");
    function showWeather(response) {
        console.log(response);
        let currentTown = document.querySelector(".header__current-town");
        currentTown.innerHTML = response.data.name;
        let weatherDescription = document.querySelector(".main-block__text");
        weatherDescription.innerHTML = response.data.weather[0].description;
        let temperature = response.data.main.temp;
        let temperatureFeels = response.data.main.feels_like;
        tempValue.innerHTML = Math.round(temperature);
        tempValueFeels.innerHTML = Math.round(temperatureFeels);
        let sunrise = document.querySelector("._icon-sunrise");
        let unix_sunrise = response.data.sys.sunrise;
        var dateSunrise = new Date(1e3 * unix_sunrise);
        let hoursSunrise = dateSunrise.getHours();
        let minutesSunrise = "0" + dateSunrise.getMinutes();
        let formattedSunriseTime = hoursSunrise + ":" + minutesSunrise.substr(-2);
        sunrise.innerHTML = `sunrise ${formattedSunriseTime}`;
        let sunset = document.querySelector("._icon-sunset");
        let unix_sunset = response.data.sys.sunset;
        var dateSunset = new Date(1e3 * unix_sunset);
        let hoursSunset = dateSunset.getHours();
        let minutesSunset = "0" + dateSunset.getMinutes();
        let formattedSunsetTime = hoursSunset + ":" + minutesSunset.substr(-2);
        sunset.innerHTML = `sunset ${formattedSunsetTime}`;
        let humidity = document.querySelector("._icon-humidity");
        humidity.innerHTML = `humidity ${response.data.main.humidity}%`;
        let windSpeed = document.querySelector("._icon-wind");
        windSpeed.innerHTML = `${Math.round(response.data.wind.speed)} m/s`;
        let windDirection = document.querySelector("._icon-wind-direction");
        let compassSector = [ "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N" ];
        windDirection.innerHTML = compassSector[(response.data.wind.deg / 22.5).toFixed(0)];
        let pressure = document.querySelector("._icon-pressure");
        pressure.innerHTML = `${response.data.main.pressure} hPa`;
    }
    function showCity(event) {
        event.preventDefault();
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userCity.value}&appid=${apiKey}&units=metric`;
        axios.get(apiUrl).then(showWeather);
        let cityName = userCity.value.charAt(0).toUpperCase() + userCity.value.slice(1);
        let currentTown = document.querySelector(".header__current-town");
        currentTown.innerHTML = cityName;
        userCity.value = "";
    }
    let searchIcon = document.querySelector(".form-header__search-button");
    searchIcon.addEventListener("click", showCity, showWeather);
    let temp = document.querySelector(".main-block__actual-temperature");
    let tempValue = document.querySelector(".main-block__temp-value");
    let tempValueFeels = document.querySelector(".main-block__temp-feels");
    function changeTemp(event) {
        if (event.target.closest("button.main-block__fahrenheit")) {
            tempValue.innerHTML = Math.round(1.8 * tempValue.innerHTML + 32);
            tempValueFeels.innerHTML = Math.round(1.8 * tempValueFeels.innerHTML + 32);
            temp.classList.add("_temp");
            event.preventDefault();
        } else if (event.target.closest("button.main-block__celsium")) {
            tempValue.innerHTML = Math.round((tempValue.innerHTML - 32) / 1.8);
            tempValueFeels.innerHTML = Math.round((tempValueFeels.innerHTML - 32) / 1.8);
            temp.classList.remove("_temp");
            event.preventDefault();
        }
    }
    document.addEventListener("click", changeTemp);
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    const weekdays = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    let date = new Date;
    const currentMonth = document.querySelector(".main-block__current-date");
    const currentWeekday = document.querySelector(".main-block__current-weekday");
    currentMonth.innerHTML = months[date.getMonth()] + " " + date.getDate();
    currentWeekday.innerHTML = weekdays[date.getDay()];
    let allWeekdays = document.querySelectorAll(".item-footer__weekday");
    if (allWeekdays) for (let j = 0; j < weekdays.length; j++) {
        let textFull = weekdays[date.getDay() - j];
        let textMobile;
        function getText() {
            if (innerWidth <= 960) {
                textMobile = weekdays[date.getDay() - j].slice(0, 3);
                allWeekdays[j].innerHTML = textMobile;
            } else allWeekdays[j].innerHTML = textFull;
        }
        window.addEventListener("resize", getText);
    }
    let footerCards = document.querySelectorAll(".item-footer");
    if (footerCards) {
        function moveCards() {
            if (innerWidth <= 767.98) {
                footerCards[0].style.display = "none";
                footerCards[1].style.display = "none";
            } else {
                footerCards[0].style.display = "block";
                footerCards[1].style.display = "block";
            }
        }
        window.addEventListener("resize", moveCards);
        function moveAnotherCards() {
            if (innerWidth <= 479.98) {
                footerCards[2].style.display = "none";
                footerCards[3].style.display = "none";
            } else {
                footerCards[2].style.display = "block";
                footerCards[3].style.display = "block";
            }
        }
        window.addEventListener("resize", moveAnotherCards);
    }
    let myText = currentWeekday.innerHTML;
    let resizeText;
    function getComa() {
        if (innerWidth < 960) {
            resizeText = `${weekdays[date.getDay()]},`;
            currentWeekday.innerHTML = resizeText;
        } else currentWeekday.innerHTML = myText;
    }
    window.addEventListener("resize", getComa);
    window["FLS"] = true;
    isWebp();
    menuInit();
})();