'use strict';
/*
 * mqtt-rpc
 * https://github.com/wolfeidau/mqtt-rpc
 *
 * Copyright (c) 2013 Mark Wolfe
 * Licensed under the MIT license.
 */
var mqtt = require('mqtt');
var mqttrouter = require('mqtt-router');
var codecs = require('./codecs.js');
var debug = require('debug')('mqtt-rpc:server');

var Server = function (mqttclient) {

  // default to JSON codec
  this.codec = codecs.byName('json');

  this.mqttclient = mqttclient || mqtt.createClient();

  this.router = mqttrouter.wrap(mqttclient);

  var self = this;

  this._handleReq = function (correlationId, prefix, name, err, data) {

    var replyTopic = prefix + '/' + name + '/reply';

    var msg = {err: err, data: data, _correlationId: correlationId};

    debug('publish', replyTopic, msg);

    self.mqttclient.publish(replyTopic,
      self.codec.encode(msg));
  };

  this._buildRequestHandler = function (prefix, name, cb) {

    debug('buildRequestHandler', prefix, name);

    return function (topic, message) {

      debug('handleMsg', topic, message);

      var msg = self.codec.decode(message);
      var id = msg._correlationId;

      cb.call(null, msg, self._handleReq.bind(null, id, prefix, name));

    };
  };

  this.provide = function (prefix, name, cb) {

    debug('provide', prefix, name);

    var requestTopic = prefix + '/' + name + '/request';

    debug('requestTopic', requestTopic);

    self.router
      .subscribe(requestTopic, self._buildRequestHandler(prefix, name, cb));

    debug('subscribe', requestTopic);

  };

  this.format = function(format){
    this.codec = codecs.byName(format);
  };

};

module.exports = Server;