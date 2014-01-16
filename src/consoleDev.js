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

/* global console */
define([
], function(
) {
    'use strict';

    // This console is designed for development, and returns the global console

    // Just in case you are developing in IE without the dev tools, we polyfill console.
    // Also, FF doesn't currently support the memory property

    var con = console || {};
    var props = 'memory'.split(',');
    var methods = 'debug,dir,error,group,groupCollapsed,groupEnd,info,log,time,timeEnd,timeStamp,trace,warn'.split(',');

    var prop = props.pop();
    while (prop) {
        con[prop] = console[prop] || {};
        prop = props.pop();
    }

    var method = methods.pop();
    var noop = function() {};
    while (method) {
        con[method] = console[method] || noop;
        method = methods.pop();
    }

    return con;
});