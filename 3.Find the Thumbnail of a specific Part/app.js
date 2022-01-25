// Axios is a promise-based HTTP client for the browser and node.js. 
import axios from 'axios';

// Application constructor 
export default class App {
  constructor(accessToken) {
    this.host = 'https://developer.api.autodesk.com/';
    this.graphAPI = `${this.host}assetgraph/`;
    this.accessToken = accessToken;
  }

  getRequestHeaders() {
    return {
      "Content-type": "application/json",
      Authorization: "Bearer " + this.accessToken,
    };
  }

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

  getMaterialOfPart = async (collectionId, partNumber) => {
    try {
      // Find all assets that include a partNumber component.
      let productAsset = await this.getAssetsWithFilter(collectionId, 'has.component.type', 'autodesk.product:components.partNumber-2.1.0', items => {
        for (let key in items) {
          let item = items[key];
          let number = item.components.data?.insert['autodesk.product:components.partNumber-2.1.0']?.partNumber.String.partNumber;
          // Find the one with the correct partNumber
          if (number === partNumber) {
            return item;
          }	
        }

        return null;
      });
      if (!productAsset.id) {
        return null
      }
      // Isolate the design asset with which the product asset has a 'contains' relationship.
      let relationships = await this.getRelationshipsWithFilter(collectionId,'fromAsset', productAsset.id);
      let designAsset;
      for (let key in relationships) {
        let relationship = relationships[key];
        let modelAssetId = relationship.to.asset.id;
        let asset = await this.getAsset(collectionId, modelAssetId);
        if (asset.type === 'autodesk.product:assets.design-6.0.0') {
          designAsset = asset;
          break;
        }
      }

      // Return the material name value from the isolated design asset.
      let material = designAsset.components.data.insert['autodesk.product:components.material-1.0.0'].material.String.name;
      
      return material;
    } catch (error) {
      console.log(error);
    }
  }

  // Get assets based on the collectionId and assetId.
  getAsset = async (collectionId, assetId) => {
    const response = await axios({
      method: 'GET',
      url: `${this.graphAPI}v1/collections/${collectionId}/assets/${assetId}`,
      params: {
        include: 'asset_components'
      },
      headers: await this.getRequestHeaders()
    })

    return response.data;
  }

  // Get assets from the collection provided using a defined filter.
  getAssetsWithFilter = async (collectionId, filterName, filterValue, filter) => {
    let response;
    do {
      response = await axios({
        method: 'GET',
        url: `${this.graphAPI}v1/collections/${collectionId}/assets`,
        params: {
          filter: `${filterName}=="${filterValue}"`,
          cursor: response?.data?.pagination?.cursor
        },
        headers: await this.getRequestHeaders()
      })

      if (filter) {
        let item = filter(response.data.results);
        if (item) {
          return item;
        }
      }

    } while (response?.data?.pagination?.cursor) 

    return response.data.results;
  }

  // Get relationships from a collection using a defined filter.
  getRelationshipsWithFilter = async (collectionId, filterName, filterValue) => {
    const response = await axios({
      method: 'GET',
      url: `${this.graphAPI}v1/collections/${collectionId}/relationships`,
      params: {
        filter: `${filterName}=="${filterValue}"`
      },
      headers: await this.getRequestHeaders()
    })

    return response.data.results;
  }
}