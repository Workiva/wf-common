define(function(require) {
    'use strict';

    var Rectangle = require('wf-js-common/Rectangle');


    describe('Rectangle', function() {
        var rectCoords = {top: 10, bottom: 20, left: 30, right: 40};
        var rect = new Rectangle(rectCoords);

        it('should return an accurate width', function() {
            var ourWidth = rectCoords.right - rectCoords.left;
            expect(rect.getWidth()).toEqual(ourWidth);
        });
        it('should return an accurate height', function() {
            var ourHeight = rectCoords.bottom - rectCoords.top;
            expect(rect.getHeight()).toEqual(ourHeight);
        });

        describe('handles bad input well', function() {
            var badRectCoords = {top: 20, bottom: 10, left: 40, right: 30};
            var fixedRect = new Rectangle(badRectCoords);

            it('should reverse left and right when left > right', function() {
                expect(fixedRect.left).toEqual(30);
                expect(fixedRect.right).toEqual(40);
            });

            it('should reverse top and bottom when top > bottom', function() {
                expect(fixedRect.top).toEqual(10);
                expect(fixedRect.bottom).toEqual(20);
            });

            it('should return false if we pass in a bogus shape', function() {
                var badShape = {};

                var hitTestResult = fixedRect.contains(badShape);

                expect(hitTestResult).toEqual(false);
            });
        });

        describe('contains point', function() {

            it('should return true when point is inside rectangle', function() {
                // compute a point at the center of the rectangle
                var pointInRect = {
                    x: rect.left + rect.getWidth() / 2,
                    y: rect.top + rect.getHeight() / 2
                };

                var hitTestResult = rect.contains(pointInRect);

                expect(hitTestResult).toEqual(true);
            });

            it('should return true when point is on top edge of rectangle', function() {
                // compute a point on top edge of the rectangle
                var pointOnEdgeOfRect = {
                    x: rect.left + rect.getWidth() / 2,
                    y: rect.top
                };

                var hitTestResult = rect.contains(pointOnEdgeOfRect);

                expect(hitTestResult).toEqual(true);
            });

            it('should return true when point is on bottom edge of rectangle', function() {
                // compute a point on bottom edge of the rectangle
                var pointOnEdgeOfRect = {
                    x: rect.left + rect.getWidth() / 2,
                    y: rect.bottom
                };

                var hitTestResult = rect.contains(pointOnEdgeOfRect);

                expect(hitTestResult).toEqual(true);
            });

            it('should return true when point is on left edge of rectangle', function() {
                // compute a point on left edge of the rectangle
                var pointOnEdgeOfRect = {
                    x: rect.left,
                    y: rect.top + rect.getHeight() / 2
                };

                var hitTestResult = rect.contains(pointOnEdgeOfRect);

                expect(hitTestResult).toEqual(true);
            });

            it('should return true when point is on right edge of rectangle', function() {
                // compute a point on right edge of the rectangle
                var pointOnEdgeOfRect = {
                    x: rect.right,
                    y: rect.top + rect.getHeight() / 2
                };

                var hitTestResult = rect.contains(pointOnEdgeOfRect);

                expect(hitTestResult).toEqual(true);
            });

            it('should return false when point is above rectangle', function() {
                // compute a point directly above the rectangle
                var pointAboveRect = {
                    x: rect.left + rect.getWidth() / 2,
                    y: rect.top - 1
                };

                var hitTestResult = rect.contains(pointAboveRect);

                expect(hitTestResult).toEqual(false);
            });

            it('should return false when point is below rectangle', function() {
                // compute a point directly below the rectangle
                var pointBelowRect = {
                    x: rect.left + rect.getWidth() / 2,
                    y: rect.bottom + 1
                };

                var hitTestResult = rect.contains(pointBelowRect);

                expect(hitTestResult).toEqual(false);
            });

            it('should return false when point is left of rectangle', function() {
                // compute a point directly left of the rectangle
                var pointLeftOfRect = {
                    x: rect.left - 1,
                    y: rect.top + rect.getHeight() / 2
                };

                var hitTestResult = rect.contains(pointLeftOfRect);

                expect(hitTestResult).toEqual(false);
            });

            it('should return false when point is right of rectangle', function() {
                // compute a point directly right of the rectangle
                var pointRightOfRect = {
                    x: rect.right + 1,
                    y: rect.top + rect.getHeight() / 2
                };

                var hitTestResult = rect.contains(pointRightOfRect);

                expect(hitTestResult).toEqual(false);
            });
        });
    });
});
