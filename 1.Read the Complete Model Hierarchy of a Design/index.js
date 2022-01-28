import MyApp from './app.js'; 
import MyAuth from './auth.js';

// Replace the string literal values with your own client ID, client secret, 
// hub ID, project ID and item version ID. 

const hubId = '<YOUR_HUB_ID>';
const projectId = '<YOUR_PROJECT_ID>';
const clientId = '8kAAlxHgPEIYLQuYSc0EuEAL0gqYQVkv';
const clientSecret = 'EuYAvTd9UsXDaNYu';
const fileName = 'shapes';

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