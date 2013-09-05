# mqtt-rpc [![Build Status](https://travis-ci.org/wolfeidau/mqtt-rpc.png?branch=master)](https://travis-ci.org/wolfeidau/mqtt-rpc)

This module provides an rpc interface for an mqtt connection, in essence this is a request and response strategy which uses
an MQTT topic structure as transport.

[![NPM](https://nodei.co/npm/mqtt-rpc.png)](https://nodei.co/npm/mqtt-rpc/)
[![NPM](https://nodei.co/npm-dl/mqtt-rpc.png)](https://nodei.co/npm/mqtt-rpc/)

## Installation

```
npm install mqtt-rpc
```

# server

Exposes an array of functions which retrieves and returns data.

```javascript
var mqtt = require('mqtt');
var mqttrpc = require('mqtt-rpc');
var debug = require('debug')('remote-time:server');

var client = mqtt.createClient();
var server = mqttrpc.server(client);

server.provide('$RPC/time', 'localtime', function (args, cb) {
  debug('localtime');
  cb(null, new Date());
});
```

# client

Consumes the api exposed by the previous example.

```javascript
var mqtt = require('mqtt');
var mqttrpc = require('mqtt-rpc');
var debug = require('debug')('remote-time:client');

var mqttclient = mqtt.createClient();

var client = mqttrpc.client(mqttclient);

client.callRemote('$RPC/time', 'localtime', {}, function(err, data){
  debug('callRemote', err, data);
});
```

## License
Copyright (c) 2013 Mark Wolfe
Licensed under the MIT license.