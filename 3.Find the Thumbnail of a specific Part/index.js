import MyApp from './app.js'; 
import MyAuth from './auth.js';

// Replace the string literal values with your own client ID, client secret, 
// collection ID, and partNumber. 

const clientId = '<YOUR_CLIENT_ID>';
const clientSecret = '<YOUR_CLIENT_SECRET>';
const partNumber = '<YOUR_PART_NUMBER>';

// Create an instance of auth.js.
let myForgeAuth = new MyAuth(clientId, clientSecret);
// Get an access token from your auth.js instance. 
let accessToken = await myForgeAuth.getAccessToken(); 

// Create an instance of app.js using the variable set above. 
let myForgeApp = new MyApp(
  accessToken,
);

const collectionIds = await myForgeApp.getCollectionIds();

for (const collection of collectionIds) {
    console.log(`\nChecking for part in collection with id = ${collection.id} [associated with hub "${collection.hubName}"] ...`)
    let material = await myForgeApp.getMaterialOfPart(collection.id, partNumber);
    if (!material) {
        console.log(`Part Number "${partNumber}" was not found in this collection.`);
    } else {
        console.log(`Material of part with Part Number "${partNumber}" is "${material}"`);
    }
}



