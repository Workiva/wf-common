/*
 * Copyright 2014 WebFilings, LLC
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

    var DOMUtil = require('wf-js-common/DOMUtil');

    describe('DOMUtil', function() {

        describe('createEvent', function() {
            var eventType = 'simulated';

            it('should set the type, bubbles, and eventType properties of the created event', function() {
                var event = DOMUtil.createEvent(eventType);

                expect(event.type).toEqual(eventType);
                expect(event.bubbles).toEqual(true);
                expect(event.cancelable).toEqual(true);
            });

            it('should not set the eventType property if the document has a createEvent function', function() {
                var event = DOMUtil.createEvent(eventType);

                expect(event.eventType).toBeFalsy();
            });

            it('should set the eventType of the event if the document does not contain ' +
                'the eventType function', function() {

                document.createEvent = null;
                document.createEventObject = function() {
                    return {
                        eventType: null
                    };
                };

                var event = DOMUtil.createEvent(eventType);

                expect(event.eventType).toEqual(eventType);
                expect(event.type).toBeFalsy();
                expect(event.bubbles).toBeFalsy();
                expect(event.cancelable).toBeFalsy();
            });

            it('should not set the type, bubbles, or cancelable properties of the event if the the document ' +
                'does not contain the eventType function', function() {

                document.createEvent = null;
                document.createEventObject = function() {
                    return {
                        eventType: null
                    };
                };

                var event = DOMUtil.createEvent(eventType);

                expect(event.type).toBeFalsy();
                expect(event.bubbles).toBeFalsy();
                expect(event.cancelable).toBeFalsy();
            });
        });

        describe('scrollY', function() {
            it('should return the value of pageYOffset', function() {
                var domUtil = new DOMUtil.constructor({
                    window: {
                        pageYOffset: 500
                    }
                });

                expect(domUtil.scrollY()).toBe(500);
            });

            it('should use document.documentElement if pageYOffset is not available', function() {
                var domUtil = new DOMUtil.constructor({
                    window: { },
                    document: {
                        documentElement: { scrollTop: 500 }
                    }
                });

                expect(domUtil.scrollY()).toBe(500);
            });

            it('should use document.body.parentNode if document.documentElement is not available', function() {
                var domUtil = new DOMUtil.constructor({
                    window: { },
                    document: {
                        body: { parentNode: { scrollTop: 500 } }
                    }
                });

                expect(domUtil.scrollY()).toBe(500);
            });

            it('should use document.body if document.body.parentNode is not available', function() {
                var domUtil = new DOMUtil.constructor({
                    window: { },
                    document: {
                        body: { scrollTop: 500 }
                    }
                });

                expect(domUtil.scrollY()).toBe(500);
            });
        });

        describe('when measuring', function() {

            describe('and display:block', function() {
                var body = document.querySelector('body');
                var div = document.createElement('div');
                div.style.display = 'block';
                div.style.width = '7337px';
                div.style.height = '42px';
                body.appendChild(div);

                it('should get width', function() {
                    var width = DOMUtil.width(div);
                    expect(width).toBe(7337);
                });

                it('should get height', function() {
                    var height = DOMUtil.height(div);
                    expect(height).toBe(42);
                });
            });

            describe('and display:none', function() {
                var body = document.querySelector('body');
                var div = document.createElement('div');
                div.style.display = 'none';
                div.style.width = '7337px';
                div.style.height = '42px';
                body.appendChild(div);

                it('should get width', function() {
                    var width = DOMUtil.width(div);
                    expect(width).toBe(7337);
                });

                it('should get height', function() {
                    var height = DOMUtil.height(div);
                    expect(height).toBe(42);
                });
            });

            describe('and display:blank', function() {
                var body = document.querySelector('body');
                var contatinerDiv = document.createElement('div');
                var parentDiv = document.createElement('div');
                var childDiv = document.createElement('div');
                contatinerDiv.appendChild(parentDiv);
                parentDiv.appendChild(childDiv);
                body.appendChild(contatinerDiv);

                contatinerDiv.style.position = 'absolute';
                contatinerDiv.style.left = '0px';
                parentDiv.style.position = 'absolute';
                parentDiv.style.left = '0px';
                childDiv.style.position = 'absolute';
                childDiv.style.display = '';
                childDiv.style.width = '';
                childDiv.style.height = '';
                contatinerDiv.style.width = '100px';
                contatinerDiv.style.height = '200px';

                it('should get width', function() {
                    var width = DOMUtil.width(childDiv);
                    expect(width).toBe(100);
                });

                it('should get height', function() {
                    var height = DOMUtil.height(childDiv);
                    expect(height).toBe(200);
                });
            });

            describe('and display:100% in wrapper', function() {
                var body = document.querySelector('body');
                var div = document.createElement('div');
                div.style.display = 'none';
                div.style.width = '100%';

                var wrapper = document.createElement('div');
                wrapper.appendChild(div);
                div.style.width = '7337px';
                div.style.height = '42px';

                body.appendChild(wrapper);

                it('should get width', function() {
                    var width = DOMUtil.width(div);
                    expect(width).toBe(7337);
                });

                it('should get height', function() {
                    var height = DOMUtil.height(div);
                    expect(height).toBe(42);
                });
            });
        });

        describe('makeMeasureReady', function() {

            var el;

            beforeEach(function() {
                el = document.createElement('div');
                el.style.display = 'none';
                el.style.position = 'static';
                el.style.visibility = 'visible';
            });

            it('should do nothing if the element is not display:none', function() {
                el.style.display = 'block';
                DOMUtil.makeMeasureReady(el, function() {
                    expect(el.style.display).toBe('block');
                    expect(el.style.position).toBe('static');
                    expect(el.style.visibility).toBe('visible');
                });
            });

            it('should change the element to display:block before calling callback', function() {
                DOMUtil.makeMeasureReady(el, function() {
                    expect(el.style.display).toBe('block');
                });
            });

            it('should change the element to position:absolute before calling callback', function() {
                DOMUtil.makeMeasureReady(el, function() {
                    expect(el.style.position).toBe('absolute');
                });
            });

            it('should change the element to visibility:hidden before calling callback', function() {
                DOMUtil.makeMeasureReady(el, function() {
                    expect(el.style.visibility).toBe('hidden');
                });
            });

            it('should restore the original element display value', function() {
                DOMUtil.makeMeasureReady(el, function() {});
                expect(el.style.display).toBe('none');
            });

            it('should restore the original element position value', function() {
                DOMUtil.makeMeasureReady(el, function() {});
                expect(el.style.position).toBe('static');
            });

            it('should restore the original element visibility value', function() {
                DOMUtil.makeMeasureReady(el, function() {});
                expect(el.style.visibility).toBe('visible');
            });
        });

        describe('preventIOS7WindowScroll', function() {
            var domUtil;
            var fakeWindow = {};
            var fakeNavigator = {};

            beforeEach(function() {
                fakeWindow = {
                    scrollY: 0,
                    orientation: 0,
                    addEventListener: jasmine.createSpy('addEventListener'),
                    removeEventListener: jasmine.createSpy('removeEventListener'),
                    scrollTo: jasmine.createSpy('scrollTo'),
                    setInterval: jasmine.createSpy('setInterval'),
                    clearInterval: jasmine.createSpy('clearInterval')
                };
                fakeNavigator = {
                    userAgent: '(iPad; CPU iPad OS 7_0)'
                };

                domUtil = new DOMUtil.constructor({
                    window: fakeWindow,
                    navigator: fakeNavigator
                });
            });

            function getEventListener(type) {
                var spyCalls = fakeWindow.addEventListener.calls;
                for (var i = 0, len = spyCalls.length; i < len; i++) {
                    if (spyCalls[i].args[0] === type) {
                        return spyCalls[i].args[1];
                    }
                }
                throw new Error('Expected listener for "' + type + '" to be added to the window.');
            }

            it('should do nothing if the device does not report an iOS7 userAgent', function() {
                fakeNavigator.userAgent = '(not iPad)';

                domUtil.preventIOS7WindowScroll();

                expect(fakeWindow.addEventListener).not.toHaveBeenCalled();
                expect(fakeWindow.scrollTo).not.toHaveBeenCalled();
            });

            it('should do nothing if the method has already been invoked', function() {
                var firstTimeCalls;

                domUtil.preventIOS7WindowScroll();
                firstTimeCalls = fakeWindow.addEventListener.calls.length;

                domUtil.preventIOS7WindowScroll();
                expect(fakeWindow.addEventListener.calls.length).toBe(firstTimeCalls);
            });

            it('should record device-generated scroll offset if currently in horizontal orientation', function() {
                fakeWindow.scrollY = 20;
                fakeWindow.orientation = 90;

                domUtil.preventIOS7WindowScroll();

                expect(fakeWindow.addEventListener)
                    .not.toHaveBeenCalledWith('orientationchange', jasmine.any(Function));
            });

            it('should reset the window scroll immediately if scrollY is non-zero', function() {
                fakeWindow.scrollY = 100;

                domUtil.preventIOS7WindowScroll();

                expect(fakeWindow.scrollTo).toHaveBeenCalledWith(0, 0);
            });

            describe('handling window "scroll" events', function() {

                it('should add listener for window "scroll" events', function() {
                    domUtil.preventIOS7WindowScroll();

                    expect(fakeWindow.addEventListener)
                        .toHaveBeenCalledWith('scroll', jasmine.any(Function));
                });

                it('should not reset the window scroll if current scrollY is zero', function() {
                    var scrollListener;

                    domUtil.preventIOS7WindowScroll();

                    scrollListener = getEventListener('scroll');
                    scrollListener();
                    expect(fakeWindow.scrollTo).not.toHaveBeenCalled();
                });

                it('should reset the window scroll if current scrollY equals horizontal orientation scrollY', function() {
                    var scrollListener;

                    fakeWindow.orientation = -90;
                    fakeWindow.scrollY = 20;

                    domUtil.preventIOS7WindowScroll();

                    expect(fakeWindow.scrollTo.calls.length).toBe(1);

                    fakeWindow.scrollY = 20;
                    scrollListener = getEventListener('scroll');
                    scrollListener();

                    expect(fakeWindow.scrollTo.calls.length).toBe(2);
                    expect(fakeWindow.scrollTo.mostRecentCall.args).toEqual([0, 0]);
                });

                describe('when the keyboard is visible', function() {

                    var scrollListener;
                    var intervalFn;
                    var landscapeScrollY = 20;
                    var keyboardScrollY = 72;

                    beforeEach(function() {
                        // Need to return from the setInterval spy so it gives us an id.
                        fakeWindow.setInterval = function() {};
                        spyOn(fakeWindow, 'setInterval').andReturn(123);

                        // Setup recording of device-generated landscape scrollY offset.
                        fakeWindow.orientation = -90;
                        fakeWindow.scrollY = landscapeScrollY;

                        domUtil.preventIOS7WindowScroll();

                        expect(fakeWindow.scrollTo.calls.length).toBe(1);

                        // Assume the keyboard is visible if the current scrollY
                        // exists and is not equal to the recorded landscape scrollY offset.
                        fakeWindow.scrollY = keyboardScrollY;
                        scrollListener = getEventListener('scroll');
                        scrollListener();

                        intervalFn = fakeWindow.setInterval.mostRecentCall.args[0];
                    });

                    it('should use a 100ms interval to check whether to reset scroll', function() {
                        expect(fakeWindow.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 100);
                    });

                    it('should reset scroll if scrollY is back to funky landscape offset', function() {
                        fakeWindow.scrollY = landscapeScrollY;
                        intervalFn();

                        expect(fakeWindow.scrollTo.calls.length).toBe(2);
                        expect(fakeWindow.scrollTo.mostRecentCall.args).toEqual([0, 0]);
                        expect(fakeWindow.clearInterval).toHaveBeenCalled();
                    });

                    it('should cancel reset interval if scrollY is back to zero', function() {
                        fakeWindow.scrollY = 0;
                        intervalFn();

                        expect(fakeWindow.scrollTo.calls.length).toBe(1);
                        expect(fakeWindow.clearInterval).toHaveBeenCalled();
                    });

                    it('should do nothing on reset interval if keyboard is still visible', function() {
                        fakeWindow.scrollY = 72;
                        intervalFn();

                        expect(fakeWindow.scrollTo.calls.length).toBe(1);
                        expect(fakeWindow.clearInterval).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('dismissIOS7VirtualKeyboardOnOrientationChange', function() {
            var domUtil;
            var fakeWindow = {};
            var fakeDocument = {};
            var fakeNavigator = {};

            beforeEach(function() {
                fakeWindow = {
                    addEventListener: jasmine.createSpy('addEventListener'),
                    scrollTo: jasmine.createSpy('scrollTo')
                };
                fakeDocument = {
                };
                fakeNavigator = {
                    userAgent: '(iPad; CPU iPad OS 7_0)'
                };

                domUtil = new DOMUtil.constructor({
                    window: fakeWindow,
                    document: fakeDocument,
                    navigator: fakeNavigator
                });
            });

            function getEventListener(type) {
                var spyCalls = fakeWindow.addEventListener.calls;
                for (var i = 0, len = spyCalls.length; i < len; i++) {
                    if (spyCalls[i].args[0] === type) {
                        return spyCalls[i].args[1];
                    }
                }
                throw new Error('Expected listener for "' + type + '" to be added to the window.');
            }

            it('should do nothing if the device does not report an iOS7 userAgent', function() {
                fakeNavigator.userAgent = '(not iPad)';

                domUtil.dismissIOS7VirtualKeyboardOnOrientationChange();

                expect(fakeWindow.addEventListener).not.toHaveBeenCalled();
            });

            describe('handling window "orientationchange" events', function() {

                it('should add listener for window "orientationchange" events', function() {
                    domUtil.dismissIOS7VirtualKeyboardOnOrientationChange();

                    expect(fakeWindow.addEventListener)
                        .toHaveBeenCalledWith('orientationchange', jasmine.any(Function));
                });

                it('should do nothing if no element is active', function() {
                    domUtil.dismissIOS7VirtualKeyboardOnOrientationChange();

                    getEventListener('orientationchange')();

                    expect(fakeWindow.scrollTo).not.toHaveBeenCalled();
                });

                it('should blur the active element', function() {
                    domUtil.dismissIOS7VirtualKeyboardOnOrientationChange();

                    var el = fakeDocument.activeElement = document.createElement('div');
                    spyOn(el, 'blur');
                    var orientationchange = getEventListener('orientationchange');

                    orientationchange();

                    expect(el.blur).toHaveBeenCalled();
                });

                it('should scroll the window to its origin', function() {
                    domUtil.dismissIOS7VirtualKeyboardOnOrientationChange();

                    fakeDocument.activeElement = document.createElement('div');
                    var orientationchange = getEventListener('orientationchange');

                    orientationchange();

                    expect(fakeWindow.scrollTo).toHaveBeenCalledWith(0, 0);
                });
            });
        });

        describe('loadDataFont', function() {
            function stripCss(str) {
                // Strips extra characters from CSS that different browsers insert
                // inconsistently.
                // e.g.
                //   Firefox inserts new lines
                //   Chrome collapses spaces and removes quotes
                //   IE inserts tab
                var stripped = str
                    .replace(/ /g, '')
                    .replace(/"/g, '')
                    .replace(/\n/g, '')
                    .replace(/\r/g, '')
                    .replace(/\t/g, '');
                return stripped;
            }

            it('should load a data URI', function() {
                var adobeBlankDataUri = 'data:application/octet-stream;base64,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zH/Z/838t/0I5hEPt7mjj3hwO3fyf5j/8cc8mPsjHuqHeK7VwwOua/WA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD/AuaPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPXwv7j+X/b/5vp/2/+H6/9j/1+u/6/921z/tv07XP+O/btc/679e1z/nv3gr4Y9CwTOAsGzQOAsEDwLBM4CwbNA4CwQPAsEzgLBs0DgLBA8CwTOAsGzQOAsEDwLBM4CwbNA4CwQPAsEzgLBs0DgLBA8CwTOAsGzQOAsEDwLBM4CwbNAgNjBs0CA2cGzQOAsEDwLBM4CwbNA+OcHfxVucxYIngUCZ4HgWSBwFgieBQJngeBZIHAWCJ4FAmeB4FkgcBYIngUCZ4HgWSBA/PAIG/8H/f+A+EH/P/RH8vo/Pvgjev0f+Y6o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yPEj/o/4v+o/x+wPur/hz4NR/+nB5+Wo/8T/k/6P/GDkv5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/wTxk/5P+D/p/weUT/r/oU+91//5wafi6/+M/7P+z/g/6//MT8j6P+P/rP8z/s/6P7cHX/Nn4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zPEz/o/4/+s/x/wPev/h77cVv+XB19+q/8L/i/6v+D/ov8L/i/6v/CTi/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/wLxi/4v+L/o/wdkL/r/oafY0f/1wVPu6P+K/6v+r/i/6v+K/6v+r/i/6v/KL1T1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f4X4Vf9X/F/1/wOmV/3/0NNq6v/24Gk29X/D/03/N/zf9H/D/03/N/zf9H/D/03/N37Rpv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8fvDRM0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N4jf93/B/0/8PaN70/0NPpa//+4On1tf/Hf93/d/xf9f//cHL/uj/jv+7/u/4v+v/jv+7/u+8g67/O/7v+r8/eJkg/d/xf9f/Hf93/d/xf9f/Hf93/d/xf9f/Hf93/d/xf9f/Hf93/d/xf9f/Hf93/d/xf9f/Hf93/d/xf9f//WEPXs7Ixv9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/h/hd/3f83/X/A453/f/Qy2fp//Hg5bT0/8D/Q/8P/D/0/8D/Q/8P/D/0/8D/Q/8P/D/0/8D/Q/8P3tnQ/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/IP7Q/wP/D/3/gOBD/z/0krn6fz54CV39P/H/1P8T/0/9P/H/1P8T/0/9P/H/1P8T/0/9P/H/1P8T/0/9P3nHU/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9PiD/1/8T/U/8/YPfU/9CbyyNvX/h/6f+F/5f+X/h/6f+F/5f+X/h/6f+F/5f+X/h/6f+F/5f+X/h/6f+F/5f+X9yJpf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f0H8pf8X/l/6/wG1l/6H21weefvG/1v/b/y/9f/G/1v/b/y/9f/G/1v/b/y/9f/G/1v/b/y/9f/G/1v/b/y/9f/G/1v/b+7Q1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b4m/9v/H/1v8PeL31P8Tm8sjbD/4/+v/g/6P/D/4/+v/g/6P/D/4/+v/g/6P/D/4/+v/g/6P/D/4/+v/g/6P/D/4/+v/g/6P/D3fu6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+PxD/6P+D/4/+f0Dqo/9hNZdH3n7h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X9zRS/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/3//1qsYyOAgSCEgR2c6L9a68cKSIgg29P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f8k/uX/0/+X/x+jL/9LafP36H/yP/qf/I/+J/+j/8n/6H/yP/qf/I/+J/+j/8n/6H/yP/qf/I/+J/+j/8n/6H/yP/qf/I+jyf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/Ep/8j/4n/z86k//ls/n76f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/eWD5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5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';
                var fontDefinition = {
                    fontFamily: 'AdobeBlank',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    url: adobeBlankDataUri
                };

                DOMUtil.loadDataFont(fontDefinition);
                var style = document.getElementById('FONT_STYLE_TAG');

                //Different browsers add the properties in different orders
                var rule = stripCss(style.sheet.cssRules[0].cssText);
                expect(rule).toContain('@font-face{');
                expect(rule).toContain('font-family:AdobeBlank;');
                expect(rule).toContain('font-style:normal;');
                expect(rule).toContain('font-weight:normal;');
                expect(rule).toContain('src:url({{data}});'.replace('{{data}}', adobeBlankDataUri));
                expect(rule[rule.length-1]).toBe('}');

                style.sheet.deleteRule(0);
            });

            it('should load a data font', function() {
                var adobeBlankData = 'd09GRk9UVE8AAH6IAA0AAAABOGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABDRkYgAABnCAAAAswAAAQ5tmTD60RTSUcAAGokAAAUYQAAIFiwGAYVT1MvMgAAAYwAAABRAAAAYAEerzZWT1JHAABqHAAAAAgAAAAIA3EAAGNtYXAAABRoAABSigAA09QvgcMKaGVhZAAAATAAAAAzAAAANv3sFDZoaGVhAAABZAAAACAAAAAkCCID72htdHgAAGnUAAAAEQAAAgYD6AB8bWF4cAAAAYQAAAAGAAAABgEBUABuYW1lAAAB4AAAEocAADn+FJLpFnBvc3QAAGb0AAAAEwAAACD/uAAydmhlYQAAaegAAAAdAAAAJAnHEfV2bXR4AABqCAAAABIAAAIEu+m4AHjaY2BkYGBgZEtLCD54O57f5isDM/MLoAjD2bKUP3C65n8Hcw5zAZDLzMAEEgUAhykNewB42mNgZGBgLvjfwXCC+QVDDUMNcw4DUAQFMAEAhTIFGQAAUAABAQAAeNpjYGFgZpzAwMrAwNTFFMHAwOANoRnjGIwY7jAgge//1/3/ff//f/4HDPYgvqOLkyvjAQaG//+ZC/53MJxgLmCoSNBn/I+kRYGBAQDZ5RXyAAAAeNrdWkmTG0d2Lmo0i6mgDpLsg33JYEwoyAg0uEiURuQJ7K5mI4QGWgBaHPpWqEoANaxtamkIF/8TX3xxzH3+gG/+Mf4R/t7Ll7UA6EWU7Ykwm2hk5fLyLd9bMqsdx/n7ex859xzz71t8TPue8wmeTPsj57fOa2n/yvknZyjtj1tzfu185wTS/o1z3/lXaX/i/KPz79J+8Nlvnf+Q9qfO7z/7T1C79/Hf4Sn57L+kfc/5h8//WdofOZ9+nkn7V843n/+LtD9uzfm1k3/+V2n/xvniiy+l/Tvn6y9eSvsTtBNpP/j9Z1/8m7Q/dc7+8Ne/qOdPn32lBkG60Gq2LUodF2qY+GmepblX6qCvBlGkpuFqXRZqqgudX6HTzH8decn7qV5VkZc/6z99/uLV4OS1+4oHeQzPk9fujzovwjRRZsrFjBpPn79ap6WfJlf01P/26avYe6/TctmPwsXz/ov+i++ePm0Ircsye/nkyWaz6XvU2ffT+Em5zfSTFicqLFSuI+0VOlBVEuhclWtINRypSaYTdZompRqFvk4KrY5UxjOxwgtUWCrfy/WyiqKt8pJABalK0hJfmyRKMYEILbG+AOFIF4XappXyVrnWqkx5lD86h/rSJT9EZqeXD+4/uH+cZtucdKhuVbh6dFDYxz21Cct1bQIjzdiLtWqpgPaar6EHHp2ly3IDsUgxws2tiumpxlzP+jU9WU6U/DQLQWeho3TTY2Wh04uKVHlXXhh5i0gbVj11OvhBeeVLJRIVfh5mZdEvwqif5qsnk9MRbXD04f8e3GchLtyxOp2M52o0PHbHM7ctAyz9/Bt1qhd55eVbaP/pt79wywf3L6bu4Pz1yCXlaLVKIb21+j7SHkHMx4rMAKQUZRjDXUqoKM2jYBMGWgX6CrrMYo1FoOKnEZRIYAivDOhUlqd/0n5Z9JhElQEqZQ1J5QPCJUmrl0sMMCue7wU6Dn22TxQmqyrE1j6Ix3GVhGWoC2M7EAT1K+LDU0vCM/WmJMUyB7rAJhwrUZt16K/FBWJvC/OrYg2hAoOAmIjgATMzLy8T6H8dZgYHKTjNC8ESNHQ6AlwAnqLtJoHQBj8gXaGjB2VVQUiNOA3CZSh7YU/IkoeLiryFWCafBUTTZEXfILpldZMDF2kEqG6pMy50dKWLvppbX+6BXT/CHrQw2cIQeXhl1E5iY9z3EmJnAaeJiBEdL3QQUKvLBfh6kuZmN4N9kCus+4mCKYp4JQ/l1osTqLiouSWxidtdRlo8m+hUj4PHdboBgHJmlogs9G4UpB3ZCIpCJsFDlG7o5vrPVZhrxh8A1BgCfR4MaiNGKwwEKbimzbwsg/Yxl/WX+hVTYUTS9gWptomdKQeeMG8LwLg4cU+H4+F8OBnPHtx/2AleD8HGEvixcbbQ7CXLEGG4EdSYWDVx9gym0Pmj4vEh9kmHPlbm4D328vdkwQKO5a9JI6FBuMEGNkyr3Ndmwx6gEMLGEskkVRip2QdZmof7QbotBanK2L3ItC/ANtsrb1lKdPZrUQqQZutAGkN/goEw8SIb53Z1RCEE8YJiAlTVzQWIAFmaaIZSodogvl6HZtdz64UHdt1xnxjRh+h5ATtXmfYwGukSDz1CQVEtEI7KijrU0ZENGzTEsSZFDkE3A3cpItVs20i7o4QebeivvWRFRAHk2DOQQzcFTAvFrjqId5XojdLJVZinCenZiDuoynWa7wtZhKuE3E3TRppa8O8VYmVM7VL76yT0wdYmD8mWYMD4XgYqKQsHYZJa62KyDlfMwIU7PR/OZvAJ9aU6noxPrH9coMoIC85vgCpIa0gIBpKSAhPHcEojiM4r3bN8y+7pooRLc8BjhFlldrbnRRXVAhSBtz2eiSismSDHQInJ224gNCkFcTbqhuwqqR+5eiiu2RawoDxndbJMKU0Qs1BYEBKeCy6nnj1WYx2aiLZn0STNLXBCACDESkTfChZpMESRvwEQFuxiGzNslpMMAlo6WrJlnj++ee1B6Sy9Opf8jAzS20kh2kOoYPMRkmBQk0pRNVy1AwcCNAKeSfOt8MdRH1FQkpvEuUCJRikUlVhz5CGjUk37U2mD37qKveSIKmau8tZokGsYr2UOMjCa5SEVODGYhIM002NdolWizAh1FBQsJq2jDchNoU8UaCawd/J5Wmi7RnhG0A8Ru69CvWkCFxCbs32+AjzSPbNcbxUs5JH9sG3yBxf8+qcM+sNBgfy6RHmUddxQ/M/ygnoeOT4j2EKK3ZAqWQYzYH+J0wlVMcim5B2CfygyZpUQO5QxSB0Z1Q5JK3KQ2CaLfv2Y83kijIu8h3KiScTKhLjW3K5uUODBk6Wm4NrEVItxSq6ukyDNoTlytwAFSBlyZt3uKR5Tf/J1xm7t+e+TdAP8r7ToSSIh5t3Cs4Fxh+ncuIqpKW4wEGvnhdHOTsipAxOINWGqdygjYXJVsC7ajgtboHiC8fbrDBMOeZEosb1wtzb7P6/J9lPOnFLOeEB5Zufct9AInkQfJ2SW6ioNUe0v2ynahh8bquuyFo5vqrzh7Hg0GJ67U1A/c82RbTY5nb8dTF01nKmL6eTH4Yl7oh4OZnh+2FNvh/OzyeVcYcZ0MJ6/w+lBDcbv1PfD8UlPuX/ESWw2U5OpGp5fjIYu+obj49HlyXD8Rr3GuvGEDoXnwzmIzie8VEgN3RkRAzPHZ3gcvB6OhvN3PXU6nI+J5imIDtTFYDofHl+OBlN1cTm9mOBsORifgOx4OD6dYhf33IUQIHQ8uXg3Hb45m/ewaI7OnppPByfu+WD6fY84nEDkqeIpfXAJGsr9kRbPzgajkSKF1DTU2WR0gtmvXXA/wEnTsAPuWYE9dTI4H7xxZw1dmiYSNBqgBW/csTsdjHpqduEeD6kB1Q2n7vGcZ0LdEH7EHKLImLk/XKID8+wWsMGZy1uA5wH+HxM8jMRjSEh05pPpvGbl7XDm9tRgOpwRC6fTCdglE2IFyXgJFZK9xsIvmYX69gGBWbRaBDxxByMQnBEbe3P7118QRXrlRRiPI+cvjnKeO0+dZ85XaA2cwEmdhaPRnjlbp3BKtGN8K2foJI6P0dzJ+LfHY4HT53URfpQzdUJn5awxUvCTxrfG3CuZ2ab/Gis80HzP81ZOxc85OOmDn+fOC+cV5p9gnsstu7JZZ8YnPONH3qfA/inGVIfKBWSxPdT3Chym4NHnuVf1WN/5Fr9fQV4P1DXPWaI3AtUF1vVBjT7fMZ1DHH2I/khbJfpeOk/ws+GfPkYtpT6vijFWgmKGnifX6FGBT9opR3+Ej8faD9BTYTxgDSlQWQt/Q2eE7wnTJJ2dsj5KtEag5HNvwXOP8MlaNM0eHtMOeYXPttPQV8VY2KLP410V86rQTnkmPW3wFOHbULAcLWX/QjiOGD/0tMVIxRRXvIvmVWlrbfNNUhqNp6DYjEQdmV46D5z7/DnGvAw75DV21f+AVyjn0c+w7GOnhxUb1uX6gOe0bTMGhZh5OYwCK9cclAwemrUz1kmJnYy1LGK6uvnliCFpDnkkffb5i3bQZnp9tkso/CwY04ScXgtZZqaHkYLR4EFfHnpJFwvGT1urHnM8cH7gdgm7qB0bFdiVcJAxCvvMfYRvsuwK4xOsH9USHP1NfmjnxhIXiH1jlmuC7zlbYghMU+8Mv6+zg/Hp5843vFZDWzlsTqjYCvafIhr+baWkzwV8wYXNzoHwEVoWOWTZFUeQ6ICv3yWmPRJrPmY05K2YQv4dwsdMRioFRYSBCKgjPAXcR7+vBJcZ+6TZyfBC+I0EiTYyhDy/iXQUVXO0/4RenzHXa3FRYdRElfJAlFSMVS10jW0p/i5lRaMVj6NzwDGLdND4D3lewrk3FKl94Txm+RP2nZCjUdvvDIeG96taHx5zZ+OznZvWtliyFkhPRpsmYyWs3TXvvd7JApSJt+L9pJG1WCroxIC45kRLT8LceayHRPC/Zr9ux4NUdJqzr7fjksHQKfuYx1akyFNcm02CHb6NfgzXlczoCbIqtMO6J8ZMel7Wkc7KZeQ0dsm5Aqnq3GK1bPOsiaIp29I+G063LXTbDFwwMk1U3dYzY+YzYi0WXNXN9/JyT7TrY56Rw+6YMCWTMUKOwg3arbXNep9nW+0sJNNEtUaIkwU/BXXfTbow+nrCe7Rla8d9w12xl/26CLa1iMdasqvyvVycCIqLA7qtajws7qSRw3pu1077640e14xJE4HylmYtJ4u6Tru+FrQyNp6g6irTRo8u0tv8Eu0/c+zI2Wo2/i3FFvseYeZ54qG7NcbhaoBqHKNrK5nHcTES7KYd/KVYW7V4aWKklb6oUXuo7kxbFU/I7cMWaOLFCbLSKXLuGJ85PhPOvDTy8IbK66FoYynxZ7eeJdmbXLLkOkRfU923vVgdrGfPxCtor0dY9/jO2rc49GXPXPQec/t97YOFZCyK4RYjYSeGt+OGFm+sQMMXG1gJexIVQvHjbk3WPVW0bd3kwcY2D+9USV9nC4uqtr8X7Bv+TsRuS0/PSzmHNFbxD1ilEK4b3zG2afM/kRUhcxHt1XO34chWIaa+sHWCQdVN5wJTA2Q8Q7eiUsGaPxyJPwSHbVnP93Lh3WS9OfvEUvtY/jzOLE0MSBlxgXhVKSO9OhaQXRdSHZUsrV17xDV0t9qwq5q6JpVziJndRNzljpX2tb1b096MhF4toc85LJG5qzoix6yXJsqZ2bbC3I2KN6HD6l0xvxvO2gnn0ZxXWTy3rTtg3a15t7tYsmBpkzq76VoiXfeZ/L2SujKu+0vG+5rrV1+0tWH9Wb9M5XeT9zLhJW1ZTskd0T7Wu152va76rZOMi2h0jgwx4/PbhM9tX7KnUPtkL39cyF1GyLcg1ndNVDVca7Gh0UAi3PU6dbg9jZjaeSWn866+u7LTnUIpWbqp8JoYtovM66VvdqrqewFbA2+lZjE0TS2sWxw2dWC3Tt7eWBG2Tymmno1urLIrRuvuaHP3UPxMaU20sOe5XZwsJRqnXJ0azRqEBXLSSjnzNrdTzzhXj7kaaddot/toIhjvRpxQIkAoe5ratxIfORSHenU0249AZofb4nYhFuye5bpnEMMX2WvZ8pnnLP2H73t32+3yt38u+d85g/RuOYVoPr2vO95nY5Lx0Pap1Nw1XF1bcZgKOpSaqznNH67+mlq/EIrtk1u3nguY1zZGbVVUyj5HbDuDLBOhf5LTQrvyW3NFRyuO6jvm5i5vLT02a7RzbaODTDSasez2BicWTZoMcoh6zPnf9JVymxEyJgPezVrT7mclsNnU4NPcoLUr9uvP56lotrtPV8+m0g+l7r7imZuDFVcllW7jP19J9Ejv4C0f4iuV8G/X3KXabp8/mht+0mUm+DNvFGy+LuX2KLshG3bz365ezP28OcdndbQ1tritSu2eZQwN4//dejqp72IykUMfqMYNIuMWSqx2kvpW36Ajq+8dkmtqDmvt9ln0a9asPZ8nOxrv2veu58S0k3HaVdxhujfhxtzgmZzcvado7k3ad4sxz9F1/RfwvoXUNblU8+YGpGQb6VasvQ3xPcEdRbysla0pTrxn/jYS/1cdlO/XhIbeL9NzOxpfr+m8k1Xa9xQf5kENdl50sHNzlbNfMRnODlVTvTufkQzlij3M4uK6jGv8IpTbkO0d7zPa1WGzUxeJ1+14273Z//97sruccub1KWcMBNvzzM3v+xZcLaf1HUsi75AbW11hNJS7/eW1p+jd6me3qt6/rTUZv32XR6ezY2cE3oeQgmQxvJ/xu7TmLduM3w/MnbeYOeWxIf+VAb2vmiDODPle8AQ9dPKdyfhDRuBbPumdYd4l0zI0pvhNtN/JuwfFz/T0PWvzhNe6zh/lndiMqU7QVszrBb/5c2UerSA5LlmmsfOG3xGb/cZYZd8UnjMvhtM5+ptdu1wNeUfLmdHMMWQwowPQHjI94r/HmqL2uObzVDgdsI6I8pzfU16yrqfce4nvC8wz7y0HLLPhdswynGLcyOIyB8YShqNjfhf6jme8AV9z5uKCMWhm9ljCKf/NCK2nXb/nXsPZRKw85TrGUumLLg0fiv/SxK0xQPKP+C2RRcg+H4otPeJdp2wFV3Q/kHeabe0Y3TcIJP5O+P3ngOWeHeTXUuva4BAG7A5vWAqX9THi2TO+oThmSqN6Pa2ccv+8RdOg21h+1NLhsdxeuM4P2NUV5AxYQ10pjB8Q/40URs8D+X1cR4+2jcdiw+PaohPG0r5W3rLHuTxrwPaY1Vo4ZS89F84vWziydrwUFE5qzrr6td5i590lQhhadu+uBU/4LfdIOJzV2ridroleH/JXRBH/3ZXHf+FA62Mn+m8X7NYWAHja7N2Dm+TrYnf9uu1fnJzYtm3btm3btm3btp0T50Fs28lJPWv2Wf/F+/a+qr5ratA11669+3PPdFfdbrdyu90Sl+fhkm+3/rBbuD14ewZuDQ/dnm7zodvrbT/0PQ9uze33iX8m2+2fb/dwj/d0z/dyr/d27/dxn/d13/dzv+6Pcn/U+6PdH/3+GPfHvD/W/bHvj3N/2P1x7493f/z7E9yf8P5E9ye+P8n9Se9Pdn/y+1Pcn/L+VPenvj/N/WnvT3d/+vsz3J/x/kz3Z74/y/1Z7892f/b7c9yf8/5c9+e+P8/9ee/Pd3/++wvcX/D+QvcXvr/I/UXvL3Z/8ftL3F/y/lL3l76/zP1l7y93f/n7K9xf8f5K91e+v8r9Ve+vdn/1+2vcX/P+WvfXvr/O/XXvr3d//fsb3N/w/kb3N76/yf1N7292f/P7W9zf8v5W97e+v839be9vd3/7+zvc3/H+Tvd3vr/L/V3v73Z/9/t73N/z/l73976/z/197+93f//7B9w/8P5B9w++f8j9Q+8fdv/w+0fcP/L+UfePvn/M/WPvH3f/+Psn3D/x/kn3T75/yv1T7592//T7Z9w/8/5Z98++f879c++fd//8+xfcv/D+Rfcvvn/J/UvvX3b/8vtX3L/y/lX3r75/zf1r7193//r7N9y/8f5N92++f8v9W+/fdv/2+3fcv/P+Xffvvn/P/Xvv33f//vsP3H/w/kP3H77/yP1H7z92//H7T9x/8v5T95++/8z9Z+8/d//5+y/cf/H+S/eH33/5/iv3X73/2v3X779x/837b91///4H9z+8/9H9j+9/cv/T+5/d//z+F/e/vP/V/a/vf3P/2/vf3f/+/g/3f7z/0/2f7/9y/9f7v93//f4f9/+8/9f9v++PePgj7v9zvz/ifn/kAyHy4Mg8hCoPg34bPFAWD5Jzu26PcnvU26PdHv32GLfHvD3W7bFvj3N72O1xb493e/zbE9ye8PZEtye+PcntSW9Pdnvy21PcnvL2VLenvj3N7WlvT3d7eh54z3h7ptsz357l9qy3Z7s9++05bs95e67bc/NAfN7b892e//YCtxe8vdDthW8vcnvR24vdXvz2EreXvL3U7aVvL3N72dvL3V7+9gq3V7y90u2Vb69ye9Xbq91e/fYat9e8vdbttW+vc3vd2+vdXv/2Brc3vL3R7Y1vb3J709ub3d789ha3t7y91e2tb29ze9vb293e/vYOt3e8vdPtnW/vcnvX27vd3v32Hrf3vL3X7b1v73N739v73d7/9gG3D7x90O2Dbx9y+9Dbh90+/PYRt4+8fdTto28fc/vY28fdPv72CbdPvH3S7ZNvn3L71Nun3T799hm3z7x91u2zb59z+9zb590+//YFty+8fdHti29fcvvS25fdvvz2FbevvH3V7atvX3P72tvX3b7+9g23b7x90+2bb99y+9bbt92+/fYdt++8fdftu2/fc/ve2/fdvv/2A7cfvP3Q7YdvP3L70duP3X789hO3n7z91O2nbz9z+9nbz91+/vYLt1+8/dLt4bdfvv3K7Vdvv3b79dtv3H7z9lu337/9we0Pb390++Pbn9z+9PZntz+//cXtL29/dfvr29/c/vb2d7e/v/3D7R9v/8R/zv9y+9fbv93+/fYft/+8/dftv2+PuD3i7//ndr/xbz3cw/+ER4T/Dv8V/jP8R/j38G/hX8O/8D+Cfwr/GP4h/H34u/C34W/CX4e/Cn8Z/iL8efiz8KfhT8Ifhz8Kfxj+IPx++L3wu+F3wm+H/xv+T/jf4X+F3wq/GX4j/Hr4tfCr4VfCL4eHh18Kvxh+Ifx8+Lnws+Fnwk+Hnwo/GX4i/Hj4sfCj4UfCD4cfCj8YfiB8f/i+8L3he8J3h+8K3xm+I3x7+LbwreFbwjeHbwrfGL4hfH34uvC14WvCV4evCl8ZviJ8efiy8KXhS8IXhy8KXxi+IHx++LzwueFzwmeHzwqfGT4jfHr4tPCp4VPCJ4dPCp8YPiF8fPi48LHhY8JHh48KHxk+Inx4+LDwoeFDwgeHDwofGD4gvH94v/C+4X3Ce4f3Cu8Z3iO8e3i38K7hXcI7h3cK7xjeIbx9eLvwtuFtwluHtwpvGd4ivHl4s/Cm4U3CG4c3Cm8Y3iC8fni98LrhdcJrh9cKrxleI7x6eLXwquFVwiuHVwqvGF4hvHx4ufCy4WXCS4eXCi8ZXiK8eHix8KLhRcILhxcKLxheIDx/eL7wvOF5wnOH5wrPGZ4jPHt4tvCs4VnCM4dnCs8YniE8fXi68LThScIThycKTxieIDx+eLzwuOFh4XHCY4fHCo8ZHiM8eni08KjhUcIVTthhhRlG6KGFGkrIIfFPDCH40eD/f/v/1ttDH+l//gce+Y1H/Q9vvT/yo/+Dh0SwIxPtB4xIdn6ABPsBMYpdmWo3ptmd6fZghg09btNezLIf3MFtH+bYF3PZj8I8iv2oD34f9qMxj2Y/OvPo9mMwj2E/JvOY9mMxj2U/NvPY9uMwj2M/jHmY/bjM49qPxzye/fjM49tPwDyB/YTME9pPxDyR/cTME9tPwjyJ/aTMk9pPxjyZ/eTMk9tPwTyF/ZTMU9pPxTyV/dTMU9tPwzyN/bTM09pPxzyd/fTM09vP8ICI9jMyz2g/E/NM9jMzz2w/C/Ms9rMyz2o/G/Ns9rMzz24/B/Mc9nMyz2k/F/Nc9nMzz20/4Ovz2M/LPK/9fMzz2c/PPL/9AswL2C/IvKD9QswL2S/MvLD9IsyL2C/KvKj9YsyL2S/OvLj9EsxL2C/JvKT9UsxL2S/NvLT9MszL2C/LvKz9cszL2S/PvLz9Cswr2K/IvKL9Sswr2a/MvLL9Ksyr2K/KvKr9asyr2a/OvLr9Gsxr2K/JvKb9Wsxr2a/NvLb9Oszr2K/LvK79eszr2a/PvL79Bswb2G/IvKH9Rswb2W/MvLH9Jsyb2G/KvKn9Zsyb2W/OvLn9Fsxb2G/JvKX9Vsxb2W/NvLX9Nszb2G/LvK39dszb2W/PvL39Dsw72O/IvKP9Tsw72e/MvLP9Lsy72O/KvKv9bsy72e/OvLv9Hsx72O/JvKf9Xsx72e/NvLf9Psz72O/LvK/9fsz72e/PvL/9AcwH2B/IfKD9QcwH2R/MfLD9IcyH2B/KfKj9YcyH2R/OfLj9EcxH2B/JfKT9UcxH2R/NfLT9MczH2B/LfKz9cczH2R/PfLz9Ccwn2J/IfKL9Scwn2Z/MfLL9Kcyn2J/KfKr9acyn2Z/OfLr9Gcxn2J/JfKb9Wcxn2Z/NfLb9Oczn2J/LfK79eczn2Z/PfL79BcwX2F/IfKH9RcwX2V/MfLH9JcyX2F/KfKn9ZcyX2V/OfLn9FcxX2F/JfKX9VcxX2V/NfLX9NczX2F/LfK39dczX2V/PfL39Dcw32N/IfKP9Tcw32d/MfLP9Lcy32N/KfKv9bcy32d/OfLv9Hcx32N/JfKf9Xcx32d/NfLf9Pcz32N/LfK/9fcz32d/PfL/9gDY/YP8g84P2DzE/ZP8w88P2jzA/Yv8o86P2jzE/Zv848+P2TzA/Yf8k85P2TzE/Zf8089P2zzA/Y/8s87P2zzE/Z//8A5PZv8D8gv2LzC/av8T8kv1w5uH2LzO/bP8K8yv2rzK/av8a82v2rzO/bv8G8xv2bzK/af8W81v27zO/b/8B8wf2HzJ/aP8R80f2HzN/bP8J8yf2nzJ/av8Z82f2nzN/bv8F8xf2XzJ/af8V81f2XzN/bf8N8zf23zJ/a/8d83f23zN/b/8D8w/2PzL/aP8T80/2PzP/bP8L8y/2vzL/av8b82/2vzP/bj/g9H/Y/8n8p/1fzH/Z/838t/0I5hEPt7mjj3hwO3fyf5j/8cc8mPsjHuqHeK7VwwOua/WA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD/AuaPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPWA1YNWD1g9aPXwv7j+X/b/5vp/2/+H6/9j/1+u/6/921z/tv07XP+O/btc/679e1z/nv3gr4Y9CwTOAsGzQOAsEDwLBM4CwbNA4CwQPAsEzgLBs0DgLBA8CwTOAsGzQOAsEDwLBM4CwbNA4CwQPAsEzgLBs0DgLBA8CwTOAsGzQOAsEDwLBM4CwbNAgNjBs0CA2cGzQOAsEDwLBM4CwbNA+OcHfxVucxYIngUCZ4HgWSBwFgieBQJngeBZIHAWCJ4FAmeB4FkgcBYIngUCZ4HgWSBA/PAIG/8H/f+A+EH/P/RH8vo/Pvgjev0f+Y6o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yP+j/o/4v+o/yPEj/o/4v+o/x+wPur/hz4NR/+nB5+Wo/8T/k/6P/GDkv5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/4T/k/5P+D/p/wTxk/5P+D/p/weUT/r/oU+91//5wafi6/+M/7P+z/g/6//MT8j6P+P/rP8z/s/6P7cHX/Nn4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zP+z/o/4/+s/zPEz/o/4/+s/x/wPev/h77cVv+XB19+q/8L/i/6v+D/ov8L/i/6v/CTi/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/4L/i/4v+L/o/wLxi/4v+L/o/wdkL/r/oafY0f/1wVPu6P+K/6v+r/i/6v+K/6v+r/i/6v/KL1T1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f8X/Vf9X/F/1f4X4Vf9X/F/1/wOmV/3/0NNq6v/24Gk29X/D/03/N/zf9H/D/03/N/zf9H/D/03/N37Rpv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8b/m/6v+H/pv8fvDRM0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N/zf93/B/0/8N4jf93/B/0/8PaN70/0NPpa//+4On1tf/Hf93/d/xf9f//cHL/uj/jv+7/u/4v+v/jv+7/u+8g67/O/7v+r8/eJkg/d/xf9f/Hf93/d/xf9f/Hf93/d/xf9f/Hf93/d/xf9f/Hf93/d/xf9f/Hf93/d/xf9f/Hf93/d/xf9f//WEPXs7Ixv9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/x/9d/3f83/V/h/hd/3f83/X/A453/f/Qy2fp//Hg5bT0/8D/Q/8P/D/0/8D/Q/8P/D/0/8D/Q/8P/D/0/8D/Q/8P3tnQ/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/8P/Q/wP/D/0/IP7Q/wP/D/3/gOBD/z/0krn6fz54CV39P/H/1P8T/0/9P/H/1P8T/0/9P/H/1P8T/0/9P/H/1P8T/0/9P3nHU/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9P/D/1/8T/U/9PiD/1/8T/U/8/YPfU/9CbyyNvX/h/6f+F/5f+X/h/6f+F/5f+X/h/6f+F/5f+X/h/6f+F/5f+X/h/6f+F/5f+X9yJpf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f+H/pf8X/l/6f0H8pf8X/l/6/wG1l/6H21weefvG/1v/b/y/9f/G/1v/b/y/9f/G/1v/b/y/9f/G/1v/b/y/9f/G/1v/b/y/9f/G/1v/b+7Q1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b/2/9v/H/1v8b4m/9v/H/1v8PeL31P8Tm8sjbD/4/+v/g/6P/D/4/+v/g/6P/D/4/+v/g/6P/D/4/+v/g/6P/D/4/+v/g/6P/D/4/+v/g/6P/D3fu6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+P/j/6P+D/4/+PxD/6P+D/4/+f0Dqo/9hNZdH3n7h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X9zRS/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/1/4f9L/1/4/9L/F/6/9P+F/y/9f+H/S/9f+P/S/xf+v/T/hf8v/X/h/0v/X/j/0v8X/r/0/4X/L/3//1qsYyOAgSCEgR2c6L9a68cKSIgg29P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f/0/+X/0/+X/0//X/4//X/5//T/5f/T/5f/T/9f/j/9f/n/9P/l/9P/l/9P/1/+P/1/+f8k/uX/0/+X/x+jL/9LafP36H/yP/qf/I/+J/+j/8n/6H/yP/qf/I/+J/+j/8n/6H/yP/qf/I/+J/+j/8n/6H/yP/qf/I+jyf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/+p/8j/4n/6P/yf/of/I/Ep/8j/4n/z86k//ls/n76f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/eWD5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5f/p/+X/6f/l/+n/5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';
                var fontDefinition = {
                    fontFamily: 'AdobeBlank',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                };

                DOMUtil.loadDataFont(fontDefinition, adobeBlankData);
                var style = document.getElementById('FONT_STYLE_TAG');
                var rule = stripCss(style.sheet.cssRules[0].cssText);

                //Different browsers add the properties in different orders
                expect(rule).toContain('@font-face{');
                expect(rule).toContain('font-family:AdobeBlank;');
                expect(rule).toContain('font-style:normal;');
                expect(rule).toContain('font-weight:normal;');
                expect(rule).toContain('src:url(data:application/octet-stream;base64,{{data}});'.replace('{{data}}', adobeBlankData));
                expect(rule[rule.length-1]).toBe('}');

                window.style = style;
                style.sheet.deleteRule(0);
            });

        });
    });
});
