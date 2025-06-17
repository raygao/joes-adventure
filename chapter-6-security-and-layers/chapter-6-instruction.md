# Chapter 6 - Security and Layers
This chapter demonstrate persistence. It uses a modified @seald-io/nedbdb for persistence.

## First Example, showing basic security
### Execution Instruction - Basic Security
``` sh
$ node weather-6-security.js
```
### Result - Basic Security
```
Do you want to (1) Register or (2) Login? 1
Enter a username: joe
Enter a password: 12345
Hashed password is: $2b$10$2tgh5GrwsbMJ5RQr7BYzQ.UT0t.lXNTOWePoMnJ3y6hf5zXPjyu4e
Registration successful! You can now log in.
Please try the app now ...
Enter your latitude: 41.8781
Enter your longitude: -87.6298
How many days of forecast do you want? 3

Hello, joe! Here is your weather forecast:

This Afternoon:
Temperature: 70°F
Forecast: Haze

Tonight:
Temperature: 58°F
Forecast: Rain Showers

Sunday:
Temperature: 70°F
Forecast: Isolated Rain Showers then Scattered Showers And Thunderstorms
```

## Second example, having a default city
### Execution Instruction - Security and Default City
``` sh
$ node weather-6-security-and-default-city.js
```
### Result - Security and Default City
```
Do you want to (1) Register or (2) Login? 2
Enter your username: joe
Enter your password: 12345
Login successful!
Enter your latitude: 40.7128
Enter your longitude: -74.0060
How many days of forecast do you want? 3

Hello, joe! Here is your weather forecast:

This Afternoon:
Temperature: 76°F
Forecast: Showers And Thunderstorms

Tonight:
Temperature: 66°F
Forecast: Chance Showers And Thunderstorms then Mostly Cloudy

Sunday:
Temperature: 76°F
Forecast: Mostly Cloudy then Slight Chance Light Rain

Do you want to update your default city? (y/n): y
Enter your default city: New York City
Default city updated successfully!
```

## Third example, check for invalid GPS coordinate
### Execution Instruction - Alt and Security (Throw error when non-numerical GPS coordinates are entered)
``` sh
$ node weather-6-alt-security.js
```
### Result - Alt Security
``` console
Do you want to (1) Register or (2) Login? 2
Enter your username: joe
Enter your password: 12345
Login successful!
Enter your latitude: dd
Enter your longitude: ff
How many days of forecast do you want? 3
An error occurred: Error: Invalid latitude, longitude, or days.
    at fetchWeather (/Volumes/2TB-NVME/home/raymondgao/Desktop/joes code/code/chapter-6-security-and-preferences/weather-2-alt-security.js:66:15)
    at main (/Volumes/2TB-NVME/home/raymondgao/Desktop/joes code/code/chapter-6-security-and-preferences/weather-2-alt-security.js:124:32)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
```

## Fourth example, catching HTTP 404 error code.
### Execution Instruction - Alt 404 and Security (When an invalid city GPS coordinates results in 404 HTTP code from NOAA)
``` sh
$ node weather-6-alt-404-security.js
```
### Result - Alt Security
```
Do you want to (1) Register or (2) Login? 2
Enter your username: joe
Enter your password: 12345
Login successful!
Enter your latitude: 33.33
Enter your longitude: 44.44
How many days of forecast do you want? 3
Error fetching weather data: Location not found. Please check your latitude and longitude.
An error occurred: Location not found. Please check your latitude and longitude.
```