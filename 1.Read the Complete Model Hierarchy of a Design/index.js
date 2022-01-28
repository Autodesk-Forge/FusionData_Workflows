import MyApp from './app.js'; 
import MyAuth from './auth.js';

// Replace the string literal values with your own client ID, client secret, 
// hub ID, project ID and item version ID. 

const clientId = '<YOUR_CLIENT_ID>';
const clientSecret = '<YOUR_CLIENT_SECRET>';
const hubName = '<YOUR_HUB_NAME>';
const projectName = '<YOUR_PROJECT_NAME>';
const fileName = '<YOUR_FILE_NAME>';

// Create an instance of auth.js.
let myForgeAuth = new MyAuth(clientId, clientSecret);
// Get an access token from your auth.js instance. 
let accessToken = await myForgeAuth.getAccessToken(); 

// Create an instance of app.js using the variable set above. 
let myForgeApp = new MyApp(
  accessToken
);

let info = await myForgeApp.getModelHierarchy(
  hubName,
  projectName,
  fileName
);

console.log("Model hierarchy:");
printInfo(info.components, info.rootId, "");

function printInfo (components, componentId, indent) {
  console.log(indent + components[componentId].name);
  components[componentId].modelOccurrences.results.forEach(occurrence => {
    printInfo(components, occurrence.component.id, indent + "  ");
  })
}