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

/* eslint "id-length": 0, "no-script-url": 0 */

'use strict';

require('module-keys/cjs').polyfill(module, require, 'web-contract-types/test/test.js');

const { expect } = require('chai');
const { describe, it } = require('mocha');

const { Mintable } = require('node-sec-patterns');
const { TrustedHTML, TrustedScript, TrustedResourceURL, TrustedURL } = require('../index.js');

const mintTrustedScript = require.keys.unboxStrict(
  Mintable.minterFor(TrustedScript),
  () => true);
const mintTrustedResourceURL = require.keys.unboxStrict(
  Mintable.minterFor(TrustedResourceURL),
  () => true);
const mintTrustedURL = require.keys.unboxStrict(
  Mintable.minterFor(TrustedURL),
  () => true);


describe('TrustedHTML', () => {
  it('empty', () => {
    expect(TrustedHTML.empty.content).to.equal('');
    expect(TrustedHTML.is(TrustedHTML.empty)).to.equal(true);
    expect(TrustedHTML.is('')).to.equal(false);
  });
  it('toJSON', () => {
    expect(JSON.stringify(TrustedHTML.empty)).to.equal('""');
    expect(JSON.stringify(TrustedHTML.escape('foo'))).to.equal('"foo"');
  });
  it('toString', () => {
    expect(String(TrustedHTML.empty)).to.equal('');
    expect(String(TrustedHTML.escape('foo'))).to.equal('foo');
  });
  describe('concat', () => {
    it('x 0', () => {
      const got = TrustedHTML.concat();
      expect(TrustedHTML.is(got)).to.equal(true);
      expect(got.content).to.equal('');
    });
    it('empty', () => {
      const got = TrustedHTML.concat(TrustedHTML.empty);
      expect(TrustedHTML.is(got)).to.equal(true);
      expect(got.content).to.equal('');
    });
    it('empty x 2', () => {
      const got = TrustedHTML.concat(TrustedHTML.empty, TrustedHTML.empty);
      expect(TrustedHTML.is(got)).to.equal(true);
      expect(got.content).to.equal('');
    });
    it('x 1', () => {
      const got = TrustedHTML.concat(TrustedHTML.escape('foo'));
      expect(TrustedHTML.is(got)).to.equal(true);
      expect(got.content).to.equal('foo');
    });
    it('x 2', () => {
      const got = TrustedHTML.concat(
        TrustedHTML.escape('foo'),
        TrustedHTML.escape('bar'));
      expect(TrustedHTML.is(got)).to.equal(true);
      expect(got.content).to.equal('foobar');
    });
    it('x 3', () => {
      const got = TrustedHTML.concat(
        TrustedHTML.escape('foo'),
        TrustedHTML.escape('bar'),
        TrustedHTML.escape('baz'));
      expect(TrustedHTML.is(got)).to.equal(true);
      expect(got.content).to.equal('foobarbaz');
    });
    it('err x 1', () => {
      expect(() => TrustedHTML.concat('')).to.throw(TypeError);
      expect(() => TrustedHTML.concat(TrustedURL.innocuousURL)).to.throw(TypeError);
    });
    it('err x 2 left', () => {
      expect(() => TrustedHTML.concat('', TrustedHTML.empty)).to.throw(TypeError);
    });
    it('err x 2 right', () => {
      expect(() => TrustedHTML.concat(TrustedHTML.empty, '')).to.throw(TypeError);
    });
  });
  describe('escape', () => {
    it('empty input', () => {
      const got = TrustedHTML.escape('');
      expect(TrustedHTML.is(got)).to.equal(true);
      expect(got.content).to.equal('');
    });
    it('all 8-bit chars', () => {
      // eslint-disable-next-line no-magic-numbers
      const chars = 'x'.repeat(256).replace(
        /x/g,
        (() => {
          let i = 0;
          return () => String.fromCharCode(i++);
        })());

      const got = TrustedHTML.escape(chars);
      expect(TrustedHTML.is(got)).to.equal(true);
      expect(got.content).to.equal(
        '\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f' +
        '\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f' +
        '\x20\x21&#34;\x23\x24\x25&amp;&#39;\x28\x29\x2a&#43;\x2c\x2d\x2e\x2f' +
        '\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x3a\x3b&lt;&#61;&gt;\x3f' +
        '&#64;\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f' +
        '\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x5b\x5c\x5d\x5e\x5f' +
        '&#96;\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f' +
        '\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a&#123;\x7c\x7d\x7e\x7f' +
        '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x8b\x8c\x8d\x8e\x8f' +
        '\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9a\x9b\x9c\x9d\x9e\x9f' +
        '\xa0\xa1\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xab\xac\xad\xae\xaf' +
        '\xb0\xb1\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xbb\xbc\xbd\xbe\xbf' +
        '\xc0\xc1\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xcb\xcc\xcd\xce\xcf' +
        '\xd0\xd1\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xdb\xdc\xdd\xde\xdf' +
        '\xe0\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xeb\xec\xed\xee\xef' +
        '\xf0\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xfb\xfc\xfd\xfe\xff');
    });
    it('repeated chars', () => {
      expect(TrustedHTML.escape('<<&&>>').content).to.equal('&lt;&lt;&amp;&amp;&gt;&gt;');
    });
    it('once', () => {
      expect(TrustedHTML.escape('&amp;&lt;').content).to.equal('&amp;amp;&amp;lt;');
    });
    it('repeat escape', () => {
      const str = 'I <3 HTML!';
      const once = TrustedHTML.escape(str);
      const twice = TrustedHTML.escape(once);
      expect(TrustedHTML.is(once)).to.equal(true);
      expect(once.content).to.equal('I &lt;3 HTML!');
      // Direct comparison, not just content.
      expect(once).to.equal(twice);
    });
    it('shape shifter', () => {
      const shifter = {
        i: 0,
        toString() {
          return this.i++ ? '<script>alert(1)</script>' : 'innocuous';
        },
      };
      expect(TrustedHTML.escape(shifter).content).to.equal('innocuous');
      expect(shifter.i).to.equal(1);
    });
  });
  describe('fromScript', () => {
    const helloScript = mintTrustedScript('f("Hello, World!");');
    it('TrustedScript', () => {
      const got = TrustedHTML.fromScript(helloScript, { defer: true, nonce: 'R4nd0M' });
      expect(TrustedHTML.is(got)).to.equal(true);
      expect(got.content).to.equal(
        '<!-- --><script nonce="R4nd0M" defer="defer">//<![CDATA[\nf("Hello, World!");\n//]]></script>');
    });
    it('TrustedResourceURL', () => {
      const got = TrustedHTML.fromScript(TrustedResourceURL.fromScript(helloScript), { type: 'module', async: true });
      expect(TrustedHTML.is(got)).to.equal(true);
      expect(got.content).to.equal(
        '<!-- --><script type="module" async="async"' +
        ' src="data:text/javascript;charset&#61;UTF-8,f(%22Hello%2C%20World!%22)%3B#"></script>');
    });
    it('string', () => {
      expect(() => TrustedHTML.fromScript('alert(document.domain', { async: true }))
        .to.throw(TypeError, 'Expected either a TrustedResourceURL or a TrustedScript');
    });
    it('imposter', () => {
      const imposter = Object.create(TrustedScript.prototype, { content: { value: 'alert(document.domain' } });
      expect(() => TrustedHTML.fromScript(imposter, { async: true }))
        .to.throw(TypeError, 'Expected either a TrustedResourceURL or a TrustedScript');
    });
    it('no options', () => {
      const got = TrustedHTML.fromScript(helloScript);
      expect(TrustedHTML.is(got)).to.equal(true);
      expect(got.content).to.equal(
        '<!-- --><script>//<![CDATA[\nf("Hello, World!");\n//]]></script>');
    });
    it('tag embedding hazard', () => {
      const script = mintTrustedScript('1</script>/.exec("script>")[0].length;');
      expect(() => TrustedHTML.fromScript(script))
        .to.throw(Error, 'TrustedScript is not embeddable in HTML');
    });
    it('tag embedding hazard case', () => {
      const script = mintTrustedScript('1</SCRIPT>/i.exec("script>")[0].length;');
      expect(() => TrustedHTML.fromScript(script))
        .to.throw(Error, 'TrustedScript is not embeddable in HTML');
    });
    it('CDATA embedding hazard', () => {
      const script = mintTrustedScript('[[1]]>[[0]];');
      expect(() => TrustedHTML.fromScript(script))
        .to.throw(Error, 'TrustedScript is not embeddable in HTML');
    });
  });
});

describe('TrustedResourceURL', () => {
  describe('fromScript', () => {
    it('non-ascii', () => {
      const script = mintTrustedScript('alert("\u1000\uedcb");');
      const got = TrustedResourceURL.fromScript(script);
      expect(TrustedResourceURL.is(got)).to.equal(true);
      expect(got.content).to.equal('data:text/javascript;charset=UTF-8,alert(%22%E1%80%80%EE%B7%8B%22)%3B#');
    });
    it('not script', () => {
      expect(() => TrustedResourceURL.fromScript('alert(1);'))
        .to.throw(TypeError, 'Expected TrustedScript');
    });
  });
  it('is', () => {
    expect(TrustedResourceURL.is('https://example.com/js.js')).to.equal(false);
    expect(TrustedResourceURL.is(mintTrustedResourceURL('https://example.com/js.js'))).to.equal(true);
  });
  it('toString', () => {
    expect(String(mintTrustedResourceURL('/path'))).to.equal('/path');
  });
});

describe('TrustedScript', () => {
  it('expressionFromJSON', () => {
    const got = TrustedScript.expressionFromJSON(
      // The input.
      // JSON is not a subset of JS around [\u2028\u2029]
      // eslint-disable-next-line no-magic-numbers
      { '\u2028': [ '\u2029"\\', 1234, true, null ] },
      // Check that replacers run
      (key, value) =>
        (Array.isArray(value) ? value.concat([ 'replaced' ]) : value),
      // Indentation
      2);
    expect(TrustedScript.is(got)).to.equal(true);
    expect(got.content).to.equal(String.raw`({
  "\u2028": [
    "\u2029\"\\",
    1234,
    true,
    null,
    "replaced"
  ]
})`);
  });
  it('is', () => {
    expect(TrustedScript.is('alert(1);')).to.equal(false);
    expect(TrustedScript.is(mintTrustedScript('alert(1);'))).to.equal(true);
  });
  it('toString', () => {
    expect(String(mintTrustedScript(' (1 + 1) '))).to.equal(' (1 + 1) ');
  });
});

describe('TrustedURL', () => {
  it('is', () => {
    expect(TrustedURL.is('https://example.com@evil.com/')).to.equal(false);
    expect(TrustedURL.is(TrustedURL.innocuousURL)).to.equal(true);
  });
  describe('sanitize', () => {
    it('http string', () => {
      const str = 'http://example.com/index.html';
      const got = TrustedURL.sanitize(str);
      expect(TrustedURL.is(got)).to.equal(true);
      expect(got.content).to.equal(str);
    });
    it('https string', () => {
      const str = 'https://example.com/index.html';
      const got = TrustedURL.sanitize(str);
      expect(TrustedURL.is(got)).to.equal(true);
      expect(got.content).to.equal(str);
    });
    it('mailto string', () => {
      const str = 'mailto:person@example.com';
      const got = TrustedURL.sanitize(str);
      expect(TrustedURL.is(got)).to.equal(true);
      expect(got.content).to.equal(str);
    });
    it('tel string', () => {
      const str = 'tel:1+234-4567-8910';
      const got = TrustedURL.sanitize(str);
      expect(TrustedURL.is(got)).to.equal(true);
      expect(got.content).to.equal(str);
    });
    it('rel', () => {
      const str = '/foo/bar.html';
      const got = TrustedURL.sanitize(str);
      expect(TrustedURL.is(got)).to.equal(true);
      expect(got.content).to.equal(str);
    });
    it('protocol relative', () => {
      const str = '//example.com/foo/bar.html';
      const got = TrustedURL.sanitize(str);
      expect(TrustedURL.is(got)).to.equal(true);
      expect(got.content).to.equal(str);
    });
    it('case matters sometimes', () => {
      const str = 'MAILTO:Person@example.com';
      const got = TrustedURL.sanitize(str);
      expect(TrustedURL.is(got)).to.equal(true);
      expect(got.content).to.equal('mailto:Person@example.com');
    });
    it('case matters sometimes', () => {
      const str = 'MA\u0130LTO:Person@example.com';
      const got = TrustedURL.sanitize(str);
      expect(got).to.equal(TrustedURL.innocuousURL);
    });
    it('space stripped', () => {
      const str = 'http://example.com/index.html';
      const got = TrustedURL.sanitize(`  ${ str }\t  `);
      expect(TrustedURL.is(got)).to.equal(true);
      expect(got.content).to.equal(str);
    });
    it('non-HTML space not stripped', () => {
      const str = 'http://example.com/index.html';
      const got = TrustedURL.sanitize(` \r\n ${ str }\t \u00A0 `);
      expect(TrustedURL.is(got)).to.equal(true);
      expect(got.content).to.equal(`${ str }\t \u00A0`);
    });
    it('scheme whitelisting', () => {
      const got = TrustedURL.sanitize('javascript:alert`1`', 'fallback');
      expect(got).to.equal('fallback');
    });
    it('null fallback', () => {
      const got = TrustedURL.sanitize('javascript:alert`1`', null);
      expect(got).to.equal(null);
    });
    it('repeat', () => {
      const str = 'http://example.com/index.html';
      const once = TrustedURL.sanitize(str);
      expect(TrustedURL.is(once)).to.equal(true);
      expect(once.content).to.equal(str);
      const twice = TrustedURL.sanitize(once);
      // Direct comparison, not content comparison.
      expect(twice).to.equal(once);
    });
    it('repeat minted', () => {
      const once = mintTrustedURL('javascript:safe();');
      const twice = TrustedURL.sanitize(once);
      // Direct comparison, not content comparison.
      expect(twice).to.equal(once);
    });
    it('TrustedResourceURL downgrade', () => {
      const str = 'data:text/javascript,safe();';
      const resourceURL = mintTrustedResourceURL(str);
      const url = TrustedURL.sanitize(resourceURL);
      expect(TrustedURL.is(url)).to.equal(true);
      expect(url.content).to.equal(str);
    });
  });
  it('toString', () => {
    expect(String(mintTrustedResourceURL('./main.js'))).to.equal('./main.js');
  });
});
