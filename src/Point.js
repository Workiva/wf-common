define(function() {
    'use strict';

    /**
     * Represents a screen point
     *
     * @name Point
     * @class
     * @constructor
     *
     * @param {Number} x The x position of the point
     * @param {Number} y The y position of the point
     */
    var Point = function(x, y) {
        // If we implement more functionality, http://paperjs.org/reference/point/
        // would be a good reference or replacement.

        this.x = x;
        this.y = y;
    };

    Point.prototype = {

        /**
         * Determines the shortest distance to another point.
         * @param  {Point} otherPoint
         * @return {Number}
         */
        distanceTo: function(otherPoint) {
            var dx = this.x - otherPoint.x;
            var dy = this.y - otherPoint.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    };

    return Point;
});
