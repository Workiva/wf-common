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

define(function() {
    'use strict';

    function checkEventType(event, type) {
        var match = false;
        if (event && type) {
            // Hammer events have a source property that is the original browser event.
            if (event.source && event.source instanceof type) {
                match = true;
            } else if (event instanceof type) {
                match = true;
            }
        }

        return match;
    };

    var EventSource = {
        isMouse: function (event) {
            var result = false;

            if (checkEventType(event, window.PointerEvent)) {
                // Treat MS pointer events with types of mouse and pen as mouse events.
                if (event.pointerType === 'mouse' || event.pointerType == 'pen') {
                    result = true;
                }
            } else {
                result = checkEventType(event, window.MouseEvent);
            }

            return result;
        },

        isPointer: function (event) {
            return checkEventType(event, window.PointerEvent);
        },

        isTouch: function (event) {
            var result = false;

            if (checkEventType(event, window.PointerEvent)) {
                // Treat MS pointer events with types of touch as touch events.
                if (event.pointerType === 'touch') {
                    result = true;
                }
            } else {
                result = checkEventType(event, window.TouchEvent);
            }

            return result;
        },

        // WheelEvents have a MouseEvent prototype, so are also MouseEvents
        isWheel: function (event) {
            return checkEventType(event, window.WheelEvent);
        },
    };

    return EventSource;
});
