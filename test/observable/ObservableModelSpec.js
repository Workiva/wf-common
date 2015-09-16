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

define([
    'wf-js-common/observable/ObservableModel',
    'wf-js-common/Observable'
], function(
    ObservableModel,
    Observable
) {
    'use strict';

    var MyCoolClass = function() {
        this.name = 'MyCoolClass';
        this.year = null;
        this.somethingElse = null;
        this.onChanged = Observable.newObservable();
    };

    ObservableModel.initialize(MyCoolClass.prototype, ['name', 'year']);

    describe('ObservableModel', function() {
        it('dispatch observers when bindable properties change.', function() {
            var myCoolClass1 = new MyCoolClass();

            var listener = jasmine.createSpyObj('listener', ['onChangedHandler']);

            myCoolClass1.onChanged(listener.onChangedHandler);

            myCoolClass1.name = 'A Different Name';

            expect(listener.onChangedHandler)
                .toHaveBeenCalledWith(myCoolClass1, 'name', 'MyCoolClass', 'A Different Name');

            myCoolClass1.year = 1;
            myCoolClass1.year = 2;
            expect(listener.onChangedHandler)
                .toHaveBeenCalledWith(myCoolClass1, 'year', null , 1);
            expect(listener.onChangedHandler)
                .toHaveBeenCalledWith(myCoolClass1, 'year', 1, 2);


            var myCoolClass2 = new MyCoolClass();
            myCoolClass2.year = 3;
            expect(myCoolClass2.year).toEqual(3);

            expect(myCoolClass1.year).toEqual(2);
            expect(myCoolClass2.year).toEqual(3);


            myCoolClass2.disableChangedPropagation();
            var changeDispatched = false;
            myCoolClass2.onChanged(function() {
                changeDispatched = true;
            });
            myCoolClass2.year = 100;
            expect(changeDispatched).toBeFalsy();
            myCoolClass2.enableChangedPropagation();
            myCoolClass2.year = 50;
            expect(changeDispatched).toBeTruthy();
        });

        it('should not dispatch observer if property does not change', function() {
            var myCoolObject = new MyCoolClass();
            myCoolObject.name = 'Initial Name';
            var dispatched = false;
            myCoolObject.onChanged(function() {
                dispatched = true;
            });
            myCoolObject.name = 'Initial Name';
            expect(dispatched).toBeFalsy();
        });

        it('should throw an error if making an observable keyword bindable: onChange', function() {
            var DummyClass = function() {
            };
            expect(function() {
                ObservableModel.initialize(DummyClass.prototype, ['onChange']);
            })
                .toThrow();
        });

        it('should throw an error if the target object has a psuedo private defined that matches a bindable ' +
            'property', function() {
            var dummyObject = {
                _name: 'A Name'
            };
            expect(function() {
                ObservableModel.initialize(dummyObject, ['name']);
            })
                .toThrow();
        });

        it('should throw an error if attempting to make a setter/getter pair on a property ' +
            'that is already defined privately.', function() {
//            var ThrowingClass
        });
    });
});
