'use strict';
var mqtt = require('mqtt');
var mqttrpc = require('../index.js');
var debug = require('debug')('remote-time:client');

var mqttclient = mqtt.createClient();

var client = mqttrpc.client(mqttclient);

client.callRemote('$RPC/time', 'localtime', {}, function(err, data){
  debug('callRemote', err, data);
});