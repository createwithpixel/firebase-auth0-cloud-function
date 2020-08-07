# firebase-auth0-cloud-function
Firebase Cloud Function for Auth0 integration with custom tokens.

## Installation
* Initialize a Firebase project locally.
* Clone the repo on the functions folder.
* Get the service account JSON file from the Firebase Console.
* Copy the service account JSON file in the functions/firebase folder as: "service-account.json"
* Create a file called config.js with the following content:

```
module.exports = {
    AUTH0_DOMAIN: '<YOUR AUTH0 APP DOMAIN>', // e.g., you.auth0.com
    AUTH0_API_AUDIENCE: '<YOUR AUTH0 API AUDIENCE URL>', // e.g., http://localhost:1337/
    FIREBASE_KEY: './firebase/service-account.json',
    FIREBASE_DB: 'https://<YOUR PROJECT>.firebaseio.com' // e.g., https://your-project.firebaseio.com
};
```

* Save the config.js file in the functions folder.
* Run:
    > npm install
    
    > firebase deploy --only functions
* The function is called auth0, get the endpoint from the Console.

An example of usage from frontend can be found in: https://github.com/createwithpixel/firebase-auth0-test/

