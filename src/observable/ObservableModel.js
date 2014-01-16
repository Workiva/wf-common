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

define([
    'wf-js-common/Observable'
], function(
    Observable
) {
    'use strict';

    function disableChangedPropagation() {
        /* jshint validthis: true */
        this._dispatchChangedEvents = false;
    }
    function enableChangedPropagation() {
        /* jshint validthis: true */
        this._dispatchChangedEvents = true;
    }

    /**
     * Returns a 'getter' function that is suitable to be applied to a prototype
     * or a particular object.
     *
     * Given a property name 'x' it will assume that the this object of the
     * function scope has a property named _x.
     *
     * @param {string} propertyName The name of the getter.
     * @returns {Function} Returns the getter function.
     */
    function getGetterFunction(propertyName) {
        return function() {
            // Simply returns the 'private' value.
            return this['_' + propertyName];
        };
    }

    /**
     * Returns a 'setter' function that is suitable to be applied to a prototype
     * or a particular object.
     *
     * This setter function will dispatch on the onChanged observable of the
     * 'this' object of the function.
     *
     * If the onChanged observable does not exist, the setter function will
     * first create it.
     *
     * @param {string} propertyName
     * @returns {Function}
     */
    function getSetterFunction(propertyName) {
        return function(value) {
            var originalValue = this['_' + propertyName];

            // If value hasn't changed
            if (originalValue === value) { return; }

            this['_' + propertyName] = value;

            if (!this.onChanged) {
                this.onChanged = Observable.newObservable();
            }

            if (!this.hasOwnProperty('_dispatchChangedEvents') ||
                 this._dispatchChangedEvents) {

                this.onChanged.dispatch([this, propertyName, originalValue, value]);
            }
        };
    }

    return {
        /**
         * Given a target object and a list of property names, initialize will
         * add observable triggering getter/setter property functions.
         *
         * @example
         * var MyObject = function() {
         *     this.onChanged = new Observable();
         * };
         *
         * ObservableModel.initialize(MyObject.prototype, ['name', 'address1']);
         *
         * var myObject1 = new MyObject();
         * myObject.onChanged(function(source, propName, oldValue, newValue) {
         *     alert(propName + ' value changed from ' + oldValue + ' to ' + newValue);
         * });
         *
         * myObject1.name = 'The Name!';
         *
         *
         * @param {object} targetObject
         * @param {Array<String>} bindableProperties
         */
        initialize: function(targetObject, bindableProperties) {
            var propertyName;
            for (var idx = 0; idx < bindableProperties.length; idx++) {
                propertyName = bindableProperties[idx];

                if (targetObject['_' + propertyName]) {
                    throw new Error('ObservableModel property conflict: ' + propertyName);
                }

                if (propertyName === 'onChange') {
                    throw new Error('ObservableModel.initialize should not be called with a bindable property of' +
                        'onChange.');
                }

                Object.defineProperty(targetObject, propertyName, {
                    get: getGetterFunction(propertyName),
                    set: getSetterFunction(propertyName)
                });

                targetObject.disableChangedPropagation = disableChangedPropagation;
                targetObject.enableChangedPropagation = enableChangedPropagation;
            }
            return targetObject;
        }
    };
});