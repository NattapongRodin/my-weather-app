const apiKey = 'cf74a1bcc935d2dcc7fba3bba4c23e00';

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');
const forecastContainer = document.querySelector('#forecast-container');
const body = document.querySelector('body');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityName = cityInput.value.trim();

    if (cityName) {
        getWeather(cityName);
    } else {
        alert('กรุณาป้อนชื่อเมือง');
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        cityInput.value = lastCity; // แสดงในช่อง input ด้วย
        getWeather(lastCity);
        getForecast(lastCity);
 }
});

async function getWeather(city) {
    weatherInfoContainer.innerHTML = `<p>กำลังโหลดข้อมูล...</p>`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('ไม่พบข้อมูลเมืองนี้');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];

    const weatherHtml = `
        <h2>${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p style="font-size: 2rem; font-weight: bold;">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>ความชื้น: ${humidity}%</p>
    `;
    weatherInfoContainer.innerHTML = weatherHtml;
}

function updateBackground(data) {
    const { temp } = data.main;
    const weatherMain = data.weather[0].main.toLowerCase();
    const hour = new Date().getHours();

    if (hour >= 18 || hour < 6) {
        body.style.background = "linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)";
    } else if (weatherMain.includes("rain")) {
        body.style.background = "linear-gradient(135deg, #667db6, #0082c8, #0082c8, #667db6)";
    } else if (temp > 30) {
        body.style.background = "linear-gradient(135deg, #ff512f, #f09819)";
    } else if (temp < 20) {
        body.style.background = "linear-gradient(135deg, #83a4d4, #b6fbff)";
    } else {
        body.style.background = "linear-gradient(135deg, #56ccf2, #2f80ed)";
    }
}

async function getForecast(city) {
    forecastContainer.innerHTML = `<p>⏳ กำลังโหลดพยากรณ์...</p>`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('ไม่พบข้อมูลพยากรณ์');
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        forecastContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayForecast(data) {
    const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);

    let forecastHTML = `<h3>พยากรณ์อากาศ 5 วันข้างหน้า</h3>`;
    forecastHTML += `<div class="forecast-grid">`;

    forecastList.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString("th-TH", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });

        const temp = day.main.temp.toFixed(1);
        const icon = day.weather[0].icon;
        const description = day.weather[0].description;

        forecastHTML += `
          <div class="forecast-day">
            <h4>${date}</h4>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <p>${temp}°C</p>
            <p>${description}</p>
          </div>
        `;
    });

    forecastHTML += `</div>`;
    forecastContainer.innerHTML = forecastHTML;
}