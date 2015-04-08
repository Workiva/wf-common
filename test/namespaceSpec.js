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

    /* global window */

    var ns = require('wf-js-common/namespace');
    var obj = {
        test: 'my object'
    };

    describe('namespace', function() {

        it('should put obects directly on window when the path is 1 element', function() {
            ns('MyObject', obj);
            expect(window.MyObject).toBe(obj);
        });

        it('should put obects at the right place when the path is more than 1 element', function() {
            ns('it.should.be.here', obj);
            expect('it' in window).toBe(true);
            expect(window.it.should.be.here).toBe(obj);
        });

        it('should still create the tree even if the object is undefined', function() {
            ns('it2.should.be.here');
            expect('it2' in window).toBe(true);
            expect(window.it2.should.be).not.toBeUndefined();
            expect('here' in window.it2.should.be).toBe(true);
            expect(window.it2.should.be.here).toBeUndefined();
        });

        it('should still create the tree even if the object is null', function() {
            ns('it3.should.be.here', null);
            expect('it3' in window).toBe(true);
            expect(window.it3.should.be).not.toBeUndefined();
            expect('here' in window.it3.should.be).toBe(true);
            expect(window.it3.should.be.here).toBe(null);
        });

        it('should return the object passed in', function() {
            var result = ns('it3.should.be.here', obj);
            expect(result).toBe(obj);
        });
    });
});
