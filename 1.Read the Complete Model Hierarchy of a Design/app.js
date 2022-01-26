// Axios is a promise-based HTTP client for the browser and node.js. 
import axios from "axios";

// Application constructor 
export default class App {
  constructor(accessToken) {
    //this.host = "https://developer-stg.api.autodesk.com/";
    //this.graphAPI = `${this.host}forge/v2`;
    
    this.host = "https://developer-stg.api.autodesk.com/";//"https://developer-stg.api.autodesk.com/";
    this.graphAPI = `${this.host}manufacturing/graphql/v1`//`${this.host}forge/v2`;

    this.accessToken = accessToken
  }

  getRequestHeaders() {
    return {
      "Content-type": "application/json",
      "Authorization": "Bearer " + this.accessToken,
    };
  }

  sendQuery = async (query) => {
    return await axios({
      method: 'POST',
      url: `${this.graphAPI}`,
      headers: this.getRequestHeaders(),
      data: { 
        query
      }
    })
  }

  getModelHierarchy = async (hubId, projectId, dmVersionId) => {
    const componentId = "comp~co.Fsq5T3_pTkyUyib4G_4Lzw~8tE2mKyIF1AryaLv0sR3YW_aga~W5xuOCUwuefUftyMUgMHhd~PTFGQFLfB5gFlUnkh5YJz0"

    try {
      let response = await this.sendQuery(
        `query {
          component(id: "${componentId}") {
            id
            partName
            modelReferences {
              component {
                id
                partName
              }
            }
          }
        }`
      )

      let rootComponent = response.data.data.component;
      let components = {};
      components[rootComponent.id] = rootComponent;

      await this.getSubComponents(components, rootComponent.modelReferences);

      return {
        rootId: rootComponent.id,
        components
      };
    } catch (err) {
      console.log("There was an issue: " + err.message)
    }
  }

  getSubComponents = async (components, modelReferences) => {
    modelReferences.forEach(occurrence => {
      components[occurrence.component.id] = null;
    })

    let query = "query {";
    let index = 0;
    for (let componentId in components) {
      // Get info about components we only have the id's of
      if (components[componentId] === null) {
        query += `
        _${index++}: component(id: "${componentId}") {
          id
          partName
          modelReferences {
            component {
              id
              partName
            }
          }
        }
      `
      }
    }
    query += "}"

    let response = await this.sendQuery(query);
    for (let componentId in response.data.data) {
      let component = response.data.data[componentId];
      components[component.id] = component;
    }

    for (let componentId in response.data.data) {
      let component = response.data.data[componentId];
      if (component.modelReferences.length > 0) {
        await this.getSubComponents(components, component.modelReferences);
      }
    }
  }
}
