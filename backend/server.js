const express = require('express');
const cors = require('cors');
const app = express();
const logger = require('morgan'); // Adds Http logging into the console
const PORT = 4000;

const api_calls = require('./api_calls.js');

app.use(cors(),logger('dev'));

// Starts server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));

//jsonParser necessary for POST request
let bodyparser=require("body-parser");
let jsonParser=bodyparser.json();
// Set default values to API response JSON
let total_api_resp= {
    weather_response: {
        current: {
          "temperature": 0,
          "weathercode": 0
        },
        forecast: {
            time: [
              "0000-00-00",
              "0000-00-00",
              "0000-00-00",
              "0000-00-00",
              "0000-00-00",
              "0000-00-00",
              "0000-00-00"
            ],
            temperature_2m_max: [
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            temperature_2m_min: [
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            precipitation_probability_mean: [
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            weathercode: [
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ]
        }
    },
    news_response: {
        news_in_location: true,
        data: [
            {
                title: "Unknown",
                url: "Unknown",
                publishedAt: "0000-00-00T00:00:00Z"
            }
        ]
    }
}

app.post('/', jsonParser, async (req,res)=>{
    if("location_info" in req.body)
    {
      console.log("Received user input!");
      try
      {
        total_api_resp.weather_response = await api_calls.submitMeteo(40.71,-74.01);
        res.json(total_api_resp.weather_response);
        console.log(res);
      }
      catch(error)
      {
        console.log(error);
        res.status(500);
        return res.send({error:"An error ocurred with OpenMeteo and/or NewsAPI"});
      }
    }
    else
      console.log("Empty request ignored.");
  });