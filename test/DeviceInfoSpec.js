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

    // var head = document.getElementsByTagName('head')[0];
    // var meta = document.createElement('meta');
    // meta.name = "viewport";
    // meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
    // head.appendChild(meta);
    var DeviceInfo = require('wf-js-common/DeviceInfo');
    var bowser = require('bowser');

    describe('DeviceInfo', function() {

        var fakeWindow;

        beforeEach(function() {
            fakeWindow = {
                screen: {
                    width: 0,
                    height: 0
                },
                navigator: {
                    userAgent: 'nuffin'
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
            it('should return true for IE on Microsoft Surfaces', function() {
                fakeWindow.navigator.userAgent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; ARM; Trident/6.0; Touch)';
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.hasTouch).toBe(true);
            });
        });

        describe('desktop vs mobile', function() {
            it('should return opposite values for mobile vs desktop', function() {
                expect(DeviceInfo.mobile).toBe(!DeviceInfo.desktop);
            });
        });

        describe('bowser', function() {
            it('should return false for Media Center PC', function() {
                var bdev = bowser._detect('Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET CLR 1.1.4322; .NET4.0C; Tablet PC 2.0)');
                expect(bdev.msie).toBe(true);
                expect(bdev.tablet).toBe(true);
                expect(DeviceInfo.tablet).not.toBe(true); // with touch fix
                expect(DeviceInfo.browser.tablet).toBe(false);
                expect(DeviceInfo.browser.mobile).toBe(false);
            });
        });

        describe('EVENTS.WINDOW_RESIZE', function() {
            it('should return "orientationchange" if window defines ontouchstart', function() {
                fakeWindow.ontouchstart = function() {};
                var fakeBowser = {
                    mobile: true
                };
                var deviceInfo = new DeviceInfo.constructor(fakeWindow, fakeBowser);
                expect(deviceInfo.EVENTS.WINDOW_RESIZE).toBe('orientationchange');
            });
            it('should return "resize" if window does not define ontouchstart', function() {
                var deviceInfo = new DeviceInfo.constructor(fakeWindow);
                expect(deviceInfo.EVENTS.WINDOW_RESIZE).toBe('resize');
            });
        });
    });
});
