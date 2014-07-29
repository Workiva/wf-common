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

        // Make the rectangle sane.
        if (this.left > this.right) {
            var oldLeft;
            oldLeft = this.left;
            this.left = this.right;
            this.right = oldLeft;
        }
        if (this.top > this.bottom) {
            var oldTop;
            oldTop = this.top;
            this.top = this.bottom;
            this.bottom = oldTop;
        }

    };

    Rectangle.prototype = {

        // CR - what might be a better name for shape?  points aren't really shapes
        // But, shapeOrPoint is icky, and thing is too generic.
        /**
         * Checks to see if shape is in the rectangle.  Shape can only be a point right now.
         * @param  {Object} shape - Possible shapes:
         *   * point - {{x:Number, y:Number}}
         * @return {Boolean} true if shape is in the rectangle, false if not in rectangle or if invalid shape.
         */
        contains: function(shape) {
            var ret = false;
            if (shape) {
                if (shape.x && shape.y) {
                    ret = this._containsPoint(shape);
                }
            }
            return ret;
        },
        /**
         * Tests whether a point falls within the rectangle
         * @param {{x:Number, y:Number}} point
         */
        _containsPoint: function(point) {
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
