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

define(function(require) {
    'use strict';

    var Utils = require('wf-js-common/Utils');

    describe('Utils', function() {

        describe('valueOr', function() {

            it('should return the value if it is defined', function() {
                var err = 'err';

                expect(Utils.valueOr(null, err)).toBe(null);
                expect(Utils.valueOr('', err)).toBe('');
                expect(Utils.valueOr(false, err)).toBe(false);
                expect(Utils.valueOr(0, err)).toBe(0);
            });

            it('should return the default if value is undefined', function() {
                expect(Utils.valueOr(undefined, 'default')).toBe('default');
            });
        });
    });
});
