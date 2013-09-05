'use strict';

var Server = require('./lib/server.js');
var Client = require('./lib/client.js');

exports.server = function(mqttclient){
  return new Server(mqttclient);
};

exports.client = function(mqttclient){
  return new Client(mqttclient);
};