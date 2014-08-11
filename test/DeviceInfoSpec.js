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

        var fakeWindow;

        beforeEach(function() {
            fakeWindow = {
                screen: {
                    width: 0,
                    height: 0
                }
            };
        });

        it('should return an instance of DeviceInfo', function() {
            expect(DeviceInfo instanceof DeviceInfo.constructor).toBe(true);
        });

        describe('screenWidth', function() {
            it('should return the window screen width', function() {
                var expected = fakeWindow.screen.width = 100;
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.screenWidth).toEqual(expected);
            });
        });

        describe('screenHeight', function() {
            it('should return the window screen height', function() {
                var expected = fakeWindow.screen.height = 100;
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.screenHeight).toEqual(expected);
            });
        });

        describe('viewportWidth', function() {
            it('should return the window innerWidth', function() {
                var expected = fakeWindow.innerWidth = 100;
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.viewportWidth).toEqual(expected);
            });
        });

        describe('viewportHeight', function() {
            it('should return the window innerHeight', function() {
                var expected = fakeWindow.innerHeight = 100;
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.viewportHeight).toEqual(expected);
            });
        });

        describe('devicePixelRatio', function() {
            it('should return the window devicePixelRatio if defined', function() {
                var expected = fakeWindow.devicePixelRatio = 2;
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.devicePixelRatio).toEqual(expected);
            });
            it('should return 1 if window does not define devicePixelRatio', function() {
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.devicePixelRatio).toEqual(1);
            });
        });

        describe('hasTouch', function() {
            it('should return true if window defines ontouchstart', function() {
                fakeWindow.ontouchstart = function() {};
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.hasTouch).toBe(true);
            });
            it('should return false if window does not define ontouchstart', function() {
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.hasTouch).toBe(false);
            });
        });

        describe('desktop', function() {
            it('should return false if window defines ontouchstart', function() {
                fakeWindow.ontouchstart = function() {};
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.desktop).toBe(false);
            });
            it('should return true if window does not define ontouchstart', function() {
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.desktop).toBe(true);
            });
        });

        describe('EVENTS.WINDOW_RESIZE', function() {
            it('should return "orientationchange" if window defines ontouchstart', function() {
                fakeWindow.ontouchstart = function() {};
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.EVENTS.WINDOW_RESIZE).toBe('orientationchange');
            });
            it('should return "resize" if window does not define ontouchstart', function() {
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.EVENTS.WINDOW_RESIZE).toBe('resize');
            });
        });
    });
});
