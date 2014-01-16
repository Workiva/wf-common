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
    };

    return new Compatibility({
        window: window
    });
});


