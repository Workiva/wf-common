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

    var _ = require('lodash');
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
    // The Scroll-detection mechanism depends on collecting and storing a small buffer 
    // of scroll history in order to analyze and interpret it for patterns.
    //---------------------------------------------------------

    /**
     * A constant which represents the maximum amount of data buffered.  That is, when 
     * this value is N, the N most recent data points are preserved.  Beyond that, data 
     * is overwritten.  This should only be large enough to hold the desired amount of 
     * data and not any larger to preserve memory.
     *
     * This number is 10 because one detection method (_detectUserScroll.detectDeltaIncrease)
     * uses the last 10 data points to determine whether a scroll was performed.
     * @type {number}
     */
    var DELTA_ARRAY_SIZE = 10;
    
    /**
     * A two dimensional array of size [2][DELTA_ARRAY_SIZE] which holds data captured.  
     * It holds separate data for the X- and Y-axis, hence the 2.  Constants have been 
     * created for accessing the array for clarity.
     * @type {Array.<Array.<number>>}
     */
    var deltaArray = [[],[]];
    
    /**
     * An index which always refers to the first (oldest) data point
     * in the array.  It also represents the point that will be overwritten by new data.
     * @type {number}
     */
    var deltaArrayIndex = 0;
    
    /**
     * A constant provided for accessing the X and Y arrays of data.
     * @type {number}
     */
    var DELTA_INDEX = {
        x: 0,
        y: 1
    };

    /**
     * A helper function for calculating the index of the desired data given its 
     * relative index.  Negative numbers can be used to access the N'th most recent
     * data point.
     *
     * For example: 
     *   getDeltaArrayIndex(0) will return the index of the oldest data point
     *   getDeltaArrayIndex(DELTA_ARRAY_SIZE-1) will return the most recent data index.
     *   getDeltaArrayIndex(-1) will return the most recent data point index.
     *   getDeltaArrayIndex(-DELTA_ARRAY_SIZE) will return the oldest data point index.
     * @type {Function}
     * @return {number} The properly offset index of the requested data point.
     */
    var getDeltaArrayIndex = function(index) {
        var result = (deltaArrayIndex+index);
        if (index < 0) {
            if (index < -DELTA_ARRAY_SIZE) {
                throw new Error('Array index out of bounds!');
            }
            result += DELTA_ARRAY_SIZE;
        }
        else {
            if (index >= DELTA_ARRAY_SIZE) {
                throw new Error('Array index out of bounds!');
            }
        }
        result = result % DELTA_ARRAY_SIZE;
        return result;
    };

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
        this._debouncedDispatchMouseWheelEnd = FunctionUtil.debounce(
            this._dispatchMouseWheelEnd.bind(this), 80);

        /**
         * Throttled dispatcher for user initiated re-scroll events.
         * @type {Function}
         */
        this._throttledDispatchUserReScroll = _.throttle(
            this._dispatchUserReScroll.bind(this), 50);

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
                this._dispatchMouseWheelStart(event);
            }

            // Normalize the mouse wheel event and publish.
            var normalizedEvent = normalizeEvent(event);
            this._detectUserScroll(normalizedEvent);
            this.onMouseWheel.dispatch([normalizedEvent]);

            // Debounce mouse wheels so that an end event is published 50ms
            // after the last mousewheel occured.
            this._debouncedDispatchMouseWheelEnd(event);
        },

        /**
         * Dispatches the MouseWheel start event, and handles related controls.
         * @param {object} event
         * @private
         */
        _dispatchMouseWheelStart: function(event) {
            this.onMouseWheelStart.dispatch([{
                distance: { x: 0, y: 0 },
                source: event
            }]);
            this._wheeling = true;
        },

        /**
         * Dispatches the MouseWheel end event, and handles related controls.
         * @param {object} event
         * @private
         */
        _dispatchMouseWheelEnd: function(event) {

            // Reset the delta array on MouseEnd to prevent false positives between
            // natural end and start events.
            deltaArray = [[],[]];

            this.onMouseWheelEnd.dispatch([{
                distance: { x: 0, y: 0 },
                source: event
            }]);
            this._wheeling = false;
        },


        /**
         * Perform a ReScroll dispatch, which currently means dispatch a MouseEnd event 
         * followed by a MouseStart event, to alert listeners that the user performed a
         * new distinct scroll event.  This could easily be refactored into a separate
         * observable if desired in the future.
         * @param {object} event
         * @private
         */
        _dispatchUserReScroll: function(event) {
            this._dispatchMouseWheelEnd(event);
            this._dispatchMouseWheelStart(event);
        },

        /**
         * Detect when the user performs a new scroll gesture.
         * @param {object} normalizedEvent
         * @private
         */
        _detectUserScroll: function(normalizedEvent) {

            /**
             * This is a helper function which takes in a set of consecutive linear data 
             * and tries to determine whether it is increasing or decreasing.  It can
             * operate on an entire array, or only a specified section of it. When given a
             * starting point and a length that extends outside the boundaries of the array,
             * the function assumes the data wraps around to the beginning of the array.
             * @param {Array.<number>} array The array of data to perform analysis on.
             * @param {number} arrayMaxLength [optional] The max length of the array.  If
             * not given, assumed to be array.length
             * @param {number} startAt [optional] The index in the array where the target 
             * data begins.  If not specified, assumes this index is 0.
             * @param {number} length [optional] The number of data points to examine.  
             * If not specified, assumed to be the entire array length.
             * @return {number} Returns:
                    1 if data appears to be increasing
                   -1 if data appears to be decreasing
                    0 if there is no discernable trend.
             */
            var calculateDeltaDirection = function(array,startAt,length,arrayMaxLength) {
                arrayMaxLength = arrayMaxLength || array.length;
                startAt = startAt || 0;
                length = length || arrayMaxLength;
                var total = 0;
                var offsetIdx1,offsetIdx2;
                for (var idx1 = 0; idx1 < length; idx1++) {
                    for (var idx2 = idx1+1; idx2 < length; idx2++) {
                        offsetIdx1 = (idx1+startAt) % arrayMaxLength;
                        offsetIdx2 = (idx2+startAt) % arrayMaxLength;
                        if (array[offsetIdx1] < array[offsetIdx2]) {
                            total += (1/(idx2-idx1));
                        }
                        if (array[offsetIdx1] > array[offsetIdx2]) {
                            total += (-1/(idx2-idx1));
                        }
                    }
                }
                if (total >= 1) {
                    return 1; // Increasing trend
                }
                if (total <= -1) {
                    return -1; // Decreasing trend
                }
                return 0; // Stable
            };

            /**
             * This is a helper function for detecting user scroll events.  The scroll deltas
             * will decay slowly over time, but they typically wont trend upwards again 
             * unless the user performs another scroll.  Thus, when the scroll deltas are 
             * trending downward and suddenly begin to increase, this is a strong indication 
             * of a user event.  This function works by detecting these increases preceded by
             * a normal decreasing trend.
             *
             * One advantage this method has is that it can detect nearly all user events.
             * One disadvantage this method has is that it can be slow, owing to the fact 
             * that it may take time (150ms+) to gather enough data before an upward trend is discernable.
             * @param {DELTA_INDEX} axis The axis on which to perform this check
             * @return {boolean} Returns true if conditions were satisfied to indicate the
             * user performed a scroll event, else false
             */
            var detectDeltaIncrease = function(axis) {
                var firstRange = getDeltaArrayIndex(-5);
                // Check the last 5 data points and determine if they are increasing
                if (calculateDeltaDirection(deltaArray[axis],firstRange,5,DELTA_ARRAY_SIZE) === 1) {
                    // Check the 5 data points prior to those and determine if they were decreasing
                    var secondRange = getDeltaArrayIndex(-10);
                    if (calculateDeltaDirection(deltaArray[axis],secondRange,5,DELTA_ARRAY_SIZE) === -1) {
                        return true;
                    }
                }
                return false;
            };

            /**
             * This is a helper function for detecting user scroll events.  When the user
             * performs a scroll (at least with a track pad), the scroll delta drops to 
             * nearly 0 before the new momentum is added to the scroll inertia. Because the 
             * inertia typically decays very slowly over time, a significant decrease in the 
             * scroll delta is a strong indication of a user event. This function works by 
             * detecting these negative spikes in the scroll delta.
             *
             * One advantage this method has is that it can detect events as soon as they 
             * occur because it does not take time to collect data.
             * One disadvantage this method has is that it cannot detect events when the 
             * the current inertia is below a certain threshold, including really light 
             * scrolls and scrolls made after the current scroll inertia has decayed a lot.
             * @param {DELTA_INDEX} axis The axis on which to perform this check
             * @return {boolean} Returns true if conditions were satisfied to indicate the
             * user performed a scroll event, else false
             */
            var detectNegativeSpike = function(axis) {
                var lastPoint = getDeltaArrayIndex(-1);
                // Check if the current event delta is low.  Nearly all of the negative spikes 
                // seem to reach between 0.5-2.5, so make sure the point is low enough
                if (deltaArray[axis][lastPoint] <= 5) {
                    var recentPoint2 = getDeltaArrayIndex(-2);
                    var recentPoint3 = getDeltaArrayIndex(-3);
                    // Check to see if the previous two points are significantly higher.
                    // Checks last TWO points instead of just last one because the deltas
                    // seem to be prone to intermittent noisy spikes which can create false
                    // positives.
                    if ((deltaArray[axis][recentPoint2] / deltaArray[axis][lastPoint] > 2 &&
                         deltaArray[axis][recentPoint2] - deltaArray[axis][lastPoint] > 2) &&
                        (deltaArray[axis][recentPoint3] / deltaArray[axis][lastPoint] > 2 &&
                         deltaArray[axis][recentPoint3] - deltaArray[axis][lastPoint] > 2)) {
                        return true;
                    }
                }
                return false;
            };

            // Store the newest data point in the history array, overwriting the oldest.
            deltaArray[DELTA_INDEX.y][deltaArrayIndex] = Math.abs(normalizedEvent.distance.y);
            deltaArray[DELTA_INDEX.x][deltaArrayIndex] = Math.abs(normalizedEvent.distance.x);
            deltaArrayIndex = (deltaArrayIndex+1) % DELTA_ARRAY_SIZE; // Increment index

            var detected =
                detectNegativeSpike(DELTA_INDEX.y) ||
                detectDeltaIncrease(DELTA_INDEX.y) ||
                detectNegativeSpike(DELTA_INDEX.x) ||
                detectDeltaIncrease(DELTA_INDEX.x);

            if (detected) {
                this._throttledDispatchUserReScroll(normalizedEvent.source);
            }
        }
    };

    return MouseAdapter;
});
