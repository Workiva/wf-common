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

    var Modernizr = require('modernizr');

    //---------------------------------------------------------
    //
    // Browser detection
    //
    //---------------------------------------------------------

    var transitionEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
    };

    // Data for each browser we try to detect
    var browserConfigurations = {
        chrome: {
            name: 'Chrome',
            vendor: 'Google Inc.',
            vendorPrefix: 'webkit',
            mouseWheelEvent: 'mousewheel'
        },
        firefox: {
            name: 'Firefox',
            vendor: '',
            vendorPrefix: 'moz',
            mouseWheelEvent: 'DOMMouseScroll'
        },
        ie: {
            name: 'MSIE',
            vendorPrefix: 'ms',
            mouseWheelEvent: 'wheel'
        },
        opera: {
            name: 'OPR',
            vendor: 'Opera Software ASA',
            vendorPrefix: 'o',
            mouseWheelEvent: 'mousewheel'
        },
        safari: {
            name: 'Safari',
            vendor: 'Apple Computer, Inc.',
            vendorPrefix: 'webkit',
            mouseWheelEvent: 'mousewheel'
        }
    };


    function detectTransitionEndEventName(translator) {
        return transitionEndEventNames[translator.prefixed('transition')] || false;
    }

    function detectBrowser(navigator) {
        var property;
        var browserConfiguration;
        var browser;
        var userAgent = navigator.userAgent;
        var browserVendor;
        var browserName;

        for (property in browserConfigurations) {
            if (browserConfigurations.hasOwnProperty(property)) {
                browserConfiguration = browserConfigurations[property];

                // Test the browser vendor to determine a match.
                // If no vendor, check navigator.userAgent string for existence of the browser name for a match.
                browserVendor = browserConfiguration.vendor || null;
                browserName = browserConfiguration.name;

                if (browserVendor !== '' && browserVendor !== null) {
                    if (browserVendor === navigator.vendor) {
                        browser = browserConfiguration;
                    }
                } else {
                    if (userAgent.indexOf(browserName) !== -1) {
                        browser = browserConfiguration;
                    }
                }

                // Stop checking if we found our browser.
                if (browser) {
                    break;
                }
            }
        }

        // If no browser detected, use webkit as a fallback.
        return browser || browserConfigurations.chrome;
    }


    //---------------------------------------------------------
    //
    // BrowserInfo definition
    //
    //---------------------------------------------------------

    /**
     * Information about the current browser.
     *
     * @classdesc
     * An object that contains information about the current browser
     *
     * @name BrowserInfo
     * @constructor
     *
     * @param {Object} configuration - for testing purposes, if a new instance
     * needs to be created in a specific state
     * @param {Object} configuration.window - browser's window
     * @param {Module} configuration.eventTranslator - e.g. Modernizr
     * @param {Object} configuration.navigator - browser's info
     */
    var BrowserInfo = function(configuration) {

        var window = configuration.window;
        var eventTranslator = configuration.eventTranslator;
        var browser = detectBrowser(configuration.navigator);

        //---------------------------------------------------------
        // Objects
        //---------------------------------------------------------

        /**
         * The type of events that the browser supports.
         */
        this.Events = {
            TRANSITION_END: detectTransitionEndEventName(eventTranslator),
            MOUSE_SCROLL: browser.mouseWheelEvent,

            /**
             * Browser specific event cancellation.
             * @method BrowserInfo.Events#cancelEvent
             * @param {object} event
             */
            cancelEvent: function(event) {
                event = event || window.event;
                if (event.preventDefault) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    event.returnValue = false;
                    event.cancelBubble = true;
                }
            }
        };

        // browser names
        this.Browsers = {
            Chrome: 'Chrome',
            FireFox: 'Firefox',
            IE: 'MSIE',
            Opera: 'OPR',
            Safari: 'Safari'
        };

        //---------------------------------------------------------
        // Properties
        //---------------------------------------------------------

        /**
         * The browser's device pixel ratio.
         * @member BrowserInfo#devicePixelRatio
         * @type {number}
         */
        this.devicePixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;

        /**
         * Browser-specific CSS transform property name.
         * @member BrowserInfo#cssTransformProperty
         * @type {string}
         */
        this.cssTransformProperty = eventTranslator.prefixed('transform');

        /**
         * Browser-specific CSS transform-origin property name.
         * @member BrowserInfo#cssTransformOriginProperty
         * @type {string}
         */
        this.cssTransformOriginProperty = eventTranslator.prefixed('transformOrigin');

        /**
         * Browser-specific CSS transition property name.
         * @member BrowserInfo#cssTransitionProperty
         * @type {string}
         */
        this.cssTransitionProperty = eventTranslator.prefixed('transition');

        /**
         * Browser-specific CSS transition-duration property name.
         * @member BrowserInfo#cssTransitionDurationProperty
         * @type {string}
         */
        this.cssTransitionDurationProperty = eventTranslator.prefixed('transitionDuration');

        /**
         * Whether or not the browser supports touch events.
         * @member BrowserInfo#hasTouch
         * @type {boolean}
         */
        this.hasTouch = ('ontouchstart' in window);

        /**
         * Whether the borwser supports 3D CSS transforms.
         * @type {boolean}
         */
        this.hasCssTransforms3d = !!eventTranslator.csstransforms3d;

        /**
         * Gets the name of the browser.
         * @method BrowserInfo#getBrowser
         * @returns {string}
         */
        this.getBrowser = function() {
            return browser.name;
        };
    };

    return new BrowserInfo({
        window: window,
        eventTranslator: Modernizr,
        navigator: navigator
    });
});