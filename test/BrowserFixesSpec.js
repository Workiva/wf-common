define(function(require) {
    'use strict';

    var BrowserFixes = require('wf-js-common/BrowserFixes');
    var BrowserInfo = require('wf-js-common/BrowserInfo');
    var DeviceInfo = require('wf-js-common/DeviceInfo');

    if (BrowserInfo.hasCssTransforms3d) {
        describe('translateZ workaround to prevent disapearing elements', function() {
            var target;
            var prevMobile;
            var prevWebkit;
            beforeEach(function () {
                target = document.createElement('div');
                prevMobile = DeviceInfo.mobile;
                prevWebkit = DeviceInfo.browser.webkit;
            });
            afterEach(function () {
                DeviceInfo.mobile = prevMobile;
                DeviceInfo.browser.webkit = prevWebkit;
            });
            it('should include the "will-change" style when the browser is chrome ' +
                'and has support for that property', function () {

                DeviceInfo.browser.webkit = true;
                DeviceInfo.browser.chrome = true;
                target.style.willChange = 'yes!';
                BrowserFixes.applyDisappearingElementFix(target);
                expect(target.style[BrowserInfo.cssTransformProperty]).toBe('');
                expect(target.style.willChange).toBe('transform');
            });
            it('should include the transform style when the browser is webkit', function () {
                DeviceInfo.mobile = true;
                DeviceInfo.browser.webkit = true;
                BrowserFixes.applyDisappearingElementFix(target);
                expect(target.style[BrowserInfo.cssTransformProperty]).toBe('translateZ(0px)');
            });
            it('should not include the transform style when the browser is not webkit', function () {
                DeviceInfo.mobile = false;
                DeviceInfo.browser.webit = false;
                BrowserFixes.applyDisappearingElementFix(target);
                expect(target.style[BrowserInfo.cssTransformProperty]).toBe('');
            });
        });
    }
});
