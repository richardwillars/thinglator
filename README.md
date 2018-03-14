# Thinglator

Building a home automation platform? You're in the right place.

Thinglator (which is stands for internet of things translator) makes home automation simple and flexible. It provides a uniform interface for interacting with IOT and home automation devices. Rather than trying to integrate with different APIs and communication protocols for each IOT device out there, Thinglator will expose them as consistent and simple APIs. You don't need to know how a particular device works or it's API - you just need to integrate with the basic Thinglator APIs. This allows you to stop worrying about connecting to each device, _you can concrentate on making a killer home automation user interface_. The brilliant part is that your product will automatically support hundreds of IOT things devices out of the box!

The really cool thing is that the Thinglator ecosystem is entirely open source and based around npm. Developers, manufacturers (or anyone with knowledge of JavaScript) can add support for a particular device by creating a driver (this is an npm package that tells Thinglator how to communicate with a particular device). Thinglator will then expose the device to your home automation UI using REST APIs and websockets.

So for example, to make a LIFX lightbulb turn on over 2 seconds and go blue..

    POST http://localhost:3003/devices/:deviceId/setHSBState
    {
      "colour": {
        "hue": 230,
        "saturation": 1,
        "brightness": 0.5
      },
      "duration": 2
    }

.. and to make a Philips Hue lightbulb turn on over 2 seconds and go blue..

    POST http://localhost:3003/devices/:deviceId/setHSBState
    {
      "colour": {
        "hue": 230,
        "saturation": 1,
        "brightness": 0.5
      },
      "duration": 2
    }

(no it's not a mistake - both requests are identical (apart from the device ID)!)
Thinglator removes the requirement to know about different types of devices and their different APIs and networking technologies. Instead they're exposed as a uniform API.

## Requirements

* node.js

## Installation

> yarn add thinglator

## Run

> yarn dev

This should launch a REST API and websocket server on http://localhost:3003

## Test

> yarn test
> or
> yarn test:watch

##Getting started
Out of the box Thinglator has no knowledge of any devices on your network or how to talk to them. The first thing you need to do is to get an interface. An interface tells Thinglator how to communicate with devices over a certain networking technology - this could be http, zwave, zigbee, bluetooth, 433mhz, or anything else you have the appopriate hardware for.

The next thing to get are drivers - these allow Thinglator to search and communicate with specific devices on your network. Check out https://github.com/richardwillars/thinglator/wiki/Drivers to learn how to search for and add drivers.

Once you have some drivers installed you can make calls to the APIs documented at https://github.com/richardwillars/thinglator/wiki/devices. These APIs are used to discover devices on your network (using the drivers you just installed) and find out information each device.

If a driver doesn't exist for the device you want to talk to then you need to create a driver. More information on this can be found at https://github.com/richardwillars/thinglator/wiki/Drivers

You can keep your home automation user interface up to date using the events API. More information on this can be found at https://github.com/richardwillars/thinglator/wiki/events

## Todo

* documentation
* bluetooth adapter
* zigbee adapter
