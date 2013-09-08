# mqtt-rpc [![Build Status](https://drone.io/github.com/wolfeidau/mqtt-rpc/status.png)](https://drone.io/github.com/wolfeidau/mqtt-rpc/latest)

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
var mqtt = require('mqtt')
  , mqttrpc = require('mqtt-rpc')
  , debug = require('debug')('remote-time:server')
  , host = 'localhost'
  , port = '1883';

var settings = {
  keepalive: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clientId: 'server-1'
}

// client connection
var mqttclient = mqtt.createClient(port, host, settings);

// build a mqtt new RPC server
var server = mqttrpc.server(mqttclient);

// optionally configure the codec, which defaults to JSON, also supports msgpack
server.format('json');

// provide a new method
server.provide('$RPC/time', 'localtime', function (args, cb) {
  debug('localtime');
  cb(null, new Date());
});
```

# client

Consumes the api exposed by the previous example.

```javascript
var mqtt = require('mqtt')
  , mqttrpc = require('mqtt-rpc')
  , debug = require('debug')('remote-time:client')
  , host = 'localhost'
  , port = '1883';

var settings = {
  keepalive: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clientId: 'client-1'
}

// client connection
var mqttclient = mqtt.createClient(port, host, settings);

// build a new RPC client
var client = mqttrpc.client(mqttclient);

// optionally configure the codec, which defaults to JSON, also supports msgpack
client.format('json');

// call the remote method
client.callRemote('$RPC/time', 'localtime', {}, function(err, data){
  debug('callRemote', err, data);
});
```

## License
Copyright (c) 2013 Mark Wolfe
Licensed under the MIT license.