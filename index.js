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

'use strict';

require('module-keys/cjs').polyfill(module, require, 'web-contract-types');

const { Mintable } = require('node-sec-patterns');
const { TypedString } = require('template-tag-common');

const { defineProperties, freeze } = Object;
const { apply } = Reflect;
const { exec: reExec, test: reTest } = RegExp.prototype;
const { replace } = String.prototype;

const { stringify: JSONstringify } = JSON;

// eslint-disable-next-line no-control-regex
const HTML_SPECIAL = /[\x00<>&"'+=@{]/g;
const HTML_ESCS = {
  __proto__: null,
  '\x00': '',
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&#34;',
  '\'': '&#39;',
  // UTF-7
  '+': '&#43;',
  '=': '&#61;',
  // Conditional compilation.
  '@': '&#64;',
  // Client-side templating.
  '{': '&#123;',
};
function escapeHtmlMetaCharacter(chr) {
  return HTML_ESCS[chr];
}

function htmlEscapeString(str) {
  return apply(replace, `${ str }`, [ HTML_SPECIAL, escapeHtmlMetaCharacter ]);
}

const SCRIPT_OR_CDATA_END = /<\/script|\]\]>/i;

/**
 * A string that is safe to use in HTML context in DOM APIs and HTML documents.
 *
 * A TrustedHTML is a string-like object that carries the security type contract
 * that its value as a string will not cause untrusted script execution when
 * evaluated as HTML in a browser.
 *
 * Values of this type are guaranteed to be safe to use in HTML contexts,
 * such as, assignment to the innerHTML DOM property, or interpolation into
 * a HTML template in HTML PC_DATA context, in the sense that the use will not
 * result in a Cross-Site-Scripting vulnerability.
 *
 * Instances must be created by Mintable.minterFor(TrustedHTML).
 *
 * When checking types, use Mintable.verifierFor(TrustedHTML) and do not rely on
 * {@code instanceof}.
 */
class TrustedHTML extends TypedString {}


/**
 * A URL which is under application control and from which script, CSS, and
 * other resources that represent executable code, can be fetched.
 *
 * Given that the URL can only be constructed from strings under application
 * control and is used to load resources, bugs resulting in a malformed URL
 * should not have a security impact and are likely to be easily detectable
 * during testing. Given the wide number of non-RFC compliant URLs in use,
 * stricter validation could prevent some applications from being able to use
 * this type.
 *
 * Instances must be created by Mintable.minterFor(TrustedResourceURL).
 *
 * When checking types, use Mintable.verifierFor(TrustedResourceURL) and do
 * not rely on {@code instanceof}.
 */
class TrustedResourceURL extends TypedString {}


/**
 * A string-like object which represents JavaScript code and that carries the
 * security type contract that its value, as a string, will not cause execution
 * of unconstrained attacker controlled code (XSS) when evaluated as JavaScript
 * in a browser.
 *
 * A TrustedScript's string representation can safely be interpolated as the
 * content of a script element within HTML. The TrustedScript string should not be
 * escaped before interpolation.
 *
 * Note that the TrustedScript might contain text that is attacker-controlled but
 * that text should have been interpolated with appropriate escaping,
 * sanitization and/or validation into the right location in the script, such
 * that it is highly constrained in its effect (for example, it had to match a
 * set of whitelisted words).
 *
 * Instances must be created by Mintable.minterFor(TrustedScript).
 *
 * When checking types, use Mintable.verifierFor(TrustedScript) and do
 * not rely on {@code instanceof}.
 */
class TrustedScript extends TypedString {}


/**
 * A string that is safe to use in URL context in DOM APIs and HTML documents.
 *
 * A TrustedURL is a string-like object that carries the security type contract
 * that its value as a string will not cause untrusted script execution
 * when evaluated as a hyperlink URL in a browser.
 *
 * Values of this type are guaranteed to be safe to use in URL/hyperlink
 * contexts, such as assignment to URL-valued DOM properties, in the sense that
 * the use will not result in a Cross-Site-Scripting vulnerability. Similarly,
 * TrustedURLs can be interpolated into the URL context of an HTML template (e.g.,
 * inside a href attribute). However, appropriate HTML-escaping must still be
 * applied.
 *
 * Instances must be created by Mintable.minterFor(TrustedURL).
 *
 * When checking types, use Mintable.verifierFor(TrustedURL) and do not rely on
 * {@code instanceof}.
 */
class TrustedURL extends TypedString {}


defineProperties(TrustedHTML, {
  'contractKey': {
    enumerable: true,
    value: 'web-contract-types/TrustedHTML',
  },
});
defineProperties(TrustedResourceURL, {
  'contractKey': {
    enumerable: true,
    value: 'web-contract-types/TrustedResourceURL',
  },
});
defineProperties(TrustedScript, {
  'contractKey': {
    enumerable: true,
    value: 'web-contract-types/TrustedScript',
  },
});
defineProperties(TrustedURL, {
  'contractKey': {
    enumerable: true,
    value: 'web-contract-types/TrustedURL',
  },
});


function minterFor(TrustedType) {
  let warned = false;
  function singleWarningFallback(x) {
    if (!warned) {
      warned = true;
      // eslint-disable-next-line no-console
      console.warning(
        `web-contract-types not authorized to create ${ TrustedType.name
        }.  Maybe check your mintable grants used to initialize node-sec-patterns.`);
    }
    return `${ x }`;
  }

  return require.keys.unbox(
    Mintable.minterFor(TrustedType),
    () => true,
    singleWarningFallback);
}


const mintTrustedHTML = minterFor(TrustedHTML);
const isTrustedHTML = Mintable.verifierFor(TrustedHTML);

// const mintTrustedResourceURL = minterFor(TrustedResourceURL);
const isTrustedResourceURL = Mintable.verifierFor(TrustedResourceURL);

const mintTrustedScript = minterFor(TrustedScript);
const isTrustedScript = Mintable.verifierFor(TrustedScript);

const mintTrustedURL = minterFor(TrustedURL);
const isTrustedURL = Mintable.verifierFor(TrustedURL);


let emptyHtml = null;

defineProperties(
  TrustedHTML,
  {
    'concat': {
      enumerable: true,
      // eslint-disable-next-line func-name-matching
      value: function concat(...els) {
        let content = '';
        for (const element of els) {
          if (!isTrustedHTML(element)) {
            throw new TypeError(`Expected TrustedHTML not ${ element }`);
          }
          content += element.content;
        }
        return mintTrustedHTML(content);
      },
    },
    'empty': {
      enumerable: true,
      // eslint-disable-next-line func-name-matching
      get: function empty() {
        if (!emptyHtml) {
          emptyHtml = freeze(TrustedHTML.concat());
        }
        return emptyHtml;
      },
    },
    'escape': {
      enumerable: true,
      // eslint-disable-next-line func-name-matching
      value: function escape(val) {
        return (isTrustedHTML(val)) ? val : mintTrustedHTML(htmlEscapeString(val));
      },
    },
    'fromScript': {
      enumerable: true,
      // eslint-disable-next-line func-name-matching
      value: function fromScript(src, { nonce, type, async, defer } = {}) {
        // Use a comment to prevent dangling markup attacks against nonces.
        let html = '<!-- --><script';
        if (nonce) {
          html += ` nonce="${ htmlEscapeString(nonce) }"`;
        }
        if (type) {
          html += ` type="${ htmlEscapeString(type) }"`;
        }
        if (async) {
          html += ' async="async"';
        }
        if (defer) {
          html += ' defer="defer"';
        }
        if (isTrustedResourceURL(src)) {
          html += ` src="${ htmlEscapeString(src.content) }"`;
        }
        html += '>';
        if (isTrustedScript(src)) {
          const { content } = src;
          if (apply(reTest, SCRIPT_OR_CDATA_END, [ content ])) {
            throw new Error(`TrustedScript is not embeddable in HTML ${ content }`);
          }
          // Use CDATA to avoid mismatches in foreign content parsing in <svg>.
          html += `//<![CDATA[\n${ content }\n//]]>`;
        }
        html += '</script>';
        return mintTrustedHTML(html);
      },
    },
    'is': {
      enumerable: true,
      value: isTrustedHTML,
    },
  });

defineProperties(
  TrustedResourceURL,
  {
    'is': {
      enumerable: true,
      value: isTrustedResourceURL,
    },
  });

defineProperties(
  TrustedScript,
  {
    'expressionFromJSON': {
      enumerable: true,
      // eslint-disable-next-line func-name-matching
      value: function expressionFromJSON(...args) {
        return mintTrustedScript(`(${ JSONstringify(...args) })`);
      },
    },
    'is': {
      enumerable: true,
      value: isTrustedScript,
    },
  });

// Whitespace followed by a scheme, followed by a scheme specific part, followed by trailing whitespace.
const SCHEME_AND_REST = /^[\t\n\f\r ]*([^/:?#]+:)?([\s\S]*?)[\t\n\f\r ]*$/;
// URL schemes that we allow in arbitrary strings.
// This list is kept intentionally short.
// There may be URL schemes with well-understood security properties that are not on this list.
// Use a minter if you need a TrustedURL that is not on this list.
const SAFE_SCHEME_WHITELIST = {
  __proto__: null,
  'http': true,
  'https': true,
  'mailto': true,
  'tel': true,
};
let innocuousTrustedURL = null;

defineProperties(
  TrustedURL,
  {
    'innocuousURL': {
      enumerable: true,
      // eslint-disable-next-line func-name-matching
      get: function innocuousURL() {
        if (!innocuousTrustedURL) {
          innocuousTrustedURL = freeze(mintTrustedURL('about:invalid#TrustedURL'));
        }
        return innocuousTrustedURL;
      },
    },
    'sanitize': {
      enumerable: true,
      // eslint-disable-next-line func-name-matching
      value: function sanitize(val, fallback) {
        if (isTrustedURL(val)) {
          return val;
        }
        if (isTrustedResourceURL(val)) {
          return mintTrustedURL(val);
        }
        const str = `${ val }`;
        const [ scheme, schemeSpecificPart ] = apply(SCHEME_AND_REST, reExec, [ str ]);
        if (!scheme) {
          return mintTrustedURL(schemeSpecificPart || '');
        }
        const canonScheme = scheme.toLowerCase();
        if (SAFE_SCHEME_WHITELIST[canonScheme]) {
          return mintTrustedURL(`${ canonScheme }:${ schemeSpecificPart }`);
        }
        return fallback || TrustedURL.innocuousUrl;
      },
    },
    'is': {
      enumerable: true,
      value: isTrustedURL,
    },
  });


module.exports = freeze({
  TrustedHTML,
  TrustedResourceURL,
  TrustedScript,
  TrustedURL,
});
