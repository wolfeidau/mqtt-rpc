'use strict';
/*
 * mqtt-rpc
 * https://github.com/wolfeidau/mqtt-rpc
 *
 * Copyright (c) 2013 Mark Wolfe
 * Licensed under the MIT license.
 */
var mqtt = require('mqtt');
var codecs = require('./codecs.js');
var debug = require('debug')('mqtt-rpc:server');

var Server = function (mqttclient) {

  this.codec = codecs.byName('json'); // todo make this configurable
  this.mqttclient = mqttclient || mqtt.createClient();

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

    self.mqttclient
      .subscribe(requestTopic)
      .on('message', self._buildRequestHandler(prefix, name, cb));

    debug('subscribe', requestTopic);

  };

};

module.exports = Server;