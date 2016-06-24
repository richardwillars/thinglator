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

## Available REST APIs

**GET discover/:type/:driver**

*E.g. GET discover/speaker/sonos*

Tells a particular driver to search for devices on the network (in the above example it will search for Sonos speakers using the 'sonos' speaker driver. Any newly found devices are added to homebox. Any existing ones are updated. Any non-existant ones are removed from homebox.


**GET devices/:type**

*E.g. GET devices/speaker*

Returns a list of all devices of a certain type added to Homebox. In the example above it is returning a list of all speakers added to Homebox.


**GET devices/:type/:driver**

*E.g. GET devices/speaker/sonos*

Returns a list of all devices of a certain type and using a certain driver that have been added to Homebox. In the example above it is returning a list of all speakers using the 'sonos' driver.

**GET device/:_id**

*E.g. GET device/abc123*

Returns information about a particular device and all it's capabilities.


**POST device/:_id/:command**

*E.g. POST device/abc123/on*

Sends a command to a particular device. In the above example we are issuing the 'on' command to the device with id 'abc123'. The list of commands/capabilities available for a particular device can be obtained by called GET device/:_id.