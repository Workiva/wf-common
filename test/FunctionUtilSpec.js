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

define(function(require) {
    'use strict';

    var FunctionUtil = require('wf-js-common/FunctionUtil');

    describe('FunctionUtil', function() {

        describe('curry', function() {

            it('should curry a function', function() {
                var val1 = 4;
                var val2 = 2;
                var fn = function(val1, val2) {
                    return val1 + val2;
                };
                var curriedFn = FunctionUtil.curry(fn, val1);
                expect(curriedFn).not.toThrow();
                expect(curriedFn(val2)).toEqual(val1 + val2);
            });
        });
    });
});