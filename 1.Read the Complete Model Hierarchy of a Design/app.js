// Axios is a promise-based HTTP client for the browser and node.js. 
import axios from "axios";

// Application constructor 
export default class App {
  constructor(accessToken) {
    this.host = "https://developer-stg.api.autodesk.com/";
    //this.graphAPI = `${this.host}forge/v2`;
    this.graphAPI = `${this.host}manufacturing/graphql/v1`;

    this.accessToken = accessToken;
  }

  getRequestHeaders() {
    return {
      "Content-type": "application/json",
      "Authorization": "Bearer " + this.accessToken,
    };
  }

  async sendQuery(query, variables) {
    return await axios({
      method: 'POST',
      url: `${this.graphAPI}`,
      headers: this.getRequestHeaders(),
      data: { 
        query,
        variables
      }
    })
  }

  async getModelHierarchy(hubName, projectName, fileName) {
    try {
      let response = await this.sendQuery(
        `query GetModelHierarchy($hubName: String!, $projectName: String!, $fileName: String!) {
          hubs(filter:{name:$hubName}) {
            results {
              name
              projects(filter:{name:$projectName}) {
                results {
                  name
                  rootFolder {
                    childItems(filter:{name:$fileName}) {
                      results {
                        ... on DesignFile {
                          name
                          rootComponent {
                            id
                            name 
                            modelOccurrences {
                              results {
                                component {
                                  id
                                  name
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }`,
        {
          hubName,
          projectName,
          fileName
        }
      )

      let rootComponent = response.data.data
        .hubs.results[0]
        .projects.results[0]
        .rootFolder.childItems.results[0]
        .rootComponent;
      let components = {};
      components[rootComponent.id] = rootComponent;

      await this.getSubComponents(components, rootComponent.modelOccurrences.results);

      return {
        rootId: rootComponent.id,
        components
      };
    } catch (err) {
      console.log("There was an issue: " + err.message)
    }
  }

  async getSubComponents(components, modelReferences) {
    for (let occurrence of modelReferences) {
      components[occurrence.component.id] ||= {};
    }

    let query = "query {";
    let index = 0;
    for (let componentId in components) {
      // Get info about components we only have the id's of
      // but no information yet about the component (e.g. its name)
      if (!components[componentId]?.name) {
        query += `
        _${index++}: component(componentId: "${componentId}") {
          id
          name
          modelOccurrences {
            results {
              component {
                id
                name
              }
            }
          }
        }
      `
      }
    }
    query += "}"

    let response = await this.sendQuery(query);
    for (let component of Object.values(response.data.data)) {
      components[component.id] = component;
    }

    for (let component of Object.values(response.data.data)) {
      if (component.modelOccurrences.results.length > 0) {
        await this.getSubComponents(components, component.modelOccurrences.results);
      }
    }
  }
}
