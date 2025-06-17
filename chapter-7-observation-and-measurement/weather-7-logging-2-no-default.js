const readline = require("readline");
const bcrypt = require("bcrypt");
const Datastore = require("@seald-io/nedb");

const NOAA_BASE_URL = "https://api.weather.gov/points/";
const HEADERS = {
    "User-Agent": "WeatherApp (your@email.com)"
};

// Databases
const usersDb = new Datastore({ filename: "weather-users.db", autoload: true });
const requestsDb = new Datastore({ filename: "weather-requests.db", autoload: true });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getUserInput(question) {
    return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

// Register a new user
async function registerUser() {
    const username = await getUserInput("Enter a username: ");
    const password = await getUserInput("Enter a password: ");
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
        usersDb.findOne({ username }, (err, user) => {
            if (user) {
                console.log("Username already exists. Try logging in.");
                resolve(null);
            } else {
                usersDb.insert({ username, password: hashedPassword }, (err, newDoc) => {
                    if (err) {
                        console.error("Error registering user:", err);
                        reject(err);
                    } else {
                        console.log("Registration successful! You can now log in.");
                        resolve(username);
                    }
                });
            }
        });
    });
}

// Login an existing user
async function loginUser() {
    const username = await getUserInput("Enter your username: ");
    const password = await getUserInput("Enter your password: ");

    return new Promise(resolve => {
        usersDb.findOne({ username }, async (err, user) => {
            if (!user || !(await bcrypt.compare(password, user.password))) {
                console.log("Invalid credentials. Please try again.");
                resolve(null);
            } else {
                console.log("Login successful!");
                resolve(user);
            }
        });
    });
}

// Fetch weather forecast from NOAA API
async function fetchWeather(latitude, longitude, days) {
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
        console.error("Error fetching weather data:", error.message);
        throw error;
    }
}

// Save request history
function logRequest(username, latitude, longitude, days) {
    const timestamp = new Date().toISOString();
    requestsDb.insert({ username, latitude, longitude, days, timestamp }, err => {
        if (err) console.error("Error logging request:", err);
    });
}

// Retrieve request history
async function getRequestHistory(username) {
    return new Promise(resolve => {
        requestsDb.find({ username }).sort({ timestamp: -1 }).exec((err, history) => {
            if (err) {
                console.error("Error retrieving history:", err);
                resolve([]);
            } else {
                resolve(history);
            }
        });
    });
}

// Display forecast
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

        // Retrieve request history
        const history = await getRequestHistory(user.username);

        let latitude, longitude, days;
        
        if (history.length > 0) {
            console.log("\nYour request history:");
            history.forEach((req, index) => {
                console.log(`${index + 1}. Lat: ${req.latitude}, Lon: ${req.longitude}, Days: ${req.days} (Requested on: ${req.timestamp})`);
            });

            const useHistory = await getUserInput("Select a previous request (enter number) or press Enter to enter a new location: ");
            if (useHistory && history[parseInt(useHistory) - 1]) {
                const selectedRequest = history[parseInt(useHistory) - 1];
                latitude = selectedRequest.latitude;
                longitude = selectedRequest.longitude;
                days = selectedRequest.days;
                console.log(`Using past request: Lat ${latitude}, Lon ${longitude}, Days ${days}`);
            }
        }

        // If no history selection, ask for new coordinates
        if (!latitude || !longitude || !days) {
            latitude = await getUserInput("Enter your latitude: ");
            longitude = await getUserInput("Enter your longitude: ");
            days = parseInt(await getUserInput("How many days of forecast do you want? "), 10);
        }

        const forecast = await fetchWeather(latitude, longitude, days);
        if (forecast) displayWeather(user.username, forecast);
        
        // Log the request
        logRequest(user.username, latitude, longitude, days);
    } catch (error) {
        console.error("An error occurred:", error.message);
    } finally {
        rl.close();
    }
}

main();
