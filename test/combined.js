'use strict';

var crypto = require('crypto');
var chai = require('chai');
var mqtt = require('mqtt');
var debug = require('debug')('test:mqtt-rpc:combined');
var expect = chai.expect;

var mqttrpc = require('../index.js');

var client = mqttrpc.client(mqtt.createClient());
var server = mqttrpc.server(mqtt.createClient());

var mqttclient;


describe('combined', function () {

  it('server respond to a request from the client', function (done) {

    var prefix = "$RPC/time3";

    server.provide(prefix, 'localtime', function(args, cb){
      debug('localtime');
      cb(null, new Date());
    });

    client.callRemote(prefix, 'localtime', {}, function(err, data){

      debug('callRemote', err, data);
      expect(data).to.exist;
      expect(err).to.not.exist;
      done();


    });

  });

});
