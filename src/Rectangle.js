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

        // If we implement more functionality, http://paperjs.org/reference/rectangle/
        // would be a good reference.

        // The empty default object gets values below.
        rectCoords = rectCoords || { };

        this.top = rectCoords.top || 0;
        this.left = rectCoords.left || 0;
        this.bottom = rectCoords.bottom || 0;
        this.right = rectCoords.right || 0;
    };

    Rectangle.prototype = {

        /**
         * Tests whether a point falls within the rectangle
         * @param {{x:Number, y:Number}} point
         */
        contains: function(point) {
            var x = point.x;
            var y = point.y;

            return (this.left <= x && x <= this.right &&
                this.top <= y && y <= this.bottom);
        },
        getWidth: function() {
            return this.right - this.left;
        },
        getHeight: function() {
            return this.bottom - this.top;
        }

    };

    return Rectangle;
});
