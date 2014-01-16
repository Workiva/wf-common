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

    var DeviceInfo = require('wf-js-common/DeviceInfo');

    describe('DeviceInfo', function() {

        it('should have a correct set of properties on initialization', function() {
            expect(DeviceInfo.screenWidth).toEqual(window.screen.width);
            expect(DeviceInfo.screenHeight).toEqual(window.screen.height);
            expect(DeviceInfo.viewportWidth).toEqual(window.innerWidth);
            expect(DeviceInfo.viewportHeight).toEqual(window.innerHeight);
            expect(DeviceInfo.devicePixelRatio).toEqual(window.devicePixelRatio ? window.devicePixelRatio : 1);
            expect(DeviceInfo.hasTouch).toEqual(('ontouchstart' in window));
            expect(DeviceInfo.desktop).toEqual(!('ontouchstart' in window));
            expect(DeviceInfo.EVENTS).toEqual({
                WINDOW_RESIZE: ('ontouchstart' in window) ? 'orientationchange' : 'resize'
            });
        });
    });
});