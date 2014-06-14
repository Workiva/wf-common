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

    // var head = document.getElementsByTagName('head')[0];
    // var meta = document.createElement('meta');
    // meta.name = "viewport";
    // meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
    // head.appendChild(meta);
    var DeviceInfo = require('wf-js-common/DeviceInfo');

    describe('DeviceInfo', function() {

        it('should have the correct screenWidth', function() {
            expect(DeviceInfo.screenWidth).toEqual(window.screen.width);
        });

        it('should have the correct screenHeight', function() {
            expect(DeviceInfo.screenHeight).toEqual(window.screen.height);
        });

        it('should have the correct viewportWidth', function() {
            // window.innerWidth can return 982 sometimes and 981 other times
            // on iPad. I suspect this has to do with the actual pixels being
            // 981.5 x2, and the CSS pixels reported varying.
            // You do not see this behavior if you set a meta viewport element.
            var difference = Math.abs(DeviceInfo.viewportWidth - window.innerWidth);
            expect(difference).toBeLessThan(2);
        });

        it('should have the correct viewportHeight', function() {
            expect(DeviceInfo.viewportHeight).toEqual(window.innerHeight);
        });

        it('should have the correct devicePixelRatio', function() {
            expect(DeviceInfo.devicePixelRatio).toEqual(window.devicePixelRatio ? window.devicePixelRatio : 1);
        });

        it('should have the correct hasTouch', function() {
            expect(DeviceInfo.hasTouch).toEqual(('ontouchstart' in window));
        });

        it('should have the correct desktop', function() {
            expect(DeviceInfo.desktop).toEqual(!('ontouchstart' in window));
        });

        it('should have the correct EVENTS', function() {
            expect(DeviceInfo.EVENTS).toEqual({
                WINDOW_RESIZE: ('ontouchstart' in window) ? 'orientationchange' : 'resize'
            });
        });

    });
});
