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

    /* global window */

    /**
     * Sets the object on window under a namespaced dot separated path
     * @param  {String} path dot separated path of where to place the object
     *         The last element is the name of the object
     *         Example: ns('path1.path2.ObjectName', obj);
     *         Example: ns('MyObject', obj); // places it directly on window
     * @param  {Object} object the object to set
     * @return {Object} the original object parameter or undefined if it was
     *                  unable to set it on window (empty path for example)
     */
    function namespace(path, object) {
        // replace everything but alphanumeric, $ _ and .
        // . will be split out ensuring valid js identifiers
        var pieces = (path || '').replace(/[^a-z0-9$_.]/gi,'').split('.');
        if (pieces.length === 0 || pieces[0] === '') {
            return undefined;
        }
        var addTo = window;
        if (pieces.length > 0) {
            var name = pieces.pop();
            for (var i = 0; i < pieces.length; i++) {
                var piece = pieces[i];
                addTo[piece] = addTo[piece] || Object.create(null);
                addTo = addTo[piece];
            }
            addTo[name] = object;
        }
        return object;
    }

    return namespace;
});
