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

    var EVENTS = {
        ITEM_ADDED: 'itemAdded',
        ITEM_REMOVED: 'itemRemoved',
        ITEM_CHANGED: 'itemChanged',
        RESET: 'reset'
    };

    // Very simple dispatching collection. Need to evaluate what we want to do
    // - this is very similar to backbone (but with stronger typing (perhaps)
    // and Flex ArrayCollection.
    // Some advantages because this would allow 'strong' typing of change signals.
    // bc of observable).
    // Ideas - map in _ collection functions (again like backbone)
    var Collection = function(list) {
        this.onChanged = Observable.newObservable();
        this._collection = list || [];
        var self = this;
        this._onItemChangedHandlerBound = function(item, propertyName, oldValue, newValue) {
            self._onItemChangedHandler(item, propertyName, oldValue, newValue);
        };
    };

    Collection.prototype = {
        append: function(item) {
            this._append(item);
            this.onChanged.dispatch([this, EVENTS.ITEM_ADDED, item]);
        },
        remove: function(item) {
            if (item === null || item === undefined) {
                return;
            }
            var index = this._collection.indexOf(item);
            if (index >= 0) {
                this._remove(item);
                this._collection.splice(index, 1);
                this.onChanged.dispatch([this, EVENTS.ITEM_REMOVED, item]);
            }
        },
        reset: function(items) {
            for (var s = 0; s < this._collection.length; s++) {
                this._remove(this._collection[s]);
            }
            this._collection = [];
            for (var i = 0; i < items.length; i++) {
                this._append(items[i]);
            }
            this.onChanged.dispatch([this, EVENTS.RESET, items]);
        },
        empty: function() {
            for (var s = 0; s < this._collection.length; s++) {
                this._remove(this._collection[s]);
            }
            this._collection = [];
            this.onChanged.dispatch();
        },
        _append: function(item) {
            this._collection.push(item);
            if (item.hasOwnProperty('onChanged')) {
                item.onChanged(this._onItemChangedHandlerBound);
            }
        },
        _remove: function(item) {
            if (item.hasOwnProperty('onChanged')) {
                item.onChanged.remove(this._onItemChangedHandlerBound);
            }
        },
        getItemAt: function(idx) {
            return this._collection[idx];
        },
        sizeOf: function() {
            return this._collection.length;
        },
        indexOf: function(item) {
            return this._collection.indexOf(item);
        },
        _onItemChangedHandler: function(item, property, oldValue, newValue) {
            this.onChanged.dispatch([this, EVENTS.ITEM_CHANGED, [item, property, oldValue, newValue]]);
        },
        dispose: function() {
            this.onChanged.dispose();
            this._onItemChangedHandlerBound = null;
            this._collection = null;
        },
        toArray: function() {
            return this._collection;
        }
    };

    Collection.EVENTS = EVENTS;

    return Collection;
});
