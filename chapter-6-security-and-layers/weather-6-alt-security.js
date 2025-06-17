const readline = require("readline");
const bcrypt = require("bcrypt");
const Datastore = require("@seald-io/nedb");

const NOAA_BASE_URL = "https://api.weather.gov/points/";
const HEADERS = {
    "User-Agent": "WeatherApp (your@email.com)"
};

const db = new Datastore({ filename: "weather-users.db", autoload: true });
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getUserInput(question) {
    return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

async function registerUser() {
    const username = await getUserInput("Enter a username: ");
    const password = await getUserInput("Enter a password: ");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password is: " + hashedPassword);

    return new Promise((resolve, reject) => {
        db.findOne({ username }, (err, user) => {
            if (user) {
                console.log("Username already exists. Try logging in.");
                resolve(null);
            } else {
                db.insert({ username, password: hashedPassword }, (err, newDoc) => {
                    if (err) {
                        console.error("Error registering user:", err);
                        reject(err);
                    } else {
                        console.log("Registration successful! You can now log in.");
                        console.log("Please try the app now ...");
                        resolve(username);
                    }
                });
            }
        });
    });
}

async function loginUser() {
    const username = await getUserInput("Enter your username: ");
    const password = await getUserInput("Enter your password: ");

    return new Promise(resolve => {
        db.findOne({ username }, async (err, user) => {
            if (!user || !(await bcrypt.compare(password, user.password))) {
                console.log("Invalid credentials. Please try again.");
                resolve(null);
            } else {
                console.log("Login successful!");
                resolve(username);
            }
        });
    });
}

async function fetchWeather(latitude, longitude, days) {
    if (isNaN(latitude) || isNaN(longitude) || isNaN(days)) {
        throw new Error("Invalid latitude, longitude, or days.");
    }

    try {
        const response = await fetch(`${NOAA_BASE_URL}${latitude},${longitude}`, { headers: HEADERS });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const locationData = await response.json();
        const forecastUrl = locationData.properties.forecast;

        const forecastResponse = await fetch(forecastUrl, { headers: HEADERS });
        if (!forecastResponse.ok) throw new Error(`HTTP error! Status: ${forecastResponse.status}`);

        const forecastData = await forecastResponse.json();
        return forecastData.properties.periods.slice(0, days);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}

function displayWeather(name, forecast) {
    if (!forecast || forecast.length === 0) {
        console.log("No forecast data available.");
        return;
    }

    console.log(`\nHello, ${name}! Here is your weather forecast:\n`);
    forecast.forEach(period => {
        console.log(`${period.name}:`);
        console.log(`Temperature: ${period.temperature}°${period.temperatureUnit}`);
        console.log(`Forecast: ${period.shortForecast}\n`);
    });
}

async function main() {
    try {
        let username;
        const action = await getUserInput("Do you want to (1) Register or (2) Login? ");
        if (action === "1") {
            username = await registerUser();
        } else if (action === "2") {
            username = await loginUser();
        } else {
            console.log("Invalid choice. Exiting.");
            rl.close();
            return;
        }

        if (!username) {
            rl.close();
            return;
        }

        const latitude = await getUserInput("Enter your latitude: ");
        const longitude = await getUserInput("Enter your longitude: ");
        const days = parseInt(await getUserInput("How many days of forecast do you want? "), 10);

        const forecast = await fetchWeather(latitude, longitude, days);
        if (forecast) displayWeather(username, forecast);
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        rl.close();
    }
}

main();