# Chapter 9 - Claude Instruction
Please remember to set your Claude API key in the .env file, fore execution the example.

## Start Claude Query server
``` sh
$ node app.js
```
## Status - Claude Query Server started
```
Server running on port 3500  
```

## Execution Instruction - Use command line to Call Claude Server
``` sh
$ . ./run.sh 
or
# Send request
curl -X POST -H "Content-Type: application/json" -d '{
  "city": "Chicago",
  "weather": {
    "today": {"temperature":"43°F","forecast":"Mostly Sunny"}
  }
}' http://localhost:3500/recommendations

or use URL with requestID:
# Retrieve result
curl http://localhost:3500/recommendations/:requestId  {-options xxxxxx}
```
## Result - Use comand line to Call Server
```
{
    "requestId": "16fd3379-3487-4b77-9095-dc8fccd697cf",
    "recommendations": [
        "Certainly! With sunny weather and a pleasant 25°C in Paris, here are 5-7 great activities to enjoy:",
        "**Picnic by the Seine or in Luxembourg Gardens** – Grab fresh baguettes, cheese, and wine for a relaxing outdoor meal with scenic views.",
        "**Explore Montmartre & Sacré-Cœur** – Wander the charming streets, visit the basilica, and enjoy panoramic views of Paris in the sunshine.",
        "**Boat Cruise on the Seine** – Opt for a daytime or sunset cruise to admire landmarks like the Eiffel Tower and Notre-Dame under clear skies.",
        "**Visit an Open-Air Market (Marché des Enfants Rouges or Bastille Market)** – Shop for fresh produce, artisanal goods, and enjoy al fresco dining.",
        "**Stroll through Jardin des Tuileries or Parc des Buttes-Chaumont** – Relax in these beautiful parks, rent a chair, and soak up the sun.",
        "**Rent a Bike or Take a Walking Tour** – Cycle along the Seine or explore neighborhoods like Le Marais on foot while enjoying the mild weather.",
        "**Outdoor Café Hopping** – Sip coffee or a glass of rosé at a Parisian terrace (try Café de Flore or a local spot in Saint-Germain).",
        "Bonus: If you're up for it, climb the **Eiffel Tower** for breathtaking views while the skies are clear!",
        "Enjoy your sunny day in Paris! ☀️🇫🇷"
    ],
    "city": "Paris",
    "weather": "Sunny with 25°C"
}
```

## To see your credits.
>Go to API Console: https://console.anthropic.com/settings/billing 