# Thinglator
Building a home automation platform? You're in the right place.

Thinglator (which is stands for internet of things translator) makes home automation simple and flexible. It provides a uniform interface for interacting with IOT and home automation devices. Rather than trying to integrate with different APIs and communication protocols for each IOT device out there, Thinglator will expose them as consistent and simple APIs. You don't need to know how a particular device works or it's API - you just need to integrate with the basic Thinglator APIs. This allows you to stop worrying about connecting to each device, *you can concrentate on making a killer home automation user interface*. The brilliant part is that your product will automatically support hundreds of IOT things devices out of the box!

The really cool thing is that the Thinglator ecosystem is entirely open source and based around npm. Developers, manufacturers (or anyone with knowledge of JavaScript) can add support for a particular device by creating a driver (this is an npm package that tells Thinglator how to communicate with a particular device). Thinglator will then expose the device to your home automation UI using REST APIs and websockets.

So for example, to make a LIFX lightbulb turn on over 2 seconds and go blue..

    POST http://localhost:3000/devices/:deviceId/setHSBState
    {
      "colour": {
        "hue": 230,
        "saturation": 1,
        "brightness": 0.5
      },
      "duration": 2
    }
    
.. and to make a Philips Hue lightbulb turn on over 2 seconds and go blue..

    POST http://localhost:3000/devices/:deviceId/setHSBState
    {
      "colour": {
        "hue": 230,
        "saturation": 1,
        "brightness": 0.5
      },
      "duration": 2
    }
    
    
(no it's not a mistake - both requests are identical (apart from the device ID)!)
Thinglator takes away knowledge of different types of devices and how their different APIs and networking technologies. Instead they're exposed using a uniform API.


## Requirements
- mongodb
- node.js

## Installation
> npm install thinglator

## Run
> node app.js

This should launch a REST API and websocket server on http://localhost:3000

## Test
> npm run test

100% code coverage is aimed for on this project. We're almost there!
[![codecov](https://codecov.io/gh/richardwillars/thinglator/branch/master/graph/badge.svg)](https://codecov.io/gh/richardwillars/thinglator)
[![codecoverage](https://codecov.io/gh/richardwillars/thinglator/branch/master/graphs/sunburst.svg)](https://codecov.io/gh/richardwillars/thinglator)


##Getting started
Out of the box Thinglator has no knowledge of any devices on your network or how to talk to them. The first thing you need to do is to get some drivers - these allow Thinglator to search and communicate with specific devices on your network. Check out https://github.com/richardwillars/thinglator/wiki/Drivers to learn how to search for and add drivers.

Once you have some drivers installed you can make calls to the APIs documented at https://github.com/richardwillars/thinglator/wiki/devices. These APIs are used to discover devices on your network (using the drivers you just installed) and find out information each device.

If a driver doesn't exist for the device you want to talk to then you need to create a driver. More information on this can be found at https://github.com/richardwillars/thinglator/wiki/Drivers

You can keep your home automation user interface up to date using the events API. More information on this can be found at https://github.com/richardwillars/thinglator/wiki/events

## Todo
Important features to build..
- documentation
- zwave adapter
- openzwave interface
- bluetooth adapter
- zigbee adapter
