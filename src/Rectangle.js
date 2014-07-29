define(function() {
    'use strict';

    /**
     * Represents a basic rectangle and provides a method to determine if a
     * point is inside it.
     *
     * @name Rectangle
     * @class
     * @constructor
     *
     * @param {Object} rectCoords
     * @param {Number} rectCoords.top
     * @param {Number} rectCoords.left
     * @param {Number} rectCoords.bottom
     * @param {Number} rectCoords.right
     */
    var Rectangle = function(rectCoords) {
        this.top = rectCoords.top;
        this.left = rectCoords.left;
        this.bottom = rectCoords.bottom;
        this.right = rectCoords.right;
    };

    Rectangle.prototype = {

        /**
         * Tests whether a point falls within the rectangle
         * @param {{x:Number, y:Number}} point
         */
        isPointInRectangle : function(point) {
            var x = point.x;
            var y = point.y;

            return (this.left <= x && x <= this.right &&
                this.top <= y && y <= this.bottom);
        }

    };

    return Rectangle;
});