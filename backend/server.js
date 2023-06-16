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

function submitMeteo(latitude, longitude) {
    var url = `http://api.openweathermap.org/data/2.5/weather?`
    +`lat=${latitude}&lon=${longitude}&appid=${credentials.open_meteo.apiKey}`

    request({ url: url, json: true }, function (error, response) { 
        if (error) { 
            console.log('Unable to connect to Forecast API'); 
        } 
        else { 
            console.log('It is currently ' + response.body.main.temp + ' degrees out.'); 
            console.log('The high today is ' + response.body.main.temp_max + ' with a low of ' + response.body.main.temp_min); 
            console.log('Humidity today is ' + response.body.main.humidity); 
        } 
    }) 
}
// NY,NY coordinates
submitMeteo(40.71,-74.01)