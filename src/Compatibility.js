/*
 * Copyright 2014 WebFilings, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(function() {
    'use strict';

    /**
     * Create a window.console object
     *
     * @classdesc
     * When we are running a browser without a console (IE<=9), there will
     * be no console object and things will break, so make one!
     *
     * IE doesn't have a CustomEvent event constructor, so make one!
     *
     * IE9 doesn't support atob and btoa for base64 encoding and decoding, so
     * polyfill. Based on https://github.com/davidchambers/Base64.js
     *
     * @constructor
     *
     * @name Compatibility
     *
     * @param {Object} configuration - for testing purposes, if a new instance
     * needs to be created in a specific state
     * @param {Object} configuration.window - browser's window
     */
    var Compatibility = function(configuration) {

        if (typeof configuration.window.console === 'undefined') {
            configuration.window.console = {
                log: function() {},
                debug: function() {},
                warn: function() {},
                error: function() {}
            };
        }

        if (typeof configuration.window.CustomEvent === 'undefined' || typeof configuration.window.CustomEvent === 'object') {
            (function () {
                function CustomEvent ( event, params ) {
                    params = params || { bubbles: false, cancelable: false, detail: undefined };
                    var evt = document.createEvent( 'CustomEvent' );
                    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
                    return evt;
                }

                CustomEvent.prototype = configuration.window.Event.prototype;

                configuration.window.CustomEvent = CustomEvent;
            })();
        }

        if (typeof configuration.window.atob === 'undefined' || typeof configuration.window.btoa === 'undefined') {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            function InvalidCharacterError(message) {
                this.message = message;
            }
            InvalidCharacterError.prototype = new Error;
            InvalidCharacterError.prototype.name = 'InvalidCharacterError';

            (function () {
                function atob ( input ) {
                    var str = String(input).replace(/=+$/, '');
                    if (str.length % 4 == 1) {
                        throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
                    }
                    for (
                        // initialize result and counters
                        var bc = 0, bs, buffer, idx = 0, output = '';
                        // get next character
                        buffer = str.charAt(idx++);
                        // character found in table? initialize bit storage and add its ascii value;
                        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                        // and if not first of each 4 characters,
                        // convert the first 8 bits to one ascii character
                        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
                    ) {
                        // try to find character in table (0-63, not found => -1)
                        buffer = chars.indexOf(buffer);
                    }
                    return output;
                }

                configuration.window.atob = atob;
            })();

            (function () {
                function btoa ( input ) {
                    var str = String(input);
                    for (
                        // initialize result and counter
                        var block, charCode, idx = 0, map = chars, output = '';
                        // if the next str index does not exist:
                        //   change the mapping table to "="
                        //   check if d has no fractional digits
                        str.charAt(idx | 0) || (map = '=', idx % 1);
                        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
                        output += map.charAt(63 & block >> 8 - idx % 1 * 8)
                    ) {
                        charCode = str.charCodeAt(idx += 3/4);
                        if (charCode > 0xFF) {
                            throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
                        }
                        block = block << 8 | charCode;
                    }
                    return output;
                }

                configuration.window.btoa = btoa;
            })();
        }
    };

    return new Compatibility({
        window: window
    });
});


