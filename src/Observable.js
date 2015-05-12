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

define(function() {
    'use strict';

    /**
     * Services the callbacks
     * @method
     * @param {Array.<Function>} callbacks
     * @param {Array} parameters
     * @param {Object} thisObj
     * @param {function} [observed]
     */
    function signalObservers(callbacks, parameters, thisObj, observed) {
        var result;
        var loopList = [];

        var i, len;
        for (i = 0, len = callbacks.length; i < len; i++) {
            loopList.push(callbacks[i]);
        }

        for (i = 0, len = loopList.length; i < len; i++) {
            var callback = loopList[i];
            result = callback.apply(thisObj, parameters);
            // If observed callback is present,
            // pass along the return value from the observer.
            // This can be useful for providing a cancellation token.
            if (observed) {
                observed(result);
            }
        }
    }


    var count = 0;
    /**
     * @classdesc
     * A typical observer module.
     * The observable function should not be called new,
     * but instead be called as a factory function.
     *
     * @exports Observable
     */
    var Observable = {
        /**
         * Creates a new Observable
         *
         * @method
         * @param {Object} object - for objects scope
         * @returns {Function}
         *
         * @example
         * // create a new observable
         * var onEvent = Observable.newObservable();
         *
         * @example
         * // add a subscriber
         * onEvent(function subscriber() {});
         *
         * @example
         * // dispatch to subscribers
         * onEvent.dispatch();
         *
         * @example
         * // dispatch on the dispatch call of another observable
         * newEvent.dispatchOn(onEvent);
         *
         * @example
         * // disposes the observable
         * onEvent.dispose();
         *
         * @example
         * // remove the subscriber from the observable
         * onEvent.remove(subscriber);
         */
        newObservable: function(object) {



            var callbacks = [];

            /**
             * The observable function.
             * @param {Function} fn
             */
            var observable = function(fn) {
                callbacks.push(fn);
            };

            observable.id = count++;

            //---------------------------------------------------------
            // JSDoc will fail if the following are documented.
            // Use plain comments instead.
            //---------------------------------------------------------

            // Dispatches to subscribers.
            observable.dispatch = function(parameters, observed) {
                parameters = [].concat(parameters);
                signalObservers(callbacks, parameters, object, observed);
            };

            // Dispatches on the dispatch call of another observable.
            observable.dispatchOn = function(obs) {
                obs(observable.dispatch);

                return observable;
            };

            // Disposes the observable.
            observable.dispose = function() {
                callbacks = null;
            };

            // Removes the subscriber from the observable.
            observable.remove = function(fn) {
                var index = callbacks.indexOf(fn);

                if (index >= 0) {
                    callbacks.splice(index, 1);
                }
            };

            return observable;
        }
    };

    return Observable;
});
