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

    var slice = Array.prototype.slice;

    /**
     * @classdesc
     * Assorted utilities for functions.
     *
     * @exports FunctionUtil
     */
    var FunctionUtil = {

        /**
         * Creates a curried function with applied arguments.
         * @param {Function} fn - The function to curry.
         * @param {...*} arguments - The applied arguments.
         * @return {Function}
         */
        curry: function(fn) {
            var appliedArgs = slice.call(arguments, 1);

            function curried() {
                /* jshint validthis: true */
                var args = slice.call(arguments);
                return fn.apply(this, appliedArgs.concat(args));
            }

            return curried;
        },

        debounce: function(fn, delay) {
            var timeout = null;
            var debounced = function() {
                if (timeout) {
                    clearTimeout(timeout);
                }
                var args = Array.prototype.slice.call(arguments);
                timeout = setTimeout(function() {
                    fn.apply(null, args);
                }, delay);
            };
            return debounced;
        }
    };

    return FunctionUtil;
});