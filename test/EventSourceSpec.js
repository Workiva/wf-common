define(function(require) {
    'use strict';

    var EventSource = require('wf-js-common/EventSource');

    var testEvent;

    // Phantom doesn't seem to have the support for creating events, so we're relying on saucelabs
    // to run these tests.  For local development, hit the jasmine test running with the browser
    // you want to use.

    var canCreateEvent = true;
    try {
        testEvent = document.createEvent('Event');
    } catch (e) {
        canCreateEvent = false;
    }

    var uiEventsNewable = true;
    try {
        testEvent = new window.UIEvent('touchstart');
    } catch (e) {
        uiEventsNewable = false;
    }

    var mouseEventsNewable = true;
    try {
        testEvent = new window.MouseEvent('click');
    } catch (e) {
        mouseEventsNewable = false;
    }

    // Pointer do not seem to be newable, so we set the constructor of a Event to PointerEvent.
    var pointerEventsAvailable = true;  // IE10 and 11 as of now
    if (!canCreateEvent || !window.PointerEvent) {
        pointerEventsAvailable = false;
    }
    // IE is intermittently failing on document.createEvent.  I cannot figure out why.
    // http://stackoverflow.com/questions/29105596/why-does-document-createeventevent-intermittently-error-with-object-expecte
    // So, disabling pointer event testing for now.
    pointerEventsAvailable = false;

    // Touch events are not newable in Chrome 41 unless you have mobile emulation, or a touch
    // device.  FF 36 seems unable to new up a TouchEvent, also.  We 'cheat' and set the
    // constructor to a TouchEvent.
    var touchEventsAvailable = true;
    if (!uiEventsNewable || !window.TouchEvent) {
        touchEventsAvailable = false;
    }

    var wheelEventsNewable = true;
    try {
        testEvent = new window.WheelEvent('mousewheel');
    } catch (e) {
        wheelEventsNewable = false;
    }

    function createPointerEvent() {
        var event = document.createEvent('Event');
        event.constructor = window.PointerEvent;
        return event;
    }

    describe('EventSource', function() {
        var event;

        describe('isMouse', function() {
            if (mouseEventsNewable) {
                it('should detect a MouseEvent', function() {
                    event = new window.MouseEvent('click');
                    expect(EventSource.isMouse(event)).toBe(true);
                });
                it('should descend into a hammerjs event to detect the original source', function() {
                    var hammerEvent = {};
                    hammerEvent.source = new window.MouseEvent('click');
                    expect(EventSource.isMouse(event)).toBe(true);
                });
                it('should descend into a reactjs event to detect the original source', function() {
                    var reactEvent = {};
                    reactEvent.nativeEvent = new window.MouseEvent('click');
                    expect(EventSource.isMouse(event)).toBe(true);
                });
            }

            if (pointerEventsAvailable) {
                it('should detect a PointerEvent, with a pointer type of mouse, as a MouseEvent', function() {
                    event = createPointerEvent();
                    event.pointerType = 'mouse';
                    expect(EventSource.isMouse(event)).toBe(true);
                });
                it('should detect a PointerEvent, with a pointer type of pen, as a MouseEvent', function() {
                    event = createPointerEvent();
                    event.pointerType = 'pen';
                    expect(EventSource.isMouse(event)).toBe(true);
                });
                it('should detect a PointerEvent, with a pointer type of mouse, wrapped in a hammerjs event, as a MouseEvent', function() {
                    var hammerEvent = {};
                    event = createPointerEvent();
                    event.pointerType = 'mouse';
                    hammerEvent.source = event;
                    expect(EventSource.isMouse(event)).toBe(true);
                });
                it('should detect a PointerEvent, with a pointer type of mouse, wrapped in a reactjs event, as a MouseEvent', function() {
                    var reactEvent = {};
                    event = createPointerEvent();
                    event.pointerType = 'mouse';
                    reactEvent.source = event;
                    expect(EventSource.isMouse(event)).toBe(true);
                });
            }
        });

        if (pointerEventsAvailable) {
            describe('isPointer', function() {
                it('should detect a PointerEvent', function() {
                    event = createPointerEvent();
                    expect(EventSource.isPointer(event)).toBe(true);
                });
            });
        }

        describe('isTouch', function() {
            if (touchEventsAvailable) {
                it('should detect a TouchEvent', function() {
                    event = new window.UIEvent('touchstart');
                    event.constructor = window.TouchEvent;
                    expect(EventSource.isTouch(event)).toBe(true);
                });
            }

            if (pointerEventsAvailable) {
                it('should detect a PointerEvent, with a pointer type of touch, as a TouchEvent', function() {
                    event = createPointerEvent();
                    event.pointerType = 'touch';
                    expect(EventSource.isTouch(event)).toBe(true);
                });
            }
        });

        if (wheelEventsNewable) {
            describe('isWheel', function() {
                it('should detect a WheelEvent', function() {
                    event = new window.WheelEvent('mousewheel');
                    expect(EventSource.isWheel(event)).toBe(true);
                });
            });
        }
    });
});
