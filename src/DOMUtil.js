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

    var fontStyleSheet;

    var initFontStyleSheet = function() {
        if(!fontStyleSheet) {
            var styleElement = document.createElement('style');
            styleElement.id = 'FONT_STYLE_TAG';
            document.documentElement.getElementsByTagName('head')[0]
                .appendChild(styleElement);

            fontStyleSheet = styleElement.sheet;
        }
    };

    /**
     * @classdesc
     * Assorted DOM Utilities.
     *
     * @exports DOMUtil
     */
    var DOMUtil = function(configuration) {

        this.window = configuration.window;
        this.document = configuration.document;
        this.navigator = configuration.navigator || navigator;

        this._preventWindowScrollInvoked = false;
    };

    DOMUtil.prototype = {
        /**
         * Append the given 'node' to the 'parent' element.
         *
         * @param {Object} node The HTML element to append to the parent
         * @param {Object} parent The HTML parent element to receive the node
         *
         * @returns {Object} The node appended to the parent
         */
        appendElement: function(node, parent) {
            parent.appendChild(node);
            return node;
        },

        /**
         * This method creates an element and sets its optional 'text'. The
         * element itself is not added to the DOM. If 'isHTML' is true then the
         * 'text' is treated as HTML and the 'innerHTML' property is set.
         * Otherwise the 'text' is treated as plain text and 'textContent' is
         * set instead.
         *
         * @param {String} name Name of the HTML element to create
         * @param {String} uniqueID Optional unique identifier
         * @param {String} text Optional text content
         * @param {Boolean} isHTML True if the text is HTML; Plain text otherwise
         *
         * @returns {Object} The requested HTML element
         */
        createElement: function(name, uniqueID, text, isHTML) {
            var node = document.createElement(name);
            if (uniqueID) {
                node.id = uniqueID;
            }

            if (text) {
                if (isHTML) {
                    node.innerHTML = text;
                } else {
                    node.textContent = text;
                }
            }
            return node;
        },

        /**
         * Given a path a script tag element will be created in the DOM (which will
         * automatically trigger a load).
         *
         * @param {String} filenamePath
         */
        loadJavascript: function(filenamePath) {
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', filenamePath);
            document.head.appendChild(script);
        },

        /**
         * Given a path a stylesheet element will be created in the DOM (which will
         * automatically trigger a load).
         *
         * @param {String} filenamePath
         */
        loadStylesheet: function(filenamePath) {
            var fileref = document.createElement('link');
            fileref.setAttribute('rel', 'stylesheet');
            fileref.setAttribute('type', 'text/css');
            fileref.setAttribute('href', filenamePath);
            document.head.appendChild(fileref);
        },

        /**
         * Loads a woff from bigsky by font defintion
         * @param fontDefinition
         */
        loadWoffFont: function(fontDefinition) {
            if (!fontStyleSheet) {
                initFontStyleSheet();
            }
            var rule = '@font-face {' +
                ('font-family: "' + fontDefinition.fontFamily + '";') +
                ('font-style: ' + fontDefinition.fontStyle + ';') +
                ('font-weight: ' + fontDefinition.fontWeight + ';');
            rule += ('src: url(' + fontDefinition.url + ');');
            rule += ('format("woff");}');
            fontStyleSheet.insertRule(rule, fontStyleSheet.cssRules.length);
        },

        /**
         * Loads a pdfjs or data font by definition and data
         * @param options
         * @param options.fontFamily - e.g. AdobeBlank
         * @param options.fontStyle - e.g. normal
         * @param options.fontWeight - e.g. bolder or 500
         * @param [options.url]
         *     The data URI. If not specified, you must pass the
         *     data argument to loadDataFont
         * @param [data]
         *     The base64 data. If not specified, you must specify
         *     the data URI in the options.url
         */
        loadDataFont: function(options, data) {
            if (!fontStyleSheet) {
                initFontStyleSheet();
            }

            var url;
            if (options.url && !data) {
                url = 'url({url});'.replace('{url}', options.url);
            }
            else {
                url = 'url(data:application/octet-stream;base64,' + data + ');';
            }

            var rule = '@font-face {\n';
            rule += '  font-family: "'  +   options.fontFamily + '";\n';
            rule += '  font-style: '    +   options.fontStyle + ';\n';
            rule += '  font-weight: '   +   options.fontWeight + ';\n';
            rule += '  src: ' + url + ';\n';
            rule += '}';

            fontStyleSheet.insertRule(rule, fontStyleSheet.cssRules.length);
        },

        loadFontByData: function(fontDefinition, data) {
            var node = document.createElement('style');
            node.type = 'text/css';
            node.innerHTML = '@font-face {' +
                ('font-family: "' + fontDefinition.fontFamily + '";') +
                ('font-style: '   + fontDefinition.fontStyle  + ';') +
                ('font-weight: '  + fontDefinition.fontWeight + ';');
            node.innerHTML += ('src: url(' + data + ');}');
            document.head.appendChild(node);
        },


        /**
         * Load the given font by adding a Style element to the head of the
         * document. This method does not return a value.
         *
         * @param {Object} fontDefinition Font object (Family, Style, etc.)
         * @param {Boolean} embedded True if this is an embedded font
         * @param {String} format Optional string indicating the font format
         * @param {String} prefix allows a URL prefix to be prepended
         */
        loadFontFace: function(fontDefinition, embedded, format, prefix) {
            var node = document.createElement('style');

            if (!prefix) {
                prefix = '';
            }

            node.type = 'text/css';
            node.innerHTML = '@font-face {' +
                ('font-family: "' + prefix + fontDefinition.fontFamily + '";') +
                ('font-style: '   + fontDefinition.fontStyle  + ';') +
                ('font-weight: '  + fontDefinition.fontWeight + ';');
            if (embedded) {
                node.innerHTML += ('src: url(' + fontDefinition.url + ');}');
            } else {
                node.innerHTML += ('src: url("' + fontDefinition.url + '")');
                if (format && format.length > 0) {
                    node.innerHTML += (' format("' + format + '");}');
                } else {
                    node.innerHTML += ';}';
                }
            }
            document.head.appendChild(node);
        },

        /**
         * Remove an element from the DOM given its unique identifier. This
         * method does not return a value.
         *
         * @param {String} uniqueID Unique string used to identify the element
         */
        removeElement: function(uniqueID) {
            var node = document.getElementById(uniqueID);
            if (node && node.parentNode) {
                node.parentNode.removeChild(node);
            }
            node = null;
        },

        /**
         * Remove an element from the DOM given the actual DOM element.
         * This method does not return a value.
         *
         * @param {Node} node
         */
        removeElementNode: function(node) {
            if (node && node.parentNode) {
                node.parentNode.removeChild(node);
            }
            node = null;
        },

        addClass: function(element, names) {
            element.className = element.className + ' ' + names.join(' ');
        },

        addStyles: function(element, styles) {
            for (var key in styles) {
                if (styles.hasOwnProperty(key)) {
                    if (key in element.style) {
                        element.style[key] = styles[key];
                    }
                }
            }
        },

        hasClass: function(element, cls) {
            return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
        },

        /**
         * Creates an event that can be dispatched via the DOM.
         * @param {string} type - The type of the event.
         * @returns {*}
         */
        createEvent: function(type) {
            var event;

            if (document.createEvent) {
                event = this.document.createEvent('HTMLEvents');
                event.initEvent(type, true, true);
            }
            else {
                event = this.document.createEventObject();
                event.eventType = type;
            }

            return event;
        },

        width: function(element) {
            var boundingRect = element.getBoundingClientRect();
            var width = boundingRect.width;

            if (width === 0 && element.style.display === 'none') {
                this.makeMeasureReady(element, function(element) {
                    width = element.getBoundingClientRect().width;
                });
            }
            else if (width === 0 && element.style.display === '') {
                var parent = element.parentElement;
                while (parent !== null && parent.offsetWidth === 0) {
                    parent = parent.parentElement;
                }
                if (parent) {
                    width = parent.getBoundingClientRect().width;
                }
            }

            return width;
        },

        height: function(element) {
            var height = element.offsetHeight;

            if (height === 0 && element.style.display === 'none') {
                this.makeMeasureReady(element, function(element) {
                    height = element.offsetHeight;
                });
            }
            else if (height === 0 && element.style.display === '') {
                var parent = element.parentElement;
                while (parent !== null && parent.offsetHeight === 0) {
                    parent = parent.parentElement;
                }
                if (parent) {
                    height = parent.offsetHeight;
                }
            }

            return height;
        },

        /**
         * Ensure that the given element is ready for display.
         *
         * @param {HTMLElement} element
         * @param {Function} callback
         */
        makeMeasureReady: function(element, callback) {
            // remember the old css properties and simply invoke callback if the
            // element is already displayed.
            var style = element.style;
            var oldDisplay = style.display;
            if (oldDisplay !== 'none') {
                return callback(element);
            }

            var oldPosition = style.position;
            var oldVisibility = style.visibility;

            // temporarily show it in a hidden state for measuring
            style.position = 'absolute';
            style.visibility = 'hidden';
            style.display = 'block';

            // allow access to element before we hide it again
            callback(element);

            // put it back how it was
            style.display = 'none';
            style.position = oldPosition;
            style.visibility = oldVisibility;
        },

        /**
         * Returns the current y-direction scroll position of the page.
         * @returns {Number}
         */
        scrollY: function() {
            return this.window.pageYOffset || (this.document.documentElement ||
                                           this.document.body.parentNode ||
                                           this.document.body).scrollTop;
        },

        /**
         * Prevent device-initiated window scrolling that occurs during orientation
         * changes and virtual keyboard dismissal on iOS7 mobile safari.
         *
         * This method should only be called for full-screen applications that do
         * not need window scrolling.
         */
        preventIOS7WindowScroll: function() {

            // ignore non iOS7 mobile safari agents
            var navigator = this.navigator;
            if (!navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)) {
                return;
            }

            if (this._preventWindowScrollInvoked) {
                return;
            }

            var window = this.window;
            var resetWindowScrollInterval;

            var clearResetWindowScrollInterval = function() {
                if (resetWindowScrollInterval) {
                    window.clearInterval(resetWindowScrollInterval);
                    resetWindowScrollInterval = null;
                }
            };
            var resetWindowScroll = function() {
                if (window.scrollY) {
                    window.scrollTo(0, 0);
                }
            };

            resetWindowScroll();

            // is the specified scrollY value within the range of values that
            // iOS7 tends to involuntary shift content?
            var isWithinInvoluntaryScrollRange = function(scrollY) {
                return ((scrollY > 18 && scrollY < 22) || (scrollY === 64));
            };

            // On scroll events, which are dispatched both when the orientation
            // changes and when the virtual keyboard is shown, test the amount of
            // vertical window scroll and reset if/when applicable.
            window.addEventListener('scroll', function() {

                var scrollY = window.scrollY;

                // If the scroll is within the range that iOS 7 applies after
                // rotating into landscape orientation, reset
                if (isWithinInvoluntaryScrollRange(scrollY)) {
                    resetWindowScroll();
                }
                // Otherwise, if there is some scroll, then we assume the virtual
                // keyboard is shown. In this case, check for the dismissal of the
                // keyboard by testing the scroll value until it is reset or
                // until it is restored to the goofy OS offset. Once the keyboard
                // is dismissed, reset the scroll position. :(
                else if (scrollY) {
                    clearResetWindowScrollInterval();
                    resetWindowScrollInterval = window.setInterval(function() {
                        var currentScrollY = window.scrollY;
                        if (isWithinInvoluntaryScrollRange(currentScrollY)) {
                            resetWindowScroll();
                            clearResetWindowScrollInterval();
                        }
                        else if (!currentScrollY) {
                            clearResetWindowScrollInterval();
                        }
                    }, 100);
                }
            });

            this._preventWindowScrollInvoked = true;
        },

        /**
         * Dismiss virtual keyboard and scroll to origin during orientation
         * changes in iOS7, as iOS7 can't seem to repaint absolutely positioned
         * layouts correctly.
         *
         * This method should only be called for full-screen applications that do
         * not need window scrolling.
         */
        dismissIOS7VirtualKeyboardOnOrientationChange: function() {
            // ignore non iOS7 mobile safari agents
            var navigator = this.navigator;
            if (!navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)) {
                return;
            }

            var self = this;
            this.window.addEventListener('orientationchange', function() {
                var el = self.document.activeElement;
                if (el) {
                    el.blur();
                    self.window.scrollTo(0, 0);
                }
            });
        }
    };

    DOMUtil.prototype.constructor = DOMUtil;

    return new DOMUtil({
        window: window,
        document: document
    });
});
