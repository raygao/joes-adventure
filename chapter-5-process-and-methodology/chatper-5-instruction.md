# Chapter 5 - Process and Methodology

- First Example, Getting user’s name, desired location and desired length of forecast 
  
## Execution Instruction - Example 1 
``` sh
node weather-5-interact.js
```

### Result - Example 1
```
Enter your name: Joe
Enter your latitude: 39.7456
Enter your longitude: -97.0892
How many days of forecast do you want? 3

Hello, Joe! Here is your weather forecast:

This Afternoon:
Temperature: 80°F
Forecast: Mostly Sunny

Tonight:
Temperature: 59°F
Forecast: Mostly Clear

Sunday:
Temperature: 77°F
Forecast: Mostly Sunny then Slight Chance Showers And Thunderstorms
```

- Second Example, include Gherkin (Cucumber).
## Execution Instruction - Example 2
``` sh
node weather-5-interact-with-test.js 
```

### Result - Example 2
```
Feature: Weather Forecast Application

  Scenario: User retrieves a weather forecast
    Given the user enters their name
    And the user provides a valid latitude and longitude
    And the user specifies the number of days for the forecast
    When the user requests the weather forecast
    Then the system should return a weather forecast for the specified location
    And the forecast should include temperature and short forecast description

  Scenario: User enters invalid coordinates
    Given the user enters a name
    And the user provides an invalid latitude or longitude
    When the user requests the weather forecast
    Then the system should return an error message indicating invalid coordinates

  Scenario: User requests more days than available
    Given the user enters their name
    And the user provides a valid latitude and longitude
    And the user requests more forecast days than provided by NOAA
    When the user requests the weather forecast
    Then the system should return the maximum available forecast days from NOAA

Enter your name: Joe
Enter your latitude: 37.7749
Enter your longitude: -122.4194
How many days of forecast do you want? 3

Hello, Joe! Here is your weather forecast:

This Afternoon:
Temperature: 68°F
Forecast: Sunny

Tonight:
Temperature: 54°F
Forecast: Mostly Cloudy

Sunday:
Temperature: 66°F
Forecast: Mostly Sunny
```