# mqtt-rpc

This module provides an rpc interface for an mqtt connection, in essence this is a request and response strategy which uses
an MQTT topic structure as transport.

[![Build Status](https://travis-ci.org/wolfeidau/mqtt-rpc.png?branch=master)](https://travis-ci.org/wolfeidau/mqtt-rpc)

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

# How it works

When provided with a prefix this module will configure a topic per call, in the example above it will create a topic as follows:

```
$API/localtime/req
```

As well as a back channel for the responses, the correlation id will be included in the topic name. The client will `subscribe` to
`$API/localtime/res/#` and dispatch responses based on the correlation id.

```
$API/localtime/res/b10b946f902e48a3bf71eaa248da03b9
```

## License
Copyright (c) 2013 Mark Wolfe
Licensed under the MIT license.
