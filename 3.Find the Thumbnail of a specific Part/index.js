import MyApp from './app.js'; 
import MyAuth from './auth.js';

// Replace the string literal values with your own client id, client secret, 
// hub name, project name and component name.
const clientId = '<YOUR_CLIENT_ID>';
const clientSecret = '<YOUR_CLIENT_SECRET>';
const hubName = '<YOUR_HUB_NAME>';
const projectName = '<YOUR_PROJECT_NAME>'; 
const componentName = '<YOUR_COMPONENT_NAME>';

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
  componentName
);

if (thumbnailPath)
  console.log("Open thumbnail saved here: " + thumbnailPath);



