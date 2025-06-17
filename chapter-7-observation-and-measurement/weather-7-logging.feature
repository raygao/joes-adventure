Feature: Weather Forecast Logging
  As a user
  I want to log my weather forecast requests
  So that I can recall previous forecasts

  Scenario: User requests a weather forecast
    Given the user is logged in
    When the user enters latitude "37.7749" and longitude "-122.4194"
    And the user requests a "3" day forecast
    Then the forecast should be displayed
    And the request should be logged with the username, latitude, longitude, and number of days

  Scenario: User retrieves previous forecast requests
    Given the user has previously requested a forecast
    When the user checks their request history
    Then the system should display a list of past forecast requests with timestamps
