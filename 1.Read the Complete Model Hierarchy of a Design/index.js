import MyApp from './app.js'; 
import MyAuth from './auth.js';

// Replace the string literal values with your own client ID, client secret, 
// hub ID, project ID and item version ID. 

const clientId = '<YOUR_CLIENT_ID>';
const clientSecret = '<YOUR_CLIENT_SECRET>';
const hubId = '<YOUR_HUB_ID>';
const projectId = '<YOUR_PROJECT_ID>';
const dmVersionId = '<YOUR_ITEM_ID>';

// Create an instance of auth.js.
let myForgeAuth = new MyAuth(clientId, clientSecret);
// Get an access token from your auth.js instance. 
let accessToken = await myForgeAuth.getAccessToken(); 

// Create an instance of app.js using the variable set above. 
let myForgeApp = new MyApp(
  accessToken
);

let info = await myForgeApp.getModelHierarchy(
  hubId,
  projectId,
  dmVersionId
);

console.log("Model hierarchy:");
printInfo(info.components, info.rootId, "");

function printInfo (components, componentId, indent) {
  console.log(indent + components[componentId].partName);
  components[componentId].modelReferences.forEach(occurrence => {
    printInfo(components, occurrence.component.id, indent + "  ");
  })
}