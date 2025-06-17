# Send request
curl -X POST -H "Content-Type: application/json" -d '{
  "city": "Chicago",
  "weather": {
    "today": {"temperature":"43°F","forecast":"Mostly Sunny"}
  }
}' http://localhost:3500/recommendations

# Retrieve result
curl http://localhost:3500/recommendations/:requestId