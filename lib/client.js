'use strict';
/*
 * mqtt-rpc
 * https://github.com/wolfeidau/mqtt-rpc
 *
 * Copyright (c) 2013 Mark Wolfe
 * Licensed under the MIT license.
 */
var crypto = require('crypto');
var mqtt = require('mqtt');
var codecs = require('./codecs.js');
var debug = require('debug')('mqtt-rpc:client');

var Client = function (mqttclient) {

  this.codec = codecs.byName('json'); // todo make this configurable
  this.mqttclient = mqttclient || mqtt.createClient();
  this.inFlight = {};

  var self = this;

  this._generator = function () {
    return crypto.randomBytes(5).readUInt32BE(0).toString(16);
  };

  this._handleResponse = function(topic, message) {

    var msg = self.codec.decode(message);
    var id = msg._correlationId;

    debug('handleResponse', topic, id, 'message', message);

    debug('inflight', self.inFlight[id]);

    if (id && self.inFlight[id]) {
      self.inFlight[id].cb(msg.err, msg.data);
      delete self.inFlight[id];
    }

  };

  this._sendMessage = function(topic, message, cb) {

    var id = self._generator();

    debug('sendMessage', topic, id, message);

    self.inFlight[id] = {cb: cb};

    message._correlationId = id;

    self.mqttclient.publish(topic, self.codec.encode(message));

  };

  this.callRemote = function(prefix, name, args, cb){

    var replyTopic = prefix + '/' + name + '/reply';
    var requestTopic = prefix + '/' + name + '/request';

    self.mqttclient
      .subscribe(replyTopic)
      .on('message', self._handleResponse);

    debug('callRemote', 'subscribe', replyTopic);

    self._sendMessage(requestTopic, args, cb);

  };
};

module.exports = Client;
