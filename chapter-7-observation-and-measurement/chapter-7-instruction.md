# Chapter 7 - Observation and Measurement
This chapter demonstrate basic logging to a database. You are encourge to extend and bring in a proper logging framework, such as pino. 
See: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/

## 1st Example - Logging to DB
### Execution Instruction - 1. Logging History
``` sh
$ node weather-7-logging-1-history.js 
```
### It splits into 2 database now. Creates two DBs: "weather-users.db" and "weather-requests.db"
```
## weather-requests.db ##
{"username":"joe","latitude":"40.7128","longitude":"-74.0060","days":3,"timestamp":"2025-06-07T20:23:03.359Z","_id":"dAQaMbX1tJZZlzn3"}
```
### Result - 1. Logging History
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
```

## 2nd Example, Adding history
### Execution Instruction - 2. History without Default City
``` sh
$ node weather-7-logging-2-no-default.js
```
### Result - 2. History without Default City
```
Do you want to (1) Register or (2) Login? 2
Enter your username: joe
Enter your password: 12345
Login successful!

Your request history:
1. Lat: 40.7128, Lon: -74.0060, Days: 3 (Requested on: 2025-06-07T20:23:03.359Z)
Select a previous request (enter number) or press Enter to enter a new location: 1
Using past request: Lat 40.7128, Lon -74.0060, Days 3

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
```

## 3rd example, adding a default city
### Execution Instruction - 3. Default City as Choice 0
``` sh
$ node weather-7-logging-3-default-city-as-choice-0.js
```
### Result - 3. Default City as Choice 0
```
Do you want to (1) Register or (2) Login? 2
Enter your username: joe
Enter your password: 12345
Login successful!

Your request history:
0. Use your default city: Dallas (Lat: 39.7456, Lon: -97.0892)
Select a previous request (enter number) or press Enter to enter a new location: 0

Hello, joe! Here is your weather forecast:

This Afternoon:
Temperature: 80°F
Forecast: Mostly Sunny

Tonight:
Temperature: 59°F
Forecast: Mostly Clear

Sunday:
Temperature: 77°F
Forecast: Mostly Sunny then Slight Chance Showers And Thunderstorms

Do you want to set/update your home city? (y/n): n
```

## 4th example, change to use weather-history.db instead of weather-requests.db for naming clarity 
### Execution Instruction - 4. Use "weather-history.db" instead of "weather-requests.db" for persistence 
``` sh
$ node weather-7-logging-3-default-city-as-choice-0.js
```
### Result - 4. Use "weather-history.db" instead of "weather-requests.db" for persistence
```
Do you want to (1) Register or (2) Login? 2
Enter your username: joe
Enter your password: 12345
Login successful!

Your request history:
1. San Francisco (Lat: 37.7749, Lon: -122.4194, Days: 3, Date: 2025-06-07T20:51:32.181Z)
2. San Francisco (Lat: 37.7749, Lon: -122.4194, Days: 3, Date: 2025-03-21T20:02:51.363Z)
Select a previous request (enter number) or press Enter to enter a new location: 1

Hello, joe! Here is your weather forecast:

This Afternoon:
Temperature: 68°F
Forecast: Sunny

Tonight:
Temperature: 54°F
Forecast: Mostly Cloudy

Sunday:
Temperature: 66°F
Forecast: Mostly Sunny

Do you want to set/update your home city? (y/n): y
Enter your home city name: chicago
Enter latitude for chicago: 41.8781
Enter longitude for chicago: -87.6298
Home city updated successfully!
```