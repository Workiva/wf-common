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

    var MouseAdapter = require('wf-js-common/MouseAdapter');

    describe('MouseAdapter', function() {

        var target = {
            addEventListener: function() {},
            removeEventListener: function() {}
        };

        var otherTarget = {
            addEventListener: function() {},
            removeEventListener: function() {}
        };

        var adapter;
        var normalizedEvent;

        beforeEach(function() {
            adapter = new MouseAdapter(target);

            adapter.onMouseWheel(function(evt) { normalizedEvent = evt; });
        });

        afterEach(function() {
            adapter.dispose();
            normalizedEvent = null;
        });

        it('should create and dispose', function() {
            expect(adapter._initialize).toBeDefined();
            expect(adapter._onMouseWheel).toBeDefined();
            expect(adapter.dispose).toBeDefined();

            spyOn(target, 'removeEventListener');
            adapter.dispose();
            expect(target.removeEventListener).toHaveBeenCalled();
        });

        it('should have inertia when speeding up along the X axis', function() {
            var event1 = {
                target: target,
                deltaX: 2,
                axis: 'x',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            var event2 = {
                target: target,
                deltaX: 10,
                axis: 'x',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            var event3 = {
                target: target,
                deltaX: 10,
                axis: 'x',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            adapter._onMouseWheel(event1);
            adapter._onMouseWheel(event2);
            adapter._onMouseWheel(event3);

            expect(normalizedEvent.distance.x).toBe(-10);
            expect(normalizedEvent.distance.y).toBeFalsy();
        });

        it('should have inertia when speeding up along the Y axis', function() {

            var event1 = {
                target: target,
                deltaY: 2,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            var event2 = {
                target: target,
                deltaY: 10,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            var event3 = {
                target: target,
                deltaY: 10,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            adapter._onMouseWheel(event1);
            adapter._onMouseWheel(event2);
            adapter._onMouseWheel(event3);

            expect(normalizedEvent.distance.x).toBeFalsy();
            expect(normalizedEvent.distance.y).toBe(-10);
        });

        it('should set deltas from detail if detail is defined', function() {

            var event1 = {
                target: target,
                detail: null,
                deltaY: 2,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            var event2 = {
                target: target,
                detail: null,
                deltaX: 2,
                axis: 'x',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            adapter._onMouseWheel(event1);
            adapter._onMouseWheel(event2);

            expect(normalizedEvent.distance.x).toBe(-2);
            expect(normalizedEvent.distance.y).toBeFalsy();
        });

        it('should not set deltas from detail if detail is not defined', function() {

            var event1 = {
                target: target,
                detail: 2,
                deltaY: null,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            var event2 = {
                target: target,
                detail: 2,
                deltaX: null,
                axis: 'x',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            adapter._onMouseWheel(event1);
            adapter._onMouseWheel(event2);

            expect(normalizedEvent.distance.x).toBe(-12);
            expect(normalizedEvent.distance.y).toBeFalsy();
        });

        it('no axis fall through', function() {
            var mouseAdapter = new MouseAdapter(target);

            var event1 = {
                target: target,
                detail: 1,
                axis: '',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            mouseAdapter._onMouseWheel(event1);

            expect(normalizedEvent).toBe(null);
        });

        it('no original deltaX or deltaY fall through', function() {

            var event1 = {
                target: target,
                deltaY: null,
                deltaX: null,
                axis: '',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            adapter._onMouseWheel(event1);

            expect(normalizedEvent.distance.x).toBe(0);
            expect(normalizedEvent.distance.y).toBe(0);
        });

        it('should use wheelDeltaX if defined', function() {

            var event1 = {
                target: target,
                wheelDeltaX: 1,
                axis: 'x',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            adapter._onMouseWheel(event1);

            expect(normalizedEvent.distance.x).toBe(0.16666666666666666);
            expect(normalizedEvent.distance.y).toBe(0);
        });

        it('should use wheelDeltaY if defined', function() {

            var event1 = {
                target: target,
                wheelDeltaY: 1,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            adapter._onMouseWheel(event1);

            expect(normalizedEvent.distance.x).toBe(0);
            expect(normalizedEvent.distance.y).toBe(0.16666666666666666);
        });

        it('no target fall through', function() {

            var event1 = {
                target: otherTarget,
                detail: 1,
                axis: 'x',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            adapter._onMouseWheel(event1);

            expect(normalizedEvent).toBe(null);
        });

        it('should dispatch "onMouseWheelStart" ', function() {
            spyOn(adapter.onMouseWheelStart, 'dispatch');
            var evt = {
                target: target,
                wheelDeltaY: 1,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };
            adapter._onMouseWheel(evt);
            expect(adapter.onMouseWheelStart.dispatch).toHaveBeenCalledWith([{
                distance: { x: 0, y: 0 },
                source: evt
            }]);
        });

        it('should dispatch "onMouseWheelEnd" 50ms after the last mouse wheel', function() {
            spyOn(adapter.onMouseWheelEnd, 'dispatch');
            var evt = {
                target: target,
                wheelDeltaY: 1,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };
            adapter._onMouseWheel(evt);
            waits(50);
            runs(function() {
                expect(adapter.onMouseWheelEnd.dispatch).toHaveBeenCalledWith([{
                    distance: { x: 0, y: 0 },
                    source: evt
                }]);
            });
        });
    });
});
