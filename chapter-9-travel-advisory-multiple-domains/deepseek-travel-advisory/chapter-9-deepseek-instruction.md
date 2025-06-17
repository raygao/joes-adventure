# Chapter 9 - DeepSeek Instruction
Please remember to set your DeepSeek API key in the .env file, fore execution the example.

## Start DeepSeek Query server
``` sh
$ node app.js
```
## Status - DeepSeek Query Server started
```
Server running on port 3500  
```

## Execution Instruction - Use command line to Call DeepSeek Server
``` sh
$ . ./run.sh 
or
curl -X POST http://localhost:3500/recommendations  -H "Content-Type: application/json"  -d '{"city": "Paris", "weather": "Sunny with 25°C"}'
```
## Result - Use command line to Call DeepSeek Server
```
{
    "requestId": "e81177fc-821b-4291-8195-2129908a8d4e",
    "responseId": "8c644995-c089-4bb6-82d9-f7e35d99ca60",
    "city": "Paris",
    "weather": "Sunny with 25°C",
    "recommendations": {
        "recommendations": [
            {
                "time": "daytime",
                "type": "outdoor",
                "activities": [
                    "Visit the Eiffel Tower and enjoy the stunning views of Paris from the top. Bring sunscreen and water to stay comfortable in the sun.",
                    "Explore the charming streets of Montmartre, visit the Sacré-Cœur Basilica, and watch artists at work in Place du Tertre. Wear comfortable shoes for walking on cobblestone streets.",
                    "Stroll through the beautiful Jardin des Tuileries and relax by the fountains. Find shade under the trees during the hottest part of the day."
                ]
            },
            {
                "time": "evening",
                "type": "outdoor",
                "activities": [
                    "Take a sunset cruise along the Seine River to admire Paris's iconic landmarks illuminated at night. Bring a light jacket as temperatures may drop in the evening.",
                    "Enjoy a picnic dinner in the Parc des Buttes-Chaumont, a beautiful park with a lake, waterfalls, and a temple. Ensure proper disposal of trash and respect park rules.",
                    "Watch the Eiffel Tower's sparkling light show, which takes place every hour on the hour after sunset. Be aware of pickpockets in crowded areas."
                ]
            },
            {
                "time": "daytime",
                "type": "indoor",
                "activities": [
                    "Visit the Louvre Museum to see world-famous artworks like the Mona Lisa. Book tickets in advance to avoid long queues.",
                    "Explore the Musée d'Orsay, housed in a former railway station, and admire its impressive collection of Impressionist art. Follow museum guidelines and do not touch the artworks.",
                    "Discover the unique architecture and stained-glass windows of Sainte-Chapelle. Respect the sacred atmosphere and dress appropriately for a religious site."
                ]
            }
        ]
    }
}
```

## To see your credits.
>Go to API Console: https://platform.deepseek.com