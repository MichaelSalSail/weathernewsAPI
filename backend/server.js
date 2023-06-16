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

async function submitForm() {
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
// submitForm();