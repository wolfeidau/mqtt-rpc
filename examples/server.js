'use strict';
var mqtt = require('mqtt');
var mqttrpc = require('../index.js');
var debug = require('debug')('remote-time:server');

var client = mqtt.createClient();
var server = mqttrpc.server(client);

server.provide('$RPC/time', 'localtime', function (args, cb) {
  debug('localtime');
  cb(null, new Date());
});
