'use strict';
/*
 * mqtt-rpc
 * https://github.com/wolfeidau/mqtt-rpc
 *
 * Copyright (c) 2013 Mark Wolfe
 * Licensed under the MIT license.
 */
var msgpack = require('msgpack');

exports.define = function (name, encoding, fns) {
  if ('string' != typeof name) throw new Error('codec name required');
  if ('string' != typeof encoding) throw new Error('codec encoding required');
  if ('function' != typeof fns.encode) throw new Error('codec .encode required');
  if ('function' != typeof fns.decode) throw new Error('codec .decode required');

  exports[name] = {
    encode: fns.encode,
    decode: fns.decode,
    name: name,
    encoding: encoding
  };
};


/**
 * Retrieve the code by name.
 *
 * @param {String} name
 * @returns {Object}
 */
exports.byName = function (name) {
  return exports[name];
};

/**
 * JSON
 */
exports.define('json', 'utf8', {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);

/**
 * msgpack
 */
exports.define('msgpack', 'binary', {
  encode: msgpack.pack,
  decode: msgpack.unpack
});