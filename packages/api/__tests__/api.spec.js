'use strict';

const chainConnection = require('..');
const assert = require('assert').strict;

assert.strictEqual(chainConnection(), 'Hello from chainConnection');
console.info("chainConnection tests passed");
