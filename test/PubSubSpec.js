/*
 * Copyright 2015 WebFilings, LLC
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

    var ps = require('wf-js-common/PubSub');

    describe('PubSub', function() {

        var key = 'callme';

        beforeEach(function() {
            ps.unsubAll();
        });

        it('should call the subscriber callback with the passed message', function() {
            var called = false;
            var msg = { my: 'data' };
            var passed = null;
            ps.sub(key, function(data) {
                called = true;
                passed = data;
            });
            ps.pub(key, msg);
            expect(called).toBe(true);
            expect(passed).toBe(msg);
        });
        it('should call the subscriber with an array key joined by _', function() {
            var called = false;
            var msg = { my: 'data' };
            var passed = null;
            ps.sub(key, function(data) {
                called = true;
                passed = data;
            });
            ps.pub(['call','me'], msg);
            expect(called).toBe(true);
            expect(passed).toBe(msg);
        });
        it('should unsubscribe a subscriber', function() {
            var fn = function() {
                called = true;
            };
            var called = false;
            ps.sub(key, fn);
            ps.unsub(key, fn);
            ps.pub(key)
            expect(called).toBe(false);
        });
        it('should unsubscribe all subscribers', function() {
            var fn = function() {
                called = true;
            };
            var called = false;
            ps.sub(key, fn);
            ps.sub(key + key, fn);
            ps.unsubAll();
            ps.pub(key);
            ps.pub(key + key);
            expect(called).toBe(false);
        });

    });
});
