// Axios is a promise-based HTTP client for the browser and node.js. 
import axios from "axios";

// Application constructor 
export default class App {
  constructor(accessToken) {
    this.graphAPI = 'https://developer.api.autodesk.com/fusiondata/2022-04/graphql';
    this.accessToken = accessToken;
  }

  getRequestHeaders() {
    return {
      "Content-type": "application/json",
      "Authorization": "Bearer " + this.accessToken,
    };
  }

  async sendQuery(query, variables) {
    let response = await axios({
      method: 'POST',
      url: `${this.graphAPI}`,
      headers: this.getRequestHeaders(),
      data: { 
        query,
        variables
      }
    })

    if (response.data.errors) {
      let formatted = JSON.stringify(response.data.errors, null, 2);
      console.log(`API error:\n${formatted}`);
    }

    return response;
  }

  getComponentVersion(response, hubName, projectName, componentName) {
    let hubs = response.data.data.hubs.results;
    if (hubs.length < 1)
      throw { message: `Hub "${hubName}" does not exist` }
      
    let projects = hubs[0].projects.results;
    if (projects.length < 1)
      throw { message: `Project "${projectName}" does not exist` }

    let files = projects[0].rootFolder.items.results;
    if (files.length < 1)
      throw { message: `Component "${componentName}" does not exist` }

    return files[0].tipVersion;
  }

// <manageProperties>
  async manageProperties(hubName, projectName, componentName, propertyGroupName, properties, operation) {
    try {
      let response = await this.sendQuery(
        `query GetComponentVersion($hubName: String!, $projectName: String!, $componentName: String!) {
          hubs(filter:{name:$hubName}) {
            results {
              projects(filter:{name:$projectName}) {
                results {
                  rootFolder {
                    items(filter:{name:$componentName}) {
                      results {
                        ... on Component {
                          tipVersion {
                            id       
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
          componentName
        }
      )

      let componentVersion = this.getComponentVersion(
        response, hubName, projectName, componentName
      );

      let propertyGroup = await this.listProperties(componentVersion.id, propertyGroupName);

      switch (operation) {
        case 'create': 
          if (!propertyGroup) 
            propertyGroup = await this.createPropertyGroup(componentVersion.id, propertyGroupName);

          for (let property of properties) {
            if (propertyGroup.properties?.find(p => p.name === property.name)) {
              console.log(`Property '${property.name}' already exists. Try updating it instead`);
            } else {
              await this.createProperty(propertyGroup.id, property);
              console.log(`Created property '${property.name}' with value '${property.value}'`);
            }
          }

          break;

        case 'update': 
          if (!propertyGroup) {
            console.log(`Property group '${propertyGroupName}' does not exist. Try creating it instead`);
            break;
          }

          for (let property of properties) {
            if (propertyGroup.properties.find(p => p.name === property.name)) {
              await this.updateProperty(propertyGroup.id, property);
              console.log(`Updated property '${property.name}' with value '${property.value}'`);
            } else { 
              console.log(`Property '${property.name}' does not exist. Try creating it instead`);
            }
          }

          break;

        case 'delete':
          if (!propertyGroup) {
            console.log(`Property group '${propertyGroupName}' does not exist`);
            break;
          }
          
          for (let property of properties) {
            if (propertyGroup.properties.find(p => p.name === property.name)) {
              await this.deleteProperty(propertyGroup.id, property);
              console.log(`Deleted property '${property.name}'`);
            } else { 
              console.log(`Property '${property.name}' does not exist`);
            }
          }

          break;
      }
    
    } catch (err) {
      console.log("There was an issue: " + err.message)
    }
  }
// </manageProperties>

// <listProperties>
  async listProperties(componentVersionId, propertyGroupName) {  
    let response = await this.sendQuery(
      `query GetProperties($componentVersionId: ID!) {
        propertyGroups(extendableId: $componentVersionId) {
          results {
            id
            name
            properties {
              name
              displayValue
            }
          }
        }
      }`,
      {
        componentVersionId
      }
    )

    let propertyGroup = response.data.data.propertyGroups.results.find(group => group.name === propertyGroupName);

    if (propertyGroup) {
      console.log(`Current properties for componentVersion with id ${componentVersionId} in the ${propertyGroupName} property group`);
      console.log(JSON.stringify(propertyGroup, null, 2));
    }

    return propertyGroup;
  }
// </listProperties>

// <createPropertyGroup>
  async createPropertyGroup(componentVersionId, propertyGroupName) {  
    let response = await this.sendQuery(
      `mutation CreatePropertyGroup($componentVersionId: ID!, $propertyGroupName: String!) {
        createPropertyGroup(input: {extendableID: $componentVersionId, name: $propertyGroupName}) {
          propertyGroup {
            id
          }
        }
      }`,
      {
        componentVersionId,
        propertyGroupName
      }
    )

    return response.data.data.createPropertyGroup.propertyGroup;
  }
// </createPropertyGroup>

// <deletePropertyGroup>
  async deletePropertyGroup(propertyGroupId) {  
    await this.sendQuery(
      `mutation DeletePropertyGroup($propertyGroupId: ID!) {
        deletePropertyGroup(input: {propertyGroupId: $propertyGroupId}) {
          id
        }
      }`,
      {
        propertyGroupId
      }
    )
  }
// </deletePropertyGroup>

// <createProperty>
  async createProperty(propertyGroupId, property) {  
    await this.sendQuery(
      `mutation CreateProperty($propertyGroupId: ID!, $name: String!, $value: ${property.type}!) {
        create${property.type}Property(input: {propertyGroupId: $propertyGroupId, name: $name, value: $value}) {
          property {
            name
          }
        }
      }`,
      {
        propertyGroupId,
        name: property.name,
        value: property.value
      }
    )
  }
// </createProperty>

// <updateProperty>
  async updateProperty(propertyGroupId, property) {  
    await this.sendQuery(
      `mutation UpdateProperty($propertyGroupId: ID!, $name: String!, $value: ${property.type}!) {
        update${property.type}Property(input: {propertyGroupId: $propertyGroupId, name: $name, value: $value}) {
          property {
            name
          }
        }
      }`,
      {
        propertyGroupId,
        name: property.name,
        value: property.value
      }
    )
  }
// </updateProperty>

// <deleteProperty>
  async deleteProperty(propertyGroupId, property) {  
    await this.sendQuery(
      `mutation DeleteProperty($propertyGroupId: ID!, $name: String!) {
        deleteProperty(input: {propertyGroupId: $propertyGroupId, name: $name}) {
          name
        }
      }`,
      {
        propertyGroupId,
        name: property.name
      }
    )
  }
// </deleteProperty>
}
