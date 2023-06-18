const express = require('express');
const cors = require('cors');
const app = express();
const logger = require('morgan'); // Adds Http logging into the console
const { Configuration, OpenAIApi } = require("openai");
const credentials=require('./API_keys.json');
const configuration = new Configuration({
    apiKey: credentials.openai.apiKey_Michael,
});
const openai = new OpenAIApi(configuration);
const request = require('request');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(credentials.news_api.apiKey);

/**
 * Retrieves current and future weather data for the location through Open-Meteo API
 * @param {float} latitude - latitude for location
 * @param {float} longitude - longitude for location
 * @return {json} - current weather and 7 day forecast
 */
function submitMeteo(latitude, longitude) {
    // API Doc: https://open-meteo.com/en/docs
    let weather_resp={weather_response:{current:{temperature:0,weathercode:0},forecast:{}}}
    let url = `http://api.open-meteo.com/v1/forecast?`
    +`latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean,weathercode&timezone=GMT&appid=${credentials.open_meteo.apiKey}`
    request({ url: url, json: true }, function (error, response) { 
        if (error) { 
            console.log('Unable to connect to Forecast API'); 
        } 
        else { 
            weather_resp.weather_response.current.temperature=response.body.current_weather.temperature;
            weather_resp.weather_response.current.weathercode=response.body.current_weather.weathercode;
            weather_resp.weather_response.forecast=response.body.daily;
            console.log(JSON.stringify(weather_resp, null, 2));
            /* Example response includes todays weather and forecast for next 7 days: 
            {
                temperature: 64.1,
                windspeed: 7.4,
                winddirection: 337,
                weathercode: 3,
                is_day: 0,
                time: '2023-06-17T02:00'
            }
            {
                time: [
                    '2023-06-17',
                    '2023-06-18',
                    '2023-06-19',
                    '2023-06-20',
                    '2023-06-21',
                    '2023-06-22',
                    '2023-06-23'
                ],
                temperature_2m_max: [
                    80.4, 80.7,   77,
                    69.2, 70.6, 81.6,
                    90.3
                ],
                temperature_2m_min: [
                    59, 59.5, 65.6,
                    65, 62.2, 62.2,
                    69
                ],
                precipitation_probability_mean: [
                    55, 3,  3, 6,
                    10, 3, 13
                ],
                weathercode: [
                    3, 3, 3, 51,
                    51, 3, 0
                ]
            }
            weathercode doc: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
            */
           return weather_resp;
        } 
    }) 
}
// NY,NY coordinates
submitMeteo(40.71,-74.01)

/**
 * Retrieves latest weather news for the location, if it exists, through NewsAPI
 * @param {float} location_name - state, city, or town (ex. New Jersey)
 * @return {json} - metadata (title, url, date) on weather news articles (max. 10)
 */
async function submitNews(location_name) {
    let news_resp={news_response:{news_in_location:true,data:[]}}
    let result=await newsapi.v2.everything({
        q: `${location_name} AND (weather OR wildfire OR air quality OR heatwave OR storm OR hurricane OR flood OR drought OR natural disasters OR rainfall OR temperature)`,
        pagesize: 10,
        language: 'en'
    })
    if(result.articles.length>0) {
        console.log(result.articles);
        for(let i=0;i<result.articles.length;i++) {
            news_resp.news_response.data[i]= {
                title:result.articles[i].title,
                url:result.articles[i].url,
                publishedAt:result.articles[i].publishedAt
            }
        }
        console.log(JSON.stringify(news_resp, null, 2));
        return news_resp;
    }
    else {
        console.log("There's no relevant news about weather in your area. Here's the most recent news about the weather...")
        news_resp.news_response.news_in_location=false;
        result=await newsapi.v2.everything({
            q: "weather OR wildfire OR air quality OR heatwave OR storm OR hurricane OR flood OR drought OR natural disasters OR rainfall OR temperature",
            pagesize: 10,
            language: 'en'
        })
        console.log(result.articles);
        for(let i=0;i<result.articles.length;i++) {
            news_resp.news_response.data[i]= {
                title:result.articles[i].title,
                url:result.articles[i].url,
                publishedAt:result.articles[i].publishedAt
            }
        }
        console.log(JSON.stringify(news_resp, null, 2));
        return news_resp;
    }
}
submitNews("New York")

// sample code to ask ChatGPT a question
async function submitGPT() {
    let options = {
        model: 'text-davinci-003',
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ['/'],
        prompt: "What is the diameter of earth?"
    };
    const chat_completion = await openai.createChatCompletion(options);
    console.log(chat_completion);
}
// 'insufficient_quota'...
// My free trial expired so my APIkay can't make requests
// submitGPT();