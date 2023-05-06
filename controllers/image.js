const {response} = require("express");

const handleApiCall = (req,res)=>{
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", clarifaiResponse(req.body.input))
        .then(response => response.json())
        .then(response => res.json(response))
    }

const clarifaiResponse = (imageUrl) =>{
    const PAT = 'abb9da9a0fbe4790be73ebbc9a135aed';
    const USER_ID = 'otiu4hjtbvkm';
    const APP_ID = 'test';
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
    return requestOptions
}

const handleImage = (db) => (req, res) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'))
}
module.exports = {handleApiCall: handleApiCall, handleImage: handleImage}