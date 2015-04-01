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
    'wf-js-common/Observable',
    'wf-js-common/observable/Collection',
    'wf-js-common/observable/ObservableModel'
], function(
    Observable,
    Collection,
    ObservableModel
) {
    'use strict';


    //-------------------------------------------------------------------------
    // DUMMY OBJECT FOR TESTING
    /**
     * These are the properties that when set will dispatch an onChanged.
     * @type {Array}
     */
    var BINDABLE_PROPERTIES = ['scopes', 'comments', 'semanticAnchors', 'state', 'selected', 'shared'];

    var Annotation = function() {
        // TODO - this is ugly as sin. This should be done in ObservableModel.initialize.
        this.onChanged = Observable.newObservable();
    };

    var prototype = {
    };


    prototype = ObservableModel.initialize(prototype, BINDABLE_PROPERTIES);

    Annotation.prototype = prototype;
    //-------------------------------------------------------------------------


    var EVENTS = Collection.EVENTS;
    describe('Collection', function() {

        it('should instantiate.', function() {
            expect(new Collection()).toBeDefined();
        });

        it('should dispose', function() {
            expect(function() {new Collection().dispose();}).not.toThrow();
        });

        it('should take a source array as a constructor parameter.', function() {
            var source = ['a','b','c'];
            var collection = new Collection(source);
            expect(collection.getItemAt(0)).toEqual('a');
        });

        describe('provides collection events and', function() {
            var collection, listener;
            beforeEach(function() {
                collection = new Collection();
                listener = jasmine.createSpyObj('collectionListener', ['onChangedHandler']);
                collection.onChanged(listener.onChangedHandler);
            });

            it('should emit an ITEM_ADDED event when an item is added', function() {
                collection.append('a value');
                expect(listener.onChangedHandler).toHaveBeenCalledWith(
                    collection, EVENTS.ITEM_ADDED, 'a value'
                );
            });

            it('should emit an ITEM_REMOVED event when an item is removed', function() {
                collection.append('a value');
                collection.remove('a value');
                expect(listener.onChangedHandler).toHaveBeenCalledWith(
                    collection, EVENTS.ITEM_ADDED, 'a value'
                );
                expect(listener.onChangedHandler).toHaveBeenCalledWith(
                    collection, EVENTS.ITEM_REMOVED, 'a value'
                );
            });

            it('should remove only the specified item', function() {
                collection.append('a value');
                collection.append('b value');
                collection.append('c value');

                expect(collection.sizeOf()).toEqual(3);
                expect(collection._collection).toEqual(['a value','b value','c value']);

                collection.remove('b value');

                expect(collection.sizeOf()).toEqual(2);
                expect(collection._collection).toEqual(['a value','c value']);
            });

            it('should return index of given value', function() {
                collection.append('a value');
                collection.append('b value');

                expect(collection.indexOf('a value')).toEqual(0);

            });

            it('should return -1 if value is not in collection', function() {
                collection.append('a value');
                collection.append('b value');

                expect(collection.indexOf('z value')).toEqual(-1);
            });

            it('should emit a RESET event when it is reset', function() {
                collection.reset(['a', 'b', 'c']);
                expect(listener.onChangedHandler).toHaveBeenCalledWith(
                    collection, EVENTS.RESET, ['a', 'b', 'c']
                );
            });
        });

        describe('provides change watching of child events', function() {
            it('should emit an ITEM_CHANGED event when a item is changed', function() {
                var annotation = new Annotation();
                var collection = new Collection();
                var testRun = false;
                collection.append(annotation);
                collection.onChanged(function(col, event, itemChangedValues) {
                    if (testRun) {
                        return;
                    }

                    testRun = true;
                    expect(col).toEqual(collection);
                    expect(event).toEqual(EVENTS.ITEM_CHANGED);
                    expect(itemChangedValues[1]).toEqual('scopes');
                    expect(itemChangedValues[3]).toEqual(['a new scope']);
                });
                annotation.scopes = ['a new scope'];
                collection.remove(annotation);
                var wasRunAfterRemoved = false;
                collection.onChanged(function(/* col, event, itemChangedValues */) {
                    wasRunAfterRemoved = true;
                });
                annotation.scopes = ['something else'];
                expect(wasRunAfterRemoved).toBeFalsy();
            });
        });

        describe('checks collection methods', function() {
            it('should empty an instantiated collection', function() {
                var collection = new Collection(['item1', 'item2', 'item3']);
                collection.empty();
                expect(collection._collection.length).toBe(0);
            });

            it('should reset an instantiated collection', function() {
                var collection = new Collection(['item1', 'item2', 'item3']);
                collection.reset(['item1', 'item2', 'item3', 'item4']);
                expect(collection._collection.length).toBe(4);
            });

            it('should _append an item', function() {
                var collection = new Collection();
                var item = 'item';
                collection._append(item);
                expect(collection._collection.length).toBe(1);
            });
        });
    });
});
