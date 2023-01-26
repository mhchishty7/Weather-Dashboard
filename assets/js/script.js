const apiKey = '3342e4745295061922728d788155c0e5'
const limit = 5

const searchBtn = document.querySelector('.search-btn')
const cardWrapperEl = document.querySelector('.card-wrapper')
const currentWeatherWrapperEl = document.querySelector(
	'.currentWeather-wrapper'
)
const historyEl = document.querySelector('.search-wrapper')
const cityEl = document.querySelector('.city')
var stateVar

// function to fetch the lon and lat coordinates
var inputEl = document.querySelector('.search-input')
function fetchCityData(event) {
	event.preventDefault()
	var inputValue = inputEl.value
	saveSearch(inputValue)
	var geoCodingURL = `https://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=${limit}&units=imperial&appid=${apiKey}`
	fetch(geoCodingURL)
		.then((res) => {
			return res.json()
		})
		.then((data) => {
			stateVar = data[0].state
			fetchCurrentWeather(data[0])
			fetchWeatherData(data[0])
		})
		.catch((err) => {
			console.log(err)
		})
	inputEl.value = ''
}

// function to fetch the city's weather data based on coordinate parameters
function fetchWeatherData(coordinates) {
	var { lat } = coordinates
	var { lon } = coordinates
	var baseURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat.toFixed(
		2
	)}&lon=${lon.toFixed(2)}&appid=${apiKey}`
	fetch(baseURL)
		.then((res) => {
			return res.json()
		})
		.then((weatherData) => {
			console.log(weatherData)
			return populateCards(weatherData)
		})
}

function populateCards(weatherData) {
	cardWrapperEl.innerHTML = ''
	// create weather cards and populate them with class attributes
	// for loop for each of the five days of the forecast
	cityEl.innerHTML = `${weatherData.city.name}, ${stateVar}`
	for (let i = 0; i < weatherData.list.length; i += 8) {
		// create elements
		const cardArticleEl = document.createElement('article')
		const cardh3El = document.createElement('h3')
		const iconEl = document.createElement('img')
		const tempEl = document.createElement('p')
		const windEl = document.createElement('p')
		const humidityEl = document.createElement('p')

		// set attributes
		cardArticleEl.setAttribute('class', 'singleWeatherCard')
		cardh3El.setAttribute('class', 'card-date')
		iconEl.setAttribute('class', 'icon')
		tempEl.setAttribute('class', 'temperature')
		iconEl.setAttribute(
			'src',
			'https://openweathermap.org/img/w/' +
				weatherData.list[i].weather[0].icon +
				'.png'
		)

		windEl.setAttribute('class', 'wind')
		humidityEl.setAttribute('class', 'humidity')

		// set inner HTML
		cardh3El.textContent = weatherData.list[i]['dt_txt'].substring(0, 10)
		tempEl.textContent =
			'Temp: ' + convertTemp(weatherData.list[i].main.temp) + '°F'
		windEl.textContent = 'Wind: ' + weatherData.list[i].wind.speed + ' MPH'
		humidityEl.textContent =
			'Humidity: ' + weatherData.list[i].main.humidity + '%'

		// append children to parent el
		cardArticleEl.appendChild(cardh3El)
		cardArticleEl.appendChild(iconEl)
		cardArticleEl.appendChild(tempEl)
		cardArticleEl.appendChild(windEl)
		cardArticleEl.appendChild(humidityEl)
		cardWrapperEl.appendChild(cardArticleEl)
	}
}

// function to save past searched cities to localStorage
var citiesList = []
function saveSearch(city) {
	const searchQueryObj = { name: city }
	var historyListEl = document.createElement('button')
	historyListEl.setAttribute('class', 'historyList')
	var historyValue = JSON.parse(localStorage.getItem('cities'))
	if (!citiesList.includes(city)) {
		citiesList.push(searchQueryObj)
		localStorage.setItem('cities', JSON.stringify(citiesList))

		citiesList.map((cityItem) => {
			historyListEl.textContent = cityItem.name
			historyListEl.addEventListener('click', () => {
				cardWrapperEl.innerHTML = ''
				handleSearchClick(cityItem.name)
			})
			historyEl.appendChild(historyListEl)
		})
	}
}

// function to fetch current weather data
const fetchCurrentWeather = (coordinates) => {
	var { lat } = coordinates
	var { lon } = coordinates
	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			displayCurrentWeather(data)
			console.log('fetchCurrentWeather: ' + data)
		})
		.catch((err) => console.error(err))
}

// function to display the current weather data to <article></article>
const displayCurrentWeather = (currentWeather) => {
	currentWeatherWrapperEl.innerHTML = ''
	// current weather article
	const currentCityEl = document.querySelector('.current-city')
	currentCityEl.innerHTML = `${currentWeather.name}, ${stateVar}`

	// create elements
	const cardArticleEl = document.createElement('article')
	const cardh3El = document.createElement('h3')
	const iconEl = document.createElement('img')
	const tempEl = document.createElement('p')
	const windEl = document.createElement('p')
	const humidityEl = document.createElement('p')

	// set attributes
	cardArticleEl.setAttribute('class', 'currentWeatherCard')
	cardh3El.setAttribute('class', 'card-date')
	iconEl.setAttribute('class', 'current-icon')
	tempEl.setAttribute('class', 'temperature')
	iconEl.setAttribute(
		'src',
		'https://openweathermap.org/img/w/' +
			currentWeather.weather[0].icon +
			'.png'
	)

	windEl.setAttribute('class', 'wind')
	humidityEl.setAttribute('class', 'humidity')

	// set inner HTML
	cardh3El.textContent = ''
	tempEl.textContent = 'Temp: ' + convertTemp(currentWeather.main.temp) + '°F'
	windEl.textContent = 'Wind: ' + currentWeather.wind.speed + ' MPH'
	humidityEl.textContent = 'Humidity: ' + currentWeather.main.humidity + '%'

	// append children to parent el
	cardArticleEl.appendChild(cardh3El)
	cardArticleEl.appendChild(iconEl)
	cardArticleEl.appendChild(tempEl)
	cardArticleEl.appendChild(windEl)
	cardArticleEl.appendChild(humidityEl)
	currentWeatherWrapperEl.appendChild(cardArticleEl)
}

function handleSearchClick(cityListEl) {
	cardWrapperEl.innerHTML = ''
	var apiCall = `https://api.openweathermap.org/geo/1.0/direct?q=${cityListEl}&limit=${limit}&units=imperial&appid=${apiKey}`
	fetch(apiCall)
		.then((res) => {
			return res.json()
		})
		.then((data) => {
			stateVar = data[0].state
			fetchCurrentWeather(data[0])

			fetchWeatherData(data[0])
		})
		.catch((err) => {
			console.log(err)
		})
	inputEl.value = ''
}
function convertTemp(value) {
	const faren = (value - 273.15) * (9 / 5) + 32
	return faren.toFixed(2)
}

// search city button event handler
searchBtn.addEventListener('click', fetchCityData)
