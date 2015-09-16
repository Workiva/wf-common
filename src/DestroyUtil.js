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

define(function() {
    'use strict';

    /**
     * @classdesc
     * Provides destruction functions to decrease the load
     * on the browser's garbage collection algorithm.
     *
     * @exports DestroyUtil
     */
    var DestroyUtil = {
        /**
         * Given target object this function will assign a null value on all of
         * it's properties.
         * @method
         * @param {object} obj - Target object to extinguish
         */
        destroy: function(obj) {
            for (var prop in obj) {
                // We only want to null out properties on instance (not in
                // prototype)
                if (obj.hasOwnProperty(prop)) {

                    // Per guidance here ->
                    // http://coding.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/
                    // we just null out value (which actually shouldn't be
                    // necessary - but we're going to err on side of caution for now
                    obj[prop] = null;
                }
            }
            obj._disposed = true;
        }
    };

    return DestroyUtil;
});
