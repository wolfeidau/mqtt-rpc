"use strict";

var chai = require('chai');
var mqtt = require('mqtt');
var debug = require('debug')('test:mqtt-rpc:client');
var expect = chai.expect;

var Client = require('../lib/client.js');

var mqttclient;

describe('client', function () {

  before(function () {
    debug('createClient', 'encoding');
    mqttclient = mqtt.createClient();
  });

  it('should respond to a request', function (done) {

    var prefix = '$RPC/time2';

    var requestTopic = prefix + '/localtime/request';
    var replyTopic = prefix + '/localtime/reply';

    mqttclient
      .subscribe(requestTopic)
      .on('message', function (topic, message) {
        debug('requestTopic', topic, message);

        var requestMsg = JSON.parse(message);

        var id = requestMsg._correlationId;

        var msg = JSON.stringify({_correlationId: id, err: null, data: {msg: 'test'}});

        debug('publish', replyTopic, msg);

        mqttclient.publish(replyTopic, msg);

      });

    var client = new Client(mqtt.createClient());

    client.callRemote(prefix, 'localtime', {}, function(err, data){
      debug('callRemote', err, data);
      expect(data.msg).to.exist;
      expect(data.err).to.not.exist;
      done();
    });


  });

});


