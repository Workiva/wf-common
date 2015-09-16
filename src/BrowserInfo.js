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
            vendorPrefix: 'webkit'
        },
        firefox: {
            name: 'Firefox',
            vendor: '',
            vendorPrefix: 'moz'
        },
        ie: {
            name: 'MSIE',
            vendorPrefix: 'ms'
        },
        opera: {
            name: 'OPR',
            vendor: 'Opera Software ASA',
            vendorPrefix: 'o'
        },
        safari: {
            name: 'Safari',
            vendor: 'Apple Computer, Inc.',
            vendorPrefix: 'webkit'
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

        // If no browser detected, check for IE11 via Trident token
        if (!browser && userAgent.indexOf('Trident') !== -1) {
            browser = browserConfigurations.ie;
        }

        // If no browser detected, use webkit as a fallback.
        return browser || browserConfigurations.chrome;
    }

    /**
     * Good reading:
     * https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel#bc1
     * http://stackoverflow.com/questions/10821985/detecting-mousewheel-on-the-x-axis-left-and-right-with-javascript
     */
    function detectMouseWheelEvent(document) {
        // Modern browsers support "wheel", even IE9+;
        // however, IE will return false when checking for 'onwheel', so
        // we need to check the documentMode property.
        if ('onwheel' in document || document.documentMode >= 9) {
            return 'wheel';
        }
        // Webkit and IE8- support at least 'mousewheel'
        else if ('onmousewheel' in document) {
            return 'mousewheel';
        }
        // let's assume that remaining browsers are older Firefox
        else {
            return 'DOMMouseScroll';
        }
    }

    //---------------------------------------------------------
    //
    // BrowserInfo definition
    //
    //---------------------------------------------------------

    var defaultDependencies = {
        window: window,
        eventTranslator: Modernizr,
        navigator: navigator
    };

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
        configuration = configuration || {};
        var navigator = configuration.navigator || defaultDependencies.navigator;
        var window = configuration.window || defaultDependencies.window;
        var eventTranslator = configuration.eventTranslator || defaultDependencies.eventTranslator;
        var browser = detectBrowser(navigator);

        //---------------------------------------------------------
        // Objects
        //---------------------------------------------------------

        /**
         * The type of events that the browser supports.
         */
        this.Events = {
            TRANSITION_END: detectTransitionEndEventName(eventTranslator),
            MOUSE_SCROLL: detectMouseWheelEvent(window.document),

            /**
             * Browser specific event cancellation.
             * @method BrowserInfo.Events#cancelEvent
             * @param {object} event
             */
            cancelEvent: function(event) {
                event = event || window.event;
                if (!event) {
                    return;
                }
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

    return new BrowserInfo();
});
