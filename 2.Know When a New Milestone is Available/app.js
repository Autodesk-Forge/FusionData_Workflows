// Axios is a promise-based HTTP client for the browser and node.js. 
import axios from 'axios';

// Express is a JavaSscript web application framework. 
import express from 'express';

// Instantiate an express application.
let app = express();

// Use a json handler for incoming HTTP requests.
app.use(express.json());

// Application constructor
export default class App {
    constructor(accessToken, callbackUrl) {
        this.host = 'https://developer.api.autodesk.com/';
        this.eventAPI = `${this.host}fevnt/`;
        this.graphAPI = `${this.host}assetgraph/`;
        this.accessToken = accessToken;
        this.port = 5500;
        this.callbackUrl = callbackUrl;
    }

    getRequestHeaders() {
        return {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        }
    };

    getCollectionIds = async () => {
        const response = await axios({
            method: 'GET',
            url: `${this.host}/project/v1/hubs`,
            headers: this.getRequestHeaders()
        })
        let collection_Ids = []
        response.data.data.forEach(hub => {
            if (hub.relationships.pimCollection) {
                collection_Ids.push({
                    "hubName": hub.attributes.name,
                    "id": hub.relationships.pimCollection.data.id
                })
            }
        })
        return collection_Ids;
    }

    subscribeToEvent = async (collectionId, entity, eventType, filters) => {

        try {
            // Create a new subscription using POST v1/subscriptions endpoint.
            const response = await axios({
                method: "POST",
                url: `${this.eventAPI}v1/subscriptions`,
                headers: this.getRequestHeaders(),
                data: {
                    // Supply a URN of entity we want to monitor.
                    entityUrn: `urn:autodesk.forge.data.assetgraph:collection:${collectionId}`,
                    // Add an eventType variable for the selected entity and event type.
                    eventType: `autodesk.forge.data.assetgraph.events:${entity}.${eventType}-1.0.0`,
                    permissionUrn: `urn:autodesk.forge.data.assetgraph:collection:${collectionId}`,
                    protocol: "HTTPS",
                    callbackUrl: `${this.callbackUrl}/callback`,
                    filters: filters
                },
            })

            // Write the subscription confirmation to the console.
            console.log(
                `\tSubscribed using filter: ${filters} => SubscriptionId:`,
                response.data
            );

        } catch (error) {
            console.log(error);
        }
    }


    // Monitor for event notifications from the ngrok port (5500)
    startMonitoringEvents = async () => {
        console.log(
            `Listening to the events on http://localhost:${this.port} => ${this.callbackUrl}/callback`
        );
        try {
            app.post('/callback', async (req, res) => {
                const resourceURN = req.body.subject.split(':');
                const collectionURN = req.body.data.collectionurn.split(':');
                const collectionId = collectionURN[collectionURN.length - 1];
                const snapshotId = resourceURN[resourceURN.length - 1]
                var partName = await this.getAssemblyAsset(collectionId, snapshotId);
                var milestoneName = req.body.data.components[0].insert["autodesk.product:components.snapshot-1.0.0"].snapshot.String.name;
                console.log(`New milestone "${milestoneName}" was created for ${partName}`);
            })

            app.listen(this.port);

        } catch (error) {
            console.log(error);
        }
    }

    // Delete all subscriptions
    // This method uses the GET v1/subscriptions endpoint.
    deleteSubscriptions = async () => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.eventAPI}v1/subscriptions`,
                headers: this.getRequestHeaders(),
            })

            for (let key in response.data.results) {
                let subscription = response.data.results[key];
                await this.deleteSubscription(subscription.subscriptionId);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Delete a single subscription
    // This method uses the DELETE
    deleteSubscription = async (subscriptionId) => {
        const response = await axios({
            method: 'DELETE',
            url: `${this.eventAPI}v1/subscriptions/${subscriptionId}`,
            headers: this.getRequestHeaders()
        })
    }

    getAssemblyAsset = async (collectionId, snapshotId) => {
        const response = await axios({
            method: 'GET',
            url: `${this.graphAPI}v1/collections/${collectionId}/snapshots/${snapshotId}/assets?include=components`,
            headers: this.getRequestHeaders()
        })

        return response.data.results[1].components.data.insert["autodesk.product:components.partNumber-2.1.0"].partNumber.String.partName;
    };
}


