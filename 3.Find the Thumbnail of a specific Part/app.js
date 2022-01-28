// Axios is a promise-based HTTP client for the browser and node.js. 
import axios from "axios";
// We need the following in order to save files to the machine
import fs from "fs";  
import path from "path"; 

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

  async sendQuery(query) {
    return await axios({
      method: 'POST',
      url: `${this.graphAPI}`,
      headers: this.getRequestHeaders(),
      data: { 
        query
      }
    })
  }

  async downloadThumbnail(hubName, projectName, fileName) {
    try {
      while (true) {
        let response = await this.sendQuery(
          `query {
            hubs(filter:{name:"${hubName}"}) {
              results {
                projects(filter:{name:"${projectName}"}) {
                  results {
                    rootFolder {
                      childItems(filter:{name:"${fileName}"}) {
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
          }`
        )

        let thumbnail = response.data.data
          .hubs.results[0]
          .projects.results[0]
          .rootFolder.childItems.results[0]
          .rootComponent
          .thumbnail;

        if (thumbnail.status === "success") {
          // If the thumbnail generation finished then we can download it
          // from the url
          let thumbnailPath = path.resolve('thumbnail.png');
          await this.downloadImage(thumbnail.variants[0].url, thumbnailPath);
          return "file://" + encodeURI(thumbnailPath);
        } else {
          // Let's wait a second before checking the status of the thumbnail again
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (err) {
      console.log("There was an issue: " + err.message)
    }
  }

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
