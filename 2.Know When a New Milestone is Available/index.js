import MyApp from './app.js'; 
import MyAuth from './auth.js';

// Replace the string literal values with your own client ID, client secret, 
// collection ID, and ngrok URL. 
const clientId = '<YOUR_CLIENT_ID>';
const clientSecret = '<YOUR_CLIENT_SECRET>';

// In a terminal, start ngrok with the following command: 
// ngrok http 5500 -host-header="localhost:5500" 
// Copy and paste ngrok URL value returned to your terminal console. 
const ngrokUrl = '<YOUR_NGROK_URL>';

// Create an instance of auth.js.
let myForgeAuth = new MyAuth(clientId, clientSecret);
// Get an access token from your auth.js instance. 
let accessToken = await myForgeAuth.getAccessToken();

var myForgeApp = new MyApp(
  accessToken,
  ngrokUrl
);

// Ensure a clean start by deleting any existing subscriptions.
await myForgeApp.deleteSubscriptions();

const collectionIds = await myForgeApp.getCollectionIds();
const entity = "snapshot";
const eventType = "created";
const filters = [
    "$.data.attributes[?(@.name=='name' && @.value=='milestoneSnapshot')]"
]

for (const collection of collectionIds) {
    console.log(`\nSubscribing to ${entity}.${eventType} event on collection corresponding to hub "${collection.hubName}"`);
    await myForgeApp.subscribeToEvent(collection.id,entity, eventType, filters);
}


// Use the startMonitoringEvents method to report events to the console.
await myForgeApp.startMonitoringEvents();

console.log("\nCreate in Fusion360 a milestone and expect an event here:")





