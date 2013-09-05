"use strict";

var crypto = require('crypto');
var chai = require('chai');
var mqtt = require('mqtt');
var debug = require('debug')('test:mqtt-rpc:server');
var expect = chai.expect;

var Server = require('../lib/server.js');

var client;

function generator () {
  return crypto.randomBytes(5).readUInt32BE(0).toString(16);
}

describe('server', function () {

  before(function () {
    debug('createClient', 'encoding');
    client = mqtt.createClient();
  });

  it('should respond to a request', function (done) {

    var prefix = '$RPC/time1';

    var id = generator();

    var requestTopic = prefix + '/localtime/request';
    var replyTopic = prefix + '/localtime/reply';

    client
      .subscribe(replyTopic)
      .on('message', function (topic, message) {

        debug('message', topic, message);

        done();

      });

    var server = new Server(client);

    server.provide(prefix, 'localtime', function (args, cb) {
      debug('localtime');
      cb(null, new Date());
    });

    debug('publish', requestTopic);

    client.publish(requestTopic, JSON.stringify(
      {_correlationId: id}
    ));

  });

});


