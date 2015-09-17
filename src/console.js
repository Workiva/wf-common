/*
 * Copyright 2015 Workiva Inc.
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

define([
], function(
) {
    'use strict';

    // This console is designed for production, and replaces all the console
    // methods with noop functions.

    var x = function() {};
    return {
        memory: {},
        debug: x,
        dir: x,
        error: x,
        group: x,
        groupCollapsed: x,
        groupEnd: x,
        info: x,
        log: x,
        time: x,
        timeEnd: x,
        timeStamp: x,
        trace: x,
        warn: x
    };

});
