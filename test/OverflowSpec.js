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

    var Overflow = require('wf-js-common/Overflow');
    // mocking hasTouch so it runs in PhantomJS and Chrome
    Overflow.hasTouch = true;

    describe('Overflow', function() {
        var el;

        beforeEach(function() {
            el = document.createElement('div');
            el.style.width = '200px';
            el.style.height = '100px';
            el.style.overflow = 'auto';
            el.style.webkitUserSelect = 'none';
            el.innerHTML = 'a<br>b<br>c<br>d<br>a<br>b<br>c<br>d<br>a<br>b<br>c<br>d<br>';
            document.body.appendChild(el);
        });

        afterEach(function() {
            document.body.removeChild(el);
        });

        it('should have a function named scrollY', function() {
            expect(Overflow.scrollY).toBeDefined();
        });

        it('should scroll up', function() {
            // document.createEvent is null when running in PhantomJS
            if (!document.createEvent) { return; }

            Overflow.scrollY(el);
            swipeY({ from: 20, to: 10 });
            expect(el.scrollTop).toBe(10);
        });

        it('should scroll down', function() {
            // document.createEvent is null when running in PhantomJS
            if (!document.createEvent) { return; }

            el.scrollTop = 20;
            Overflow.scrollY(el);
            swipeY({ from: 10, to: 20 });
            expect(el.scrollTop).toBe(10);
        });

        function swipeY(options) {
            var from = options.from;
            var to = options.to;

            var touchstart = document.createEvent('Event');
            touchstart.initEvent('touchstart', true, true);
            touchstart.touches = [{ pageY: from }];

            var touchmove = document.createEvent('Event');
            touchmove.initEvent('touchmove', true, true);
            touchmove.touches = [{ pageY: to }];

            el.dispatchEvent(touchstart);
            el.dispatchEvent(touchmove);
        }

    });

});
