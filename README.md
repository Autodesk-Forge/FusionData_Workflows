# PIM_Workflows

![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)


**Forge API:** [![oAuth2](https://img.shields.io/badge/oAuth2-v2-green.svg)](http://developer-autodesk.github.io/)
[![Forge Graph](https://img.shields.io/badge/Forge%20Graph-v1-orange)](https://forge.autodesk.com/en/docs/forgeag/v1/developers_guide/overview/)
[![Forge Data Events](https://img.shields.io/badge/Forge%20Data%20Events-v1-informational)](https://forge.autodesk.com/en/docs/fevnt/v1/developers_guide/overview/)

---

This repository contains several samples illustrating use of Forge GraphQL API in context of PIM workflow:

1. [Read the Complete Model Hierarchy of a Design](./1.Read%20the%20Complete%20Model%20Hierarchy%20of%20a%20Design) 

   -  based on the **version id** of a given model you can get the full model hierarchy - similar to what is shown inside **Fusion 360**.


2. [Know when a Milestone is Available](./2.Know%20When%20a%20New%20Milestone%20is%20Available)
	
   - subscribe to the `milestone.created` event of a specific model in order to be notified when a milestone is created for a given version of it.


3. [Find the Thumbnail of a specific Part](./3.Find%20the%20Thumbnail%20of%20a%20specific%20Part)
   
	-  based on the **version id** you can get the thumbnail of a given model.

---

## Prerequisites
1. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app at [this tutorial](http://learnforge.autodesk.io/#/account/);
2. [Node.Js](https://nodejs.org) with version > v14.16.0 and basic knowledge of JavaScript;


# License

These samples are licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

# Written by

Adam Nagy [adam.nagy@autodesk.com](adam.nagy@autodesk.com), [Forge Partner Development](http://forge.autodesk.com)

Denis Grigor [denis.grigor@autodesk.com](denis.grigor@autodesk.com), [Forge Partner Development](http://forge.autodesk.com)
