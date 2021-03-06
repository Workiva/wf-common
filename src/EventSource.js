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

define(function() {
    'use strict';

    // IE10 uses numbers for pointer types.  Thanks.
    var MSPOINTER_TYPE_TOUCH = 2;
    var MSPOINTER_TYPE_PEN   = 3;
    var MSPOINTER_TYPE_MOUSE = 4;

    function getBrowserEvent(event) {
        var browserEvent = event;
        if (event.source) {
            // Hammer events have a source property that is the original browser event.
            browserEvent = event.source;
        } else if (event.nativeEvent) {
            // React events have a nativeEvent property that is the original browser event.
            browserEvent = event.nativeEvent;
        }

        return browserEvent;
    }

    /**
     * This is the actual workhorse of EventSource. It checks if the type of the event arg matches
     * the type arg. It handles generic browser events, and hammer events that have a event.source,
     * which is the original browser event.
     * @param  {Object} event The browser or hammer event to check
     * @param  {Object} type  The browser event you want to match
     * @return {Boolean} True if event and type are the same class, false otherwise.
     */
    function isEventOfType(event, type) {
        var match = false;

        if (event && type) {
            var browserEvent = getBrowserEvent(event);
            // We check the constructor, instead of using instanceof, because we cannot make
            // synthetic PointerEvents and TouchEvents right now.  There is an added benefit of not
            // worrying about inheritance; WheelEvents inherit from MouseEvents.  If we used
            // instanceof, a WheelEvent is also a MouseEvent.
            // http://stackoverflow.com/questions/29018151/how-do-i-programmatically-create-a-touchevent-in-chrome-41
            if (browserEvent.constructor === type) {
                match = true;
            }
        }

        return match;
    }

    function isPointerMouseOrPen(event) {
        var result = false;

        if (EventSource.isPointer(event)) {
            var pointerEvent = getBrowserEvent(event);
            var pType = pointerEvent.pointerType;

            if (pType === 'mouse' || pType === MSPOINTER_TYPE_MOUSE ||
                pType === 'pen' || pType === MSPOINTER_TYPE_PEN) {
                result = true;
            }
        }

        return result;
    }

    function isPointerTouch(event) {
        var result = false;

        if (EventSource.isPointer(event)) {
            var pointerEvent = getBrowserEvent(event);
            var pType = pointerEvent.pointerType;

            if (pType === 'touch' || pType === MSPOINTER_TYPE_TOUCH) {
                result = true;
            }
        }

        return result;
    }

    /**
     * Static functions that provide an easy way to tell what type of event you have.
     *
     * If you are wondering why this file looks like it has no coverage in Istanbul, it is because
     * most of the unit tests do not run in phantom.
     */
    var EventSource = {};

    EventSource.isPointer = function(event) {
        // PointerEvent is IE11, MSPointerEvent is IE10.
        return isEventOfType(event, window.PointerEvent) || isEventOfType(event, window.MSPointerEvent);
    };

    EventSource.isMouse = function(event) {
        var result = isPointerMouseOrPen(event) || isEventOfType(event, window.MouseEvent);
        return result;
    };

    EventSource.isTouch = function(event) {
        var result = isPointerTouch(event) || isEventOfType(event, window.TouchEvent);
        return result;
    };

    EventSource.isWheel = function(event) {
        return isEventOfType(event, window.WheelEvent);
    };

    return EventSource;
});
