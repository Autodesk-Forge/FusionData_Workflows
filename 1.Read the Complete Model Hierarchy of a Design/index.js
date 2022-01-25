import MyApp from './app.js'; 
import MyAuth from './auth.js';

const clientId = '8kAAlxHgPEIYLQuYSc0EuEAL0gqYQVkv';
const clientSecret = '';
const hubId = '';
const projectId = '';
const dmVersionId = 'urn:adsk.wipprod:fs.file:vf.Z8yfPsjdSR6-Y2VlJAvd_g?version=1';

let myForgeAuth = new MyAuth(clientId, clientSecret);
let accessToken = await myForgeAuth.getAccessToken(); 

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