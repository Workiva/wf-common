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

    var BrowserInfo = require('wf-js-common/BrowserInfo');

    describe('BrowserInfo', function() {

        it('should detect if 3d css transforms are supported', function() {
            var browserInfo = new BrowserInfo.constructor({
                window: window,
                navigator: navigator,
                eventTranslator: {
                    prefixed: function() {
                        return null;
                    },
                    csstransforms3d: true
                }
            });

            expect(browserInfo.hasCssTransforms3d).toBe(true);
        });

        describe('detecting mousewheel support', function() {
            it('should detect "wheel" for modern browsers', function() {
                var browserInfo = new BrowserInfo.constructor({
                    window: { document: { onwheel: function() {} } }
                });
                expect(browserInfo.Events.MOUSE_SCROLL).toBe('wheel');
            });
            it('should detect "wheel" for IE9+', function() {
                var browserInfo = new BrowserInfo.constructor({
                    window: { document: { documentMode: 9 } }
                });
                expect(browserInfo.Events.MOUSE_SCROLL).toBe('wheel');
            });
            it('should detect "mousewheel" support for webkit and IE8-', function() {
                var browserInfo = new BrowserInfo.constructor({
                    window: { document: { onmousewheel: function() {} } }
                });
                expect(browserInfo.Events.MOUSE_SCROLL).toBe('mousewheel');
            });
            it('should detect "DOMMouseScroll" for older Firefox', function() {
                var browserInfo = new BrowserInfo.constructor({
                    window: { document: {} }
                });
                expect(browserInfo.Events.MOUSE_SCROLL).toBe('DOMMouseScroll');
            });
        });

        describe('getBrowser', function() {
            var currentBrowser = BrowserInfo.getBrowser();
            var supportedBrowser = false;

            for(var browser in BrowserInfo.Browsers) {
                if (BrowserInfo.Browsers.hasOwnProperty(browser)) {
                    var browserName = BrowserInfo.Browsers[browser];
                    if (currentBrowser === browserName) {
                        supportedBrowser = true;
                    }
                }
            }

            it('returns a supported browser', function() {
                expect(supportedBrowser).toBe(true);
            });
        });

        describe('the event\'s cancel event function', function() {

            it('should preventDefault and stopPropagation if preventDefault is defined', function() {
                var event = {
                    preventDefault: function() {},
                    stopPropagation: function() {}
                };

                spyOn(event, 'preventDefault');
                spyOn(event, 'stopPropagation');

                BrowserInfo.Events.cancelEvent(event);

                expect(event.preventDefault).toHaveBeenCalled();
                expect(event.stopPropagation).toHaveBeenCalled();
            });

            it('should set returnValue and cancelBubble if event.preventDefault is not defined', function() {
                var event = {
                    preventDefault: null,
                    stopPropagation: null
                };

                BrowserInfo.Events.cancelEvent(event);

                expect(event.returnValue).toEqual(false);
                expect(event.cancelBubble).toEqual(true);
            });

            it('should default to window\'s event if not given an event', function() {
                var event = null;

                BrowserInfo.Events.cancelEvent(event);

                // In IE9, you cannot set window.event so we'll skip over this
                if (window.event) {
                    expect(window.event.returnValue).toEqual(false);
                    expect(window.event.cancelBubble).toEqual(true);
                }
            });
        });

        describe('browser name', function() {

            it('should default to chrome if no browser is detected', function() {
                // no browser
                var nobrowserInfo = new BrowserInfo.constructor({
                    window: window,
                    navigator: {
                        vendor: false,
                        userAgent: ''
                    },
                    eventTranslator: {
                        prefixed: function() {
                            return null;
                        }
                    }
                });

                expect(nobrowserInfo.getBrowser()).toEqual('Chrome');
            });

            it('should detect if chrome is the current browser', function() {
                // chrome
                var chromeInfo = new BrowserInfo.constructor({
                    window: window,
                    navigator: {
                        vendor: 'Google Inc.',
                        userAgent: 'Chrome'
                    },
                    eventTranslator: {
                        prefixed: function() {
                            return null;
                        }
                    }
                });

                expect(chromeInfo.getBrowser()).toEqual('Chrome');
            });

            it('should detect if safari is the current browser', function() {
                // safari
                var safariInfo = new BrowserInfo.constructor({
                    window: window,
                    navigator: {
                        vendor: 'Apple Computer, Inc.',
                        userAgent: 'Safari'
                    },
                    eventTranslator: {
                        prefixed: function() {
                            return null;
                        }
                    }
                });

                expect(safariInfo.getBrowser()).toEqual('Safari');
            });

            it('should detect if opera is the current browser', function() {
                // opera
                var operaInfo = new BrowserInfo.constructor({
                    window: window,
                    navigator: {
                        vendor: 'Opera Software ASA',
                        userAgent: 'OPR'
                    },
                    eventTranslator: {
                        prefixed: function() {
                            return null;
                        }
                    }
                });

                expect(operaInfo.getBrowser()).toEqual('OPR');
            });

            it('should detect if firefox is the current browser', function() {
                // firefox
                var firefoxInfo = new BrowserInfo.constructor({
                    window: window,
                    navigator: {
                        vendor: '',
                        userAgent: 'Firefox'
                    },
                    eventTranslator: {
                        prefixed: function() {
                            return null;
                        }
                    }
                });

                expect(firefoxInfo.getBrowser()).toEqual('Firefox');
            });

            it('should detect if Internet Explorer is the current browser', function() {
                // internet explorer
                var MSIEInfo = new BrowserInfo.constructor({
                    window: window,
                    navigator: {
                        userAgent: 'MSIE'
                    },
                    eventTranslator: {
                        prefixed: function() {
                            return null;
                        }
                    }
                });

                expect(MSIEInfo.getBrowser()).toEqual('MSIE');
            });

            it('should detect if Internet Explorer 11 is the current browser', function() {
                var MSIE11Info = new BrowserInfo.constructor({
                    window: window,
                    navigator: {
                        userAgent: 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko'
                    },
                    eventTranslator: {
                        prefixed: function() {
                            return null;
                        }
                    }
                });

                expect(MSIE11Info.getBrowser()).toEqual('MSIE');
            });
        });

        describe('edge case scenarios', function() {
            var edgeCaseBrowserInfo = new BrowserInfo.constructor({
                window: {
                    devicePixelRatio: null,
                    document: document
                },
                navigator: {
                    vendor: null,
                    userAgent: ''
                },
                eventTranslator: {
                    prefixed: function() {
                        return null;
                    }
                }
            });

            it('should set transition end to false if it has not ben defined', function() {
                expect(edgeCaseBrowserInfo.Events.TRANSITION_END).toBe(false);
            });

            it('set a device pixel ratio if one was not declared', function() {
                expect(edgeCaseBrowserInfo.devicePixelRatio).toEqual(1);
            });
        });
    });
});
