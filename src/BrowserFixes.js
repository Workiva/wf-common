define(function(require) {
    'use strict';

    var BrowserInfo = require('wf-js-common/BrowserInfo');
    var DeviceInfo = require('wf-js-common/DeviceInfo');

    var BrowserFixes = function() {
        // No setup required at this time
    };

    BrowserFixes.prototype = {

        /**
         * This applies a workaround for disappearing DOM elements in webkit
         * browsers. When you zoom in on a document with annotations some of the
         * annotation DOM elements (highlights, drag handles, and comment icons)
         * disappear as you pan around or otherwise interact with them.
         * The following discussions indicate this translateZ setting may help.
         * http://stackoverflow.com/questions/19172249
         * http://stackoverflow.com/questions/7808110
         *
         * @param  {Object} domElement -- the DOM element to apply the fix to
         */
        applyDisappearingElementFix: function(domElement) {
            if (DeviceInfo.browser.webkit && BrowserInfo.hasCssTransforms3d) {
                domElement.style[BrowserInfo.cssTransformProperty] = 'translateZ(0px)';
            }
        },

        /**
         * Unblit is a companion to `applyDisappearingElementFix`, used to force
         * the browser to remove aliasing after scaling the target.
         *
         * @param {HTMLElement} domElement
         */
        unblit: function(domElement) {
            // NOTE: This is only known to work in Chrome.
            // Safari cannot be unblitted. :(
            if (DeviceInfo.browser.chrome && BrowserInfo.hasCssTransforms3d) {
                domElement.style[BrowserInfo.cssTransformProperty] = 'translate(0,0)';
                setTimeout(function() {
                    domElement.style[BrowserInfo.cssTransformProperty] = 'translate3d(0,0,0)';
                }, 0);
            }
        }
    };

    return new BrowserFixes();
});
