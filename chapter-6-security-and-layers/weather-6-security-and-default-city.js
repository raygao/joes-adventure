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
    const defaultCity = await getUserInput("Enter your default city: ");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password is: " + hashedPassword);

    return new Promise((resolve, reject) => {
        db.findOne({ username }, (err, user) => {
            if (user) {
                console.log("Username already exists. Try logging in.");
                resolve(null);
            } else {
                db.insert({ username, password: hashedPassword, defaultCity }, (err, newDoc) => {
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
                resolve(user); // Return the entire user object
            }
        });
    });
}

async function setDefaultCity(username) {
    const defaultCity = await getUserInput("Enter your default city: ");

    return new Promise((resolve, reject) => {
        db.update({ username }, { $set: { defaultCity } }, {}, (err, numUpdated) => {
            if (err) {
                console.error("Error updating default city:", err);
                reject(err);
            } else {
                console.log("Default city updated successfully!");
                resolve();
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

        // Check for 404 Not Found
        if (response.status === 404) {
            throw new Error("Location not found. Please check your latitude and longitude.");
        }

        // Check for other HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const locationData = await response.json();
        const forecastUrl = locationData.properties.forecast;

        const forecastResponse = await fetch(forecastUrl, { headers: HEADERS });

        // Check for 404 Not Found in the forecast response
        if (forecastResponse.status === 404) {
            throw new Error("Forecast data not found for the given location.");
        }

        // Check for other HTTP errors in the forecast response
        if (!forecastResponse.ok) {
            throw new Error(`HTTP error! Status: ${forecastResponse.status}`);
        }

        const forecastData = await forecastResponse.json();
        return forecastData.properties.periods.slice(0, days);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
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
        let user;
        const action = await getUserInput("Do you want to (1) Register or (2) Login? ");
        if (action === "1") {
            const username = await registerUser();
            if (!username) return;
            user = { username };
        } else if (action === "2") {
            user = await loginUser();
            if (!user) return;
        } else {
            console.log("Invalid choice. Exiting.");
            rl.close();
            return;
        }

        // Check if the user has a default city
        if (user.defaultCity) {
            console.log(`Your default city is set to: ${user.defaultCity}`);
            const useDefaultCity = await getUserInput("Do you want to use your default city for the forecast? (y/n): ");
            if (useDefaultCity.toLowerCase() === "y") {
                // Convert city to latitude and longitude (you can use a geocoding API for this)
                // For now, we'll assume the user enters latitude and longitude manually
                console.log("Please enter the latitude and longitude for your default city.");
            }
        }

        const latitude = await getUserInput("Enter your latitude: ");
        const longitude = await getUserInput("Enter your longitude: ");
        const days = parseInt(await getUserInput("How many days of forecast do you want? "), 10);

        const forecast = await fetchWeather(latitude, longitude, days);
        if (forecast) displayWeather(user.username, forecast);

        // Ask if the user wants to update their default city
        const updateDefaultCity = await getUserInput("Do you want to update your default city? (y/n): ");
        if (updateDefaultCity.toLowerCase() === "y") {
            await setDefaultCity(user.username);
        }
    } catch (error) {
        console.error("An error occurred:", error.message);
    } finally {
        rl.close();
    }
}

main();