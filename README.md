# PIM_Workflows

![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)


**Forge API:** [![oAuth2](https://img.shields.io/badge/oAuth2-v2-green.svg)](http://developer-autodesk.github.io/)
[![Forge Graph](https://img.shields.io/badge/Forge%20Graph-v1-orange)](https://forge.autodesk.com/en/docs/forgeag/v1/developers_guide/overview/)
[![Forge Data Events](https://img.shields.io/badge/Forge%20Data%20Events-v1-informational)](https://forge.autodesk.com/en/docs/fevnt/v1/developers_guide/overview/)

---

This repository contains several samples illustrating use of [Forge Graph](https://forge.autodesk.com/en/docs/forgeag/v1/developers_guide/overview/) API and [Forge Data Events](https://forge.autodesk.com/en/docs/fevnt/v1/developers_guide/overview/) API in context of PIM workflow:

1. [Subscribe to PIM data events](./1.Subscribe%20to%20PIM%20data%20events) 

   -  subscribe to multiple events and get notifications 
		when scene, snapshot, relationships, assets are created or updated


2. [Know when a Milestone has been created](./2.Know%20when%20a%20Milestone%20has%20been%20created)
	
   - subscribe to a Snapshot entity and set a [Forge Data Events filter](https://forge.autodesk.com/en/docs/fevnt/v1/developers_guide/event_filters/) 
		to be notified only of those satisfying a certain criteria.


3. [Know when the Life Cycle state changes](./3.Know%20when%20the%20Life%20Cycle%20state%20changes)
   
	- subscribe to receive notifications for changes to the lifecycle asset. 
   

4. [Find the Material of a specific Part](./4.Find%20the%20Material%20of%20a%20specific%20Part)

   - get the material of a part, by providing its part number.
	- illustrates how to get different entities using [Forge Graph query filters](https://forge.autodesk.com/en/docs/forgeag/v1/reference/http/forgeag-assets-GET/#query-string-parameters). 


5. [Inspecting the PIM data model of any Fusion model version](./5.Inspecting the PIM data model of any Fusion model version)

	- use the model version URN, to inspect the PIM data model;
	- illustrates how to use [Forge Graph closure-queries](https://forge.autodesk.com/en/docs/forgeag/v1/reference/http/forgeag-assetsget-closure-POST/).


6. [Find what Part properties have changed](./6.Find%20what%20Part%20properties%20have%20changed)

	- poll for changed properties, when you change something in the model;
	- illustrates how to use [Forge Graph sync](https://forge.autodesk.com/en/docs/forgeag/v1/reference/http/forgeag-collections-collectionIdsync-POST/) endpoint.


7. [Traversing PIM to find Product Assets](./7.Traversing%20PIM%20to%20find%20Product%20Assets)

	- get with code the structure of an assembly;
	- illustrates how to use [closure-queries](https://forge.autodesk.com/en/docs/forgeag/v1/reference/http/forgeag-assetsget-closure-POST/).


8. [Find and inspect PIM data in visual way](./8.Integration%20with%20other%20Forge%20APIs)

    - this sample is part of [Learn Forge](http://learnforge.autodesk.io) tutorials and has been extended with Forge Data related functionality
    - use the Data Management API to get to needed model version and inspect PIM data

---

## Prerequisites
1. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app at [this tutorial](http://learnforge.autodesk.io/#/account/);
2. [Node.Js](https://nodejs.org) with version > v14.16.0 and basic knowledge of JavaScript;


# License

These samples are licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

# Written by

Adam Nagy [adam.nagy@autodesk.com](adam.nagy@autodesk.com), [Forge Partner Development](http://forge.autodesk.com)

Denis Grigor [denis.grigor@autodesk.com](denis.grigor@autodesk.com), [Forge Partner Development](http://forge.autodesk.com)
