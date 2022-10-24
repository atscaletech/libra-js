'use strict';

const walletConnection = require('..');
const assert = require('assert').strict;

assert.strictEqual(walletConnection(), 'Hello from walletConnection');
console.info("walletConnection tests passed");
