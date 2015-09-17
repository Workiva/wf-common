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

    var Compatibility = require('wf-js-common/Compatibility');

    describe('Compatibility', function() {
        it('should create a console if it is undefined', function () {
            var tempWindow = {
                console: undefined,
                CustomEvent: function(){}
            };
            var testConfiguration = {
                window: tempWindow
            };
            var testCompatibility = new Compatibility.constructor(testConfiguration);

            expect(testCompatibility).toBeDefined();
            expect(tempWindow.console.debug).toBeDefined();
            expect(tempWindow.console.error).toBeDefined();
            expect(tempWindow.console.log).toBeDefined();
            expect(tempWindow.console.warn).toBeDefined();
        });

        it('should test all of the generated console functions', function() {
            var tempWindow = {
                console: undefined,
                CustomEvent: function(){}
            };

            var testConfiguration = {
                window: tempWindow
            };

            var testCompatibility = new Compatibility.constructor(testConfiguration);

            expect(testCompatibility).toBeDefined();
            expect(tempWindow.console.debug).not.toThrow();
            expect(tempWindow.console.error).not.toThrow();
            expect(tempWindow.console.log).not.toThrow();
            expect(tempWindow.console.warn).not.toThrow();
        });

        it('should not do anything if window.console is defined', function () {
            var testConfiguration = {
                window: window
            };

            var expectedConsole = window.console;
            var testCompatibility = new Compatibility.constructor(testConfiguration);
            expect(testCompatibility).toBeDefined();
            expect(window.console).toBe(expectedConsole);
        });

        it('should polyfill the CustomEvent constructor if it is an object', function() {
            var tempWindow = {
                CustomEvent: {},
                Event: {
                    prototype: {}
                }
            };

            var testConfiguration = {
                window: tempWindow
            };

            var testCompatibility = new Compatibility.constructor(testConfiguration);
            expect(testCompatibility).toBeDefined();
            expect(tempWindow.CustomEvent).toEqual(jasmine.any(Function));
            expect(tempWindow.CustomEvent).not.toEqual(jasmine.any(Object));
        });

        it('should polyfill the CustomEvent constructor if it is undefined', function() {
            var tempWindow = {
                CustomEvent: undefined,
                Event: {
                    prototype: {}
                }
            };

            var testConfiguration = {
                window: tempWindow
            };

            var testCompatibility = new Compatibility.constructor(testConfiguration);
            expect(testCompatibility).toBeDefined();
            expect(tempWindow.CustomEvent).toEqual(jasmine.any(Function));
            expect(tempWindow.CustomEvent).not.toEqual(jasmine.any(Object));
        });

        it('should not polyfill the CustomEvent constructor if it is a function', function() {
            var mockObject = {
                test: 'valid'
            };

            var tempWindow = {
                CustomEvent: function() { return mockObject; },
                Event: {
                    prototype: {}
                }
            };

            var testConfiguration = {
                window: tempWindow
            };

            var result = testConfiguration.window.CustomEvent();

            var testCompatibility = new Compatibility.constructor(testConfiguration);
            expect(testCompatibility).toBeDefined();
            expect(result).toEqual(mockObject);
        });

        it('should polyfill atob if it is undefined', function() {
            var testBtoa = function () {};
            var tempWindow = {
                btoa: testBtoa,
                CustomEvent: function(){},
                Event: {
                    prototype: {}
                }
            };
            var testConfiguration = {
                window: tempWindow
            };

            var testCompatibility = new Compatibility.constructor(testConfiguration);

            expect(testCompatibility).toBeDefined();
            expect(tempWindow.atob).toEqual(jasmine.any(Function));
        });

        it('should polyfill atob if it is undefined', function() {
            var testBtoa = function () {};
            var tempWindow = {
                btoa: testBtoa,
                CustomEvent: function(){},
                Event: {
                    prototype: {}
                }
            };
            var testConfiguration = {
                window: tempWindow
            };

            var testCompatibility = new Compatibility.constructor(testConfiguration);

            var testInput = 'dGVzdA==';
            var expectedOutput = 'test';
            var output = tempWindow.atob(testInput);

            expect(testCompatibility).toBeDefined();
            expect(output).toEqual(expectedOutput);
        });

        it('should polyfill btoa if it is undefined', function() {
            var testAtob = function () {};
            var tempWindow = {
                atob: testAtob,
                CustomEvent: function(){},
                Event: {
                    prototype: {}
                }
            };
            var testConfiguration = {
                window: tempWindow
            };

            var testCompatibility = new Compatibility.constructor(testConfiguration);

            expect(testCompatibility).toBeDefined();
            expect(tempWindow.btoa).toEqual(jasmine.any(Function));
        });

        it('should polyfill btoa if it is undefined', function() {
            var testAtob = function () {};
            var tempWindow = {
                atob: testAtob,
                CustomEvent: function(){},
                Event: {
                    prototype: {}
                }
            };
            var testConfiguration = {
                window: tempWindow
            };

            var testCompatibility = new Compatibility.constructor(testConfiguration);

            var testInput = 'test';
            var expectedOutput = 'dGVzdA==';
            var output = tempWindow.btoa(testInput);

            expect(testCompatibility).toBeDefined();
            expect(output).toEqual(expectedOutput);
        });

        it('should not polyfill atob/btoa if they are both defined', function() {
            var testAtob = function () {};
            var testBtoa = function () {};

            var tempWindow = {
                CustomEvent: function(){},
                Event: {
                    prototype: {}
                },
                atob: testAtob,
                btoa: testBtoa
            };

            var testConfiguration = {
                window: tempWindow
            };

            var testCompatibility = new Compatibility.constructor(testConfiguration);
            expect(testCompatibility).toBeDefined();
            expect(tempWindow.atob).toEqual(testAtob);
            expect(tempWindow.btoa).toEqual(testBtoa);
        });
    });
});
