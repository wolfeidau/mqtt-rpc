'use strict';
var mqtt = require('mqtt');
var codecs = require('./codecs.js');
var debug = require('debug')('mqtt-rpc:server');

var Server = function (mqttclient) {

  this.codec = codecs.byName('json'); // todo make this configurable
  this.mqttclient = mqttclient || mqtt.createClient();

  var self = this;

  this._buildRequestHandler = function (prefix, name, fun) {

    debug('provide', prefix, name, fun);

    return function (topic, message) {

      debug('handleMsg', topic, message);

      var msg = self.codec.decode(message);
      var id = msg._correlationId;

      var handleReq = function (err, data) {

        var replyTopic = prefix + '/' + name + '/reply';

        debug('publish', replyTopic);

        self.mqttclient.publish(replyTopic,
          self.codec.encode(
            {err: err, data: data, _correlationId: id}
          ));
      };

      fun.call(null, msg, handleReq);

    };
  };

  this.provide = function (prefix, name, fun) {

    debug('provide', prefix, name);

    var requestTopic = prefix + '/' + name + '/request';

    debug('requestTopic', requestTopic);

    self.mqttclient
      .subscribe(requestTopic)
      .on('message', self._buildRequestHandler(prefix, name, fun));

    debug('subscribe', requestTopic);

  };

};

module.exports = Server;