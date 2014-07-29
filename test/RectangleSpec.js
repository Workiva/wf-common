define(function(require) {
    'use strict';

    var Rectangle = require('wf-js-viewer/util/Rectangle');

    describe('Rectangle', function() {
        describe('#isPointInRectangle', function() {
            var rectCoords = {top: 10, bottom: 20, left: 30, right: 40};
            var rect;

            beforeEach(function() {
                rect = new Rectangle(rectCoords);
            });

            it('should return true when point is inside rectangle', function() {
                // compute a point at the center of the rectangle
                var pointInRect = {
                    x: rectCoords.left + (rectCoords.right - rectCoords.left) / 2,
                    y: rectCoords.top + (rectCoords.bottom - rectCoords.top) / 2
                };

                var hitTestResult = rect.isPointInRectangle(pointInRect);

                expect(hitTestResult).toEqual(true);
            });

            it('should return true when point is on top edge of rectangle', function() {
                // compute a point on top edge of the rectangle
                var pointOnEdgeOfRect = {
                    x: rectCoords.left + (rectCoords.right - rectCoords.left) / 2,
                    y: rectCoords.top
                };

                var hitTestResult = rect.isPointInRectangle(pointOnEdgeOfRect);

                expect(hitTestResult).toEqual(true);
            });

            it('should return true when point is on bottom edge of rectangle', function() {
                // compute a point on bottom edge of the rectangle
                var pointOnEdgeOfRect = {
                    x: rectCoords.left + (rectCoords.right - rectCoords.left) / 2,
                    y: rectCoords.bottom
                };

                var hitTestResult = rect.isPointInRectangle(pointOnEdgeOfRect);

                expect(hitTestResult).toEqual(true);
            });

            it('should return true when point is on left edge of rectangle', function() {
                // compute a point on left edge of the rectangle
                var pointOnEdgeOfRect = {
                    x: rectCoords.left,
                    y: rectCoords.top + (rectCoords.bottom - rectCoords.top) / 2
                };

                var hitTestResult = rect.isPointInRectangle(pointOnEdgeOfRect);

                expect(hitTestResult).toEqual(true);
            });

            it('should return true when point is on right edge of rectangle', function() {
                // compute a point on right edge of the rectangle
                var pointOnEdgeOfRect = {
                    x: rectCoords.right,
                    y: rectCoords.top + (rectCoords.bottom - rectCoords.top) / 2
                };

                var hitTestResult = rect.isPointInRectangle(pointOnEdgeOfRect);

                expect(hitTestResult).toEqual(true);
            });

            it('should return false when point is above rectangle', function() {
                // compute a point directly above the rectangle
                var pointAboveRect = {
                    x: rectCoords.left + (rectCoords.right - rectCoords.left) / 2,
                    y: rectCoords.top - 1
                };

                var hitTestResult = rect.isPointInRectangle(pointAboveRect);

                expect(hitTestResult).toEqual(false);
            });

            it('should return false when point is below rectangle', function() {
                // compute a point directly below the rectangle
                var pointBelowRect = {
                    x: rectCoords.left + (rectCoords.right - rectCoords.left) / 2,
                    y: rectCoords.bottom + 1
                };

                var hitTestResult = rect.isPointInRectangle(pointBelowRect);

                expect(hitTestResult).toEqual(false);
            });

            it('should return false when point is left of rectangle', function() {
                // compute a point directly left of the rectangle
                var pointLeftOfRect = {
                    x: rectCoords.left - 1,
                    y: rectCoords.top + (rectCoords.bottom - rectCoords.top) / 2
                };

                var hitTestResult = rect.isPointInRectangle(pointLeftOfRect);

                expect(hitTestResult).toEqual(false);
            });

            it('should return false when point is right of rectangle', function() {
                // compute a point directly right of the rectangle
                var pointRightOfRect = {
                    x: rectCoords.right + 1,
                    y: rectCoords.top + (rectCoords.bottom - rectCoords.top) / 2
                };

                var hitTestResult = rect.isPointInRectangle(pointRightOfRect);

                expect(hitTestResult).toEqual(false);
            });
        });
    });
});