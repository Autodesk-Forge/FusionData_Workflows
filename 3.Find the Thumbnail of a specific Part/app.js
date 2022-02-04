// Axios is a promise-based HTTP client for the browser and node.js. 
import axios from "axios";

// We need the following in order to save files to the machine
import fs from "fs";  
import path from "path"; 

// Application constructor 
export default class App {
  constructor(accessToken) {
    this.graphAPI = 'https://developer.api.autodesk.com/manufacturing/graphql/v1';
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
      console.log(`GraphQL API error:\n${formatted}`);
    }

    return response;
  }

// <downloadThumbnail>
  async downloadThumbnail(hubName, projectName, fileName) {
    try {
      while (true) {
        let response = await this.sendQuery(
          `query GetThumbnail($hubName: String!, $projectName: String!, $fileName: String!) {
            hubs(filter:{name:$hubName}) {
              results {
                projects(filter:{name:$projectName}) {
                  results {
                    rootFolder {
                      items(filter:{name:$fileName}) {
                        results {
                          ... on DesignFile {
                            rootComponent {
                              thumbnail {
                                status
                                variants {
                                  size
                                  url
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

        let thumbnail = response.data.data
          .hubs.results[0]
          .projects.results[0]
          .rootFolder.items.results[0]
          .rootComponent
          .thumbnail;

        if (thumbnail.status === "success") {
          // If the thumbnail generation finished then we can download it
          // from the url
          let thumbnailPath = path.resolve('thumbnail.png');
          await this.downloadImage(thumbnail.variants[0].url, thumbnailPath);
          return "file://" + encodeURI(thumbnailPath);
        } else {
          console.log("Extracting thumbnail … (it may take a few seconds)")
          // Let's wait a second before checking the status of the thumbnail again
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (err) {
      console.log("There was an issue: " + err.message)
    }
  }
// </downloadThumbnail>

  async downloadImage(url, path) {  
    const writer = fs.createWriteStream(path);
  
    const response = await axios({
      url,
      method: 'GET',
      headers: this.getRequestHeaders(),
      responseType: 'stream'
    });
  
    response.data.pipe(writer);
  
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }
}
