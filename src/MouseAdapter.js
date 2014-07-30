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

    var BrowserInfo = require('wf-js-common/BrowserInfo');
    var FunctionUtil = require('wf-js-common/FunctionUtil');
    var Observable = require('wf-js-common/Observable');

    //---------------------------------------------------------
    //
    // THIS IS A BIG DIRTY HACK!!!
    //
    // mousewheels are notoriously difficult/impossible to normalize.
    // So what does this one attempt to do?
    //
    // - Normalizes mousewheel deltas based on the minimum recorded delta.
    //
    // - Detects when the user is using an inertial-scrolling device
    //   (I'm looking at your trackpads, magic mice, et al.).
    //
    //---------------------------------------------------------

    /**
     * The minimum delta for tick of the mouse wheel.
     * @type {number}
     */
    var MIN_DELTA = 50;

    /**
     * The maximum number of times greater than the minimum delta
     * that is used to detect whether we are getting blasted with mousewheel
     * from a hardware-simulated inertial scroll.
     * @type {number}
     */
    var MAX_NON_INERTIAL_DELTA_FACTOR = 4;

    //---------------------------------------------------------
    // The following vars are global to all mousewheel events handled by this adapter.
    // They are used to normalize the deltas returned on mousewheel events.
    //---------------------------------------------------------

    /**
     * Records the minimum mousewheel deltaX; used to detect acceleration.
     * @type {number}
     */
    var minAbsDeltaX = Number.MAX_VALUE;

    /**
     * Records the minimum mousewheel deltaY; used to detect acceleration.
     * @type {number}
     */
    var minAbsDeltaY = Number.MAX_VALUE;

    /**
     * Value used to normalize deltaX to a minimum value.
     * @type {number}
     */
    var normalizingFactorX = 1;

    /**
     * Value used to normalize deltaY to a minimum value.
     * @type {number}
     */
    var normalizingFactorY = 1;

    /**
     * Flag indicating whether the user is using an inertial scrolling device.
     * @type {boolean}
     */
    var hasInertia = false;

    /**
     * Normalizes mousewheel events across browsers and (gasp) devices!
     * This means that it will honor mouse wheel acceleration (swipes)
     * that occur on trackpads and magic mice and the like,
     * while also behaving reasonably with physical mice and actual wheels.
     * @param {object} event
     * @return {{
     *     distance: {
     *         x: number,
     *         y: number
     *     },
     *     source: object
     * }}
     */
    function normalizeEvent(event) {
        var originalEvent = event.originalEvent || event;
        var delta = 0;
        var deltaX = 0;
        var deltaY = 0;
        var absDeltaX;
        var absDeltaY;
        var intertialNormalizingFactor = 1;

        //---------------------------------------------------------
        // Get raw deltas from the appropriate event.
        //---------------------------------------------------------

        // Old school scrollwheel delta
        if (originalEvent.detail) {
            delta = -1 * originalEvent.detail;
            if (originalEvent.axis === originalEvent.HORIZONTAL_AXIS) {
                deltaX = delta;
            }
            else if (originalEvent.axis === originalEvent.VERTICAL_AXIS) {
                deltaY = delta;
            }

            // scrollwheel handling of inertial effects creates tiny deltas,
            // so we increase their size to make everything copacetic.
            intertialNormalizingFactor = 6;
        }

        // New school wheel delta (wheel event)
        if (originalEvent.deltaX || originalEvent.deltaY) {
            deltaX = -1 * originalEvent.deltaX;
            deltaY = -1 * originalEvent.deltaY;
        }

        // Webkit
        if (originalEvent.wheelDeltaX || originalEvent.wheelDeltaY) {
            deltaX = originalEvent.wheelDeltaX || 0;
            deltaY = originalEvent.wheelDeltaY || 0;

            // Webkit handling of inertial effects creates a megabuttload
            // of mousewheel events over huge deltas, so we prune them to size.
            intertialNormalizingFactor = 1 / 6;
        }

        //---------------------------------------------------------
        // Calculate the minimum deltas and the corresponding normalizing factors.
        //
        // We want to know the minimum deltas so we can normalize deltas across browsers.
        // Because the deltas reported vary wildly, we'll adapt to the minimum value reported
        // and set a normalizing factor that will get us to our reasonable baseline.
        //
        // We also want to perform a test for hardware-generated inertial scrolling
        // because we need to use a different normalization factor in those cases.
        // Inertial scrolling will generate deltas that vary across a large range
        // and we'll assume such a device is being used if such deltas are encountered.
        // Once inertial scrolling is detected, we do not check for it anymore.
        //---------------------------------------------------------

        absDeltaX = Math.abs(deltaX);
        if (absDeltaX) {
            if (absDeltaX < minAbsDeltaX) {
                minAbsDeltaX = absDeltaX;
                normalizingFactorX = MIN_DELTA / minAbsDeltaX;
            }
            else if (!hasInertia && (absDeltaX > minAbsDeltaX * MAX_NON_INERTIAL_DELTA_FACTOR)) {
                hasInertia = true;
            }
        }

        absDeltaY = Math.abs(deltaY);
        if (absDeltaY) {
            if (absDeltaY < minAbsDeltaY) {
                minAbsDeltaY = absDeltaY;
                normalizingFactorY = MIN_DELTA / minAbsDeltaY;
            }
            else if (!hasInertia && (absDeltaY > minAbsDeltaY * MAX_NON_INERTIAL_DELTA_FACTOR)) {
                hasInertia = true;
            }
        }

        //---------------------------------------------------------
        // Normalize and return.
        //---------------------------------------------------------

        if (hasInertia) {
            deltaX *= intertialNormalizingFactor;
            deltaY *= intertialNormalizingFactor;
        }
        else {
            deltaX *= normalizingFactorX;
            deltaY *= normalizingFactorY;
        }

        return {
            distance: {
                x: deltaX,
                y: deltaY
            },
            source: event
        };
    }

    //---------------------------------------------------------
    //
    // MouseAdapter definition
    //
    //---------------------------------------------------------

    /**
     * Creates a new MouseAdapter with the given target
     *
     * @classdesc
     * Creates a new mouse adapter capturing events on the target element.
     * This adapter will normalize mousewheel events across browsers and devices!
     * This means that it will handle both swipe-mimicking mousewheel events,
     * (such occur on trackpads, magic mice and the like),
     * while also behaving reasonably with physical mice and actual wheels.
     *
     * @name MouseAdapter
     * @constructor
     *
     * @param {HTMLElement} target
     */
    var MouseAdapter = function(target) {

        //---------------------------------------------------------
        // Observables
        //---------------------------------------------------------

        /**
         * Observable for subscribing to mousewheel events.
         * Subscribers receive the normalized mousewheel data as an argument.
         * @method MouseAdapter#onMouseWheel
         * @param {Function} [callback]
         */
        this.onMouseWheel = Observable.newObservable();
        this.onMouseWheelStart = Observable.newObservable();
        this.onMouseWheelEnd = Observable.newObservable();

        //---------------------------------------------------------
        // Private properties
        //---------------------------------------------------------

        /**
         * The element to listen for events on.
         * @type {HTMLElement}
         */
        this._target = target;

        /**
         * Debounced dispatcher for mouse wheel end events.
         * @type {Function}
         */
        this._dispatchMouseWheelEnd = FunctionUtil.debounce(function(event) {
            this.onMouseWheelEnd.dispatch([{
                distance: { x: 0, y: 0 },
                source: event
            }]);
            this._wheeling = false;
        }.bind(this), 50);

        //---------------------------------------------------------
        // Initialization
        //---------------------------------------------------------

        this._initialize();
    };

    MouseAdapter.prototype = {

        //---------------------------------------------------------
        // Public methods
        //---------------------------------------------------------

        /**
         * Disposes this instance.
         * @method MouseAdapter#dispose
         */
        dispose: function() {
            this._target.removeEventListener(
                BrowserInfo.Events.MOUSE_SCROLL,
                this._onMouseWheel
            );

            this.onMouseWheel.dispose();
        },

        //---------------------------------------------------------
        // Private methods
        //---------------------------------------------------------

        /**
         * Initializes the adapter.
         * @private
         */
        _initialize: function() {
            this._target.addEventListener(
               BrowserInfo.Events.MOUSE_SCROLL,
               this._onMouseWheel.bind(this),
               false
            );
        },

        /**
         * Normalizes the mouse wheel event and returns it through the observable.
         * @param {object} event
         * @private
         */
        _onMouseWheel: function(event) {
            // If we haven't started a mouse wheel for a bit, publish a start event.
            if (!this._wheeling) {
                this.onMouseWheelStart.dispatch([{
                    distance: { x: 0, y: 0 },
                    source: event
                }]);
                this._wheeling = true;
            }

            // Normalize the mouse wheel event and publish.
            var normalizedEvent = normalizeEvent(event);
            this.onMouseWheel.dispatch([normalizedEvent]);

            // Debounce mouse wheels so that an end event is published 50ms
            // after the last mousewheel occured.
            this._dispatchMouseWheelEnd(event);
        }
    };

    return MouseAdapter;
});
