/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint "id-length": 0, "id-blacklist": 0, "no-magic-numbers": 0 */

'use strict';

require('module-keys/cjs').polyfill(module, require, 'safesql/test/escaper-test.js');

const { expect } = require('chai');
const { describe, it } = require('mocha');

const { TrustedHTML } = require('../index.js');

describe('TrustedHTML', () => {
  it('empty', () => {
    expect(TrustedHTML.empty.content).to.equal('');
    expect(TrustedHTML.is(TrustedHTML.empty)).to.equal(true);
    expect(TrustedHTML.is('')).to.equal(false);
    // TODO: make TrustedHTML.empty not use a setter
  });
  // TODO: lots
});
