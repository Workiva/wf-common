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

    // UserAgents with 'Touch' is IE on Microsoft Surfaces
    var ieTouchRegex = / Touch[;)]/;

    /**
     * @classdesc
     * This object contains all sorts of device info
     *
     * @exports DeviceInfo
     */
    var DeviceInfo = function(window, bowserOverride) {

        var bowser = bowserOverride || require('bowser');

        /**
         * The width of the screen in pixels
         * @type {number}
         */
        this.screenWidth = window.screen.width;

        /**
         * The height of the screen in pixels
         * @type {number}
         */
        this.screenHeight = window.screen.height;

        /**
         * The inner width of a window's content area
         * @type {number}
         */
        this.viewportWidth = window.innerWidth;

        /**
         * The inner height of a window's content area
         * @type {number}
         */
        this.viewportHeight = window.innerHeight;

        /**
         * The pixel ratio of the device (i.e. 1 on regular devices, 2 on retina)
         * @type {number}
         */
        this.devicePixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;

        /**
         * The device has touch events
         * @type {boolean}
         */
        this.hasTouch = ('ontouchstart' in window) || !!window.navigator.userAgent.match(ieTouchRegex);

        /**
         * The device is a mobile device
         * @type {boolean}
         */
        this.mobile = this.hasTouch && (bowser.mobile || bowser.tablet || false);

        /**
         * The device is a desktop (i.e. desktop)
         * @type {boolean}
         */
        this.desktop = !(this.mobile);

        /**
         * Expose the bowser object
         * @type {Object}
         */
        this.browser = bowser; // spelling difference IS intentional
        this.browser.tablet = !!this.browser.tablet && this.hasTouch;
        this.browser.mobile = !!this.browser.mobile && this.hasTouch;

        /**
         * Events object
         * @type {Object}
         * @property {String} WINDOW_RESIZE - the device either has an
         * 'orientationchange' (mobile) or a 'resize' (desktop) value
         */
        this.EVENTS = {
            WINDOW_RESIZE: this.mobile ? 'orientationchange' : 'resize'
        };
    };

    return new DeviceInfo(window);
});
