# Homebox
Homebox provides a uniform interface for interacting with IOT and home automation devices. Most IOT devices have their own communication protocols and standards, which make it a nightmare to integrate into home automation hubs (you have to build and maintain support for each and every device individually). Homebox acts as a translator and **provides a consistent and standard way for accessing home automation devices**.

Home automation hubs no longer have to have knowledge of how to work with each device - they just need to know how to communicate with homebox and they'll have support for potentially unlimited devices.

The homebox ecosystem is entirely open source and based around npm. Developers and manufacturers can add support for devices by creating a driver (an npm package that tells homebox how to communicate with the device in question). Homebox will then expose the device using REST APIs and websockets.

## Requirements
- mongodb
- node.js

## Installation
> npm install homebox

## Run
> node app.js

This should launch a REST API server on localhost:3000

##Getting started
Start by making calls to the APIs documented at https://github.com/richardwillars/homebox/wiki/apis - these APIs are used to discover devices on your network and find out information each device. 

If drivers are already written for the devices you want to interact with then you're good to go.. you just need to call the APIs to control each device. Information on how to do this is listed at https://github.com/richardwillars/homebox/wiki/devices
