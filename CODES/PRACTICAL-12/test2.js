const axios = require('axios');

async function getIamToken(apiKey) {
    const url = 'https://iam.cloud.ibm.com/identity/token';

    try {
        const response = await axios.post(url, null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                apikey: apiKey,
                grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
            },
        });
        return response.data.access_token; // Return the access token
    } catch (error) {
        console.error('Error obtaining IAM token:', error.response.data);
        throw error;
    }
}

// Use your API key
const apiKey = 'ziPvsaziIDuXduarkTG4ZzuV30ISPD-iL6WW1eDCAx7T';
getIamToken(apiKey)
    .then(token => {
        console.log('IAM Access Token:', token);
        // Now you can use this token in your API requests
    })
    .catch(err => {
        console.error('Failed to get IAM token:', err);
    });
