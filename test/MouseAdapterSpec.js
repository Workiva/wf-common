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

    var MouseAdapter = require('wf-js-common/MouseAdapter');

    describe('MouseAdapter', function() {

        var target = {
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
                currentTarget: target,
                deltaX: 2,
                axis: 'x',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            var event2 = {
                currentTarget: target,
                deltaX: 10,
                axis: 'x',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            var event3 = {
                currentTarget: target,
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
                currentTarget: target,
                deltaY: 2,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            var event2 = {
                currentTarget: target,
                deltaY: 10,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            var event3 = {
                currentTarget: target,
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
                currentTarget: target,
                detail: null,
                deltaY: 2,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            var event2 = {
                currentTarget: target,
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
                currentTarget: target,
                detail: 2,
                deltaY: null,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            var event2 = {
                currentTarget: target,
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
                currentTarget: target,
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
                currentTarget: target,
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
                currentTarget: target,
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
                currentTarget: target,
                wheelDeltaY: 1,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };

            adapter._onMouseWheel(event1);

            expect(normalizedEvent.distance.x).toBe(0);
            expect(normalizedEvent.distance.y).toBe(0.16666666666666666);
        });

        it('should dispatch "onMouseWheelStart" ', function() {
            spyOn(adapter.onMouseWheelStart, 'dispatch');
            var evt = {
                currentTarget: target,
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

        it('should dispatch "onMouseWheelEnd" 90ms after the last mouse wheel', function() {
            spyOn(adapter.onMouseWheelEnd, 'dispatch');
            var evt = {
                currentTarget: target,
                wheelDeltaY: 1,
                axis: 'y',
                HORIZONTAL_AXIS: 'x',
                VERTICAL_AXIS: 'y'
            };
            adapter._onMouseWheel(evt);
            waits(90);
            runs(function() {
                expect(adapter.onMouseWheelEnd.dispatch).toHaveBeenCalledWith([{
                    distance: { x: 0, y: 0 },
                    source: evt
                }]);
            });
        });

        describe('user scroll detection', function() {

            describe('_calculateDeltaDirection', function() {
                it('should detect an increasing trend in the data', function() {
                    expect(adapter._calculateDeltaDirection([1, 2, 3, 4, 5])).toBe(1);
                    expect(adapter._calculateDeltaDirection([1, 1, 1, 2, 2])).toBe(1);
                    expect(adapter._calculateDeltaDirection([-10, -8, -9, -7, -8])).toBe(1);
                });

                it('should detect a decreasing trend in the data', function() {
                    expect(adapter._calculateDeltaDirection([5, 4, 3, 2, 1])).toBe(-1);
                    expect(adapter._calculateDeltaDirection([2, 2, 1, 1, 1])).toBe(-1);
                    expect(adapter._calculateDeltaDirection([-8, -7, -9, -8, -10])).toBe(-1);
                });

                it('should detect a stable trend in the data', function() {
                    expect(adapter._calculateDeltaDirection([99, 99, 99, 99, 99])).toBe(0);
                    expect(adapter._calculateDeltaDirection([1, 2, 1, 2, 1])).toBe(0);
                    expect(adapter._calculateDeltaDirection([10, 9, 5, 9, 10])).toBe(0);
                });

                it('should begin at the specified offset when passed in', function() {
                    expect(adapter._calculateDeltaDirection([1, 1, 1, 1, 2, 2, 2, 2], 0)).toBe(1);
                    expect(adapter._calculateDeltaDirection([1, 1, 1, 1, 2, 2, 2, 2], 4)).toBe(-1);
                });

                it('should stop at the specified length when passed in', function() {
                    expect(adapter._calculateDeltaDirection([1, 1, 1, 1, 2, 2, 2, 2], 0, 4)).toBe(0);
                    expect(adapter._calculateDeltaDirection([1, 1, 1, 1, 2, 2, 2, 2], 4, 4)).toBe(0);
                });

            });

            describe('_detectNegativeSpike', function() {
                // Test arrays in this block should be of size MouseAdapter.DELTA_ARRAY_SIZE,
                // representing mouse event deltas received in chronological order from index 0.

                it('should detect sufficiently steep negative spikes in data', function() {
                    expect(adapter._detectNegativeSpike([63.5, 62, 59, 110, 49.5, 45, 41, 37.5, 34.5, 0.5])).toBe(true);
                    expect(adapter._detectNegativeSpike([29, 26.5, 24, 21.5, 20, 18, 32, 14, 13, 0.5])).toBe(true);
                    expect(adapter._detectNegativeSpike([6, 5.5, 5, 5, 4.5, 4, 3.5, 3, 3, 0.5])).toBe(true);
                });

                it('should not react to noisy spikes in data', function() {
                    expect(adapter._detectNegativeSpike([30, 63.5, 65.5, 136, 66.5, 63.5, 62, 59, 110, 49.5])).toBe(false);
                    expect(adapter._detectNegativeSpike([6, 5.5, 5, 5, 4.5, 4, 3.5, 3, 10, 2])).toBe(false);
                });
            });

            describe('_detectDeltaIncrease', function() {
                // Test arrays in this block should be of size MouseAdapter.DELTA_ARRAY_SIZE,
                // representing mouse event deltas received in chronological order from index 0.

                it('should detect increasing trends in data that are preceded by a decreasing trend', function() {
                    expect(adapter._detectDeltaIncrease([9, 22, 6, 6, 5.5, 5, 4.5, 4, 6.5, 10.33333333])).toBe(true);
                    expect(adapter._detectDeltaIncrease([2.5, 2.5, 2, 2, 2, 1.5, 0.5, 2.5, 3, 3.5])).toBe(true);
                });

                it('should not react to increasing trends in data that are NOT preceded by a decreasing trend', function() {
                    expect(adapter._detectDeltaIncrease([8, 9, 16, 17.5, 19, 19, 25, 54, 56.5, 58.5])).toBe(false);
                    expect(adapter._detectDeltaIncrease([19, 26, 26.5, 29.5, 32, 34, 26.5, 40.5, 19, 72.5])).toBe(false);
                });
            });

            describe('_detectUserScroll', function() {

                function testUserScrollDetection(array, shouldBeDetected) {
                    adapter = new MouseAdapter(target);
                    spyOn(adapter, '_throttledDispatchUserReScroll');

                    for ( var idx = 0; idx < array.length; idx++ ) {
                        adapter._detectUserScroll({
                            distance: {
                                x: 0,
                                y: array[idx]
                            },
                            source: 'UnitTest'
                        });
                    }
                    if (shouldBeDetected) {
                        expect(adapter._throttledDispatchUserReScroll).toHaveBeenCalled();
                    }
                    else {
                        expect(adapter._throttledDispatchUserReScroll).not.toHaveBeenCalled();
                    }
                    adapter.dispose();
                }

                it('should emit events when User-scroll is detected', function() {
                    // This section includes all of the test data from the previous detection sections which
                    // should be detected successfully.
                    testUserScrollDetection([63.5, 62, 59, 110, 49.5, 45, 41, 37.5, 34.5, 0.5], true);
                    testUserScrollDetection([29, 26.5, 24, 21.5, 20, 18, 32, 14, 13, 0.5], true);
                    testUserScrollDetection([6, 5.5, 5, 5, 4.5, 4, 3.5, 3, 3, 0.5], true);
                    testUserScrollDetection([9, 22, 6, 6, 5.5, 5, 4.5, 4, 6.5, 10.33333333], true);
                    testUserScrollDetection([2.5, 2.5, 2, 2, 2, 1.5, 0.5, 2.5, 3, 3.5], true);

                    // And a couple more
                    testUserScrollDetection([10.33333333, 10, 9.5, 9.5, 9, 8, 20.5, 6, 5.5, 5, 4.5, 4, 3.5, 3.5, 0.5, 3.5, 5, 75.5, 34.5, 31.5], true);
                    testUserScrollDetection([6, 5.5, 5, 4.5, 4, 3.5, 3.5, 3, 3, 2.5, 2.5, 2.5, 2, 0.5, 2, 3, 3.5, 7, 6.5, 13], true);
                });

                it('should not emit events when User-scroll is not detected', function() {
                    // This section includes all of the test data from the previous detection sections which
                    // should not trigger events
                    testUserScrollDetection([30, 63.5, 65.5, 136, 66.5, 63.5, 62, 59, 110, 49.5], false);
                    testUserScrollDetection([6, 5.5, 5, 5, 4.5, 4, 3.5, 3, 10, 2], false);
                    testUserScrollDetection([8, 9, 16, 17.5, 19, 19, 25, 54, 56.5, 58.5], false);
                    testUserScrollDetection([19, 26, 26.5, 29.5, 32, 34, 26.5, 40.5, 19, 72.5], false);

                    // And a couple more
                    testUserScrollDetection([25, 19.5, 25.5, 26.5, 26.5, 19, 18, 52.5, 51.5, 52, 51.5, 50, 48.5, 47, 45.5, 41.83333333, 38, 34.5, 31.5, 29], false);
                    testUserScrollDetection([1.5, 2 ,3 ,4, 5, 6.5, 10.33333333, 12, 16.5, 20.5, 16.5, 22, 29, 93, 23.5, 18, 25.5, 51, 51.5, 51.5], false);
                });

            });
        });
    });
});
