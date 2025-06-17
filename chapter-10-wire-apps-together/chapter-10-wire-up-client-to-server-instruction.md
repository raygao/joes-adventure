# Chapter 10 - Wiring Frontend and Backend Apps together.
In this chapter, we see how to wiring up the frontend (weather forecast) to the backend (travel advisory) applications.
- We use Claude for the backend, runs on port 3500
  - Production use pm2 to add the multi-threading capability in addition to the basic NodeJS Event-Loop.
- FrontEnd, runs on port 3000

## Backend (Advisory)
### Start Claude Query server
``` sh
$ node app.js
```
### Status - Claude Query Server started
```
Server running on port 3500

#### Received request: { city: 'Dallas', weather: 'Mostly Clear' }

Claude raw content: {
  "recommendations": [
    {
      "time": "daytime",
      "type": "outdoor",
      "activities": [
        "Visit the Dallas Arboretum and Botanical Garden",
        "Explore the Dallas Zoo",
        "Take a walk or bike ride along the Katy Trail",
        "Check out the sculptures at Pioneer Plaza"
      ],
      "safety_tips": [
        "Apply sunscreen and wear a hat to protect from the sun",
        "Stay hydrated by drinking plenty of water",
        "Be aware of your surroundings and keep valuables secure"
      ]
    },
    {
      "time": "evening",
      "type": "indoor",
      "activities": [
        "Visit the Perot Museum of Nature and Science",
        "Explore the Dallas Museum of Art",
        "Catch a show at the AT&T Performing Arts Center",
        "Dine at one of Dallas' many renowned restaurants"
      ],
      "safety_tips": [
        "Be cautious when walking alone at night",
        "Park in well-lit areas and be aware of your surroundings",
        "Call a ride-sharing service or taxi if you need transportation at night"
      ]
    }
```

## Execution Instruction - Use Web App to Call DeepSeek Server
``` sh
$ npm run dev
```
### Console - use Web App to Call DeepSeek Server
```
> weather-app@1.0.0 dev
> next dev

  ▲ Next.js 13.5.11
  - Local:        http://localhost:3000
  - Experiments (use at your own risk):
     · serverActions

 ✓ Ready in 998ms
 ✓ Compiled /weather in 293ms (283 modules)
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ✓ Compiled /api/user in 51ms (144 modules)
Ensuring database directory exists at: /Volumes/2TB-NVME/home/raymondgao/Desktop/joes_code/code/chapter-10-wiring-up/improved-weather-10/db
Ensuring database directory exists at: /Volumes/2TB-NVME/home/raymondgao/Desktop/joes_code/code/chapter-10-wiring-up/improved-weather-10/db
Directory already exists
 ✓ Compiled /api/history in 16ms (146 modules)
Ensuring database directory exists at: /Volumes/2TB-NVME/home/raymondgao/Desktop/joes_code/code/chapter-10-wiring-up/improved-weather-10/db
Ensuring database directory exists at: /Volumes/2TB-NVME/home/raymondgao/Desktop/joes_code/code/chapter-10-wiring-up/improved-weather-10/db
Directory already exists
Databases initialized successfully
Username unique index created successfully
Databases initialized successfully
Username unique index created successfully
```

## Result - If you are in the browser, you will see the response in a green colored block
```
Travel Recommendations for Dallas
daytime - outdoor

Visit the Dallas Arboretum and Botanical Garden
Explore the Dallas Zoo
Walk around White Rock Lake Park
Take a tour of AT&T Stadium, home of the Dallas Cowboys
evening - indoor

Visit the Perot Museum of Nature and Science
Explore the Dallas Museum of Art
Attend a performance at the AT&T Performing Arts Center
Dine at one of Dallas' many renowned restaurants
```