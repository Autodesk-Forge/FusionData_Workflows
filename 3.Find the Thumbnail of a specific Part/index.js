import MyApp from './app.js'; 
import MyAuth from './auth.js';

// Replace the string literal values with your own client ID, client secret, 
// collection ID, and partNumber. 


// Create an instance of auth.js.
let myForgeAuth = new MyAuth(clientId, clientSecret);
// Get an access token from your auth.js instance. 
let accessToken = await myForgeAuth.getAccessToken(); 

// Create an instance of app.js using the variable set above. 
let myForgeApp = new MyApp(
  accessToken
);

const thumbnailPath = await myForgeApp.downloadThumbnail(
  hubName,
  projectName,
  fileName
);

console.log("Open thumbnail saved here: " + thumbnailPath);



