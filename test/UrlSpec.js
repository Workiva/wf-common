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

    var Url = require('wf-js-common/Url');

    describe('Url.js Specs', function() {

        describe('Given the URL: http://www.example.com?param1=arg1&param2=arg2', function() {
            //treating url as immutable, so not putting it in a beforeEach
            var url = new Url('http://www.example.com?param1=arg1&param2=arg2');

            it('creates an object', function() {
                expect(url).not.toBeUndefined();
            });

            it('toString() returns the url', function() {
                expect(url.toString()).toBe('http://www.example.com?param1=arg1&param2=arg2');
            });

            it('gets base URL', function() {
                expect(url.getBaseUrl()).toBe('http://www.example.com');
            });

            it('gets the querystring from URL', function() {
                expect(url.getQuerystring()).toBe('param1=arg1&param2=arg2');
            });

            it('parses the querystring into parameters', function() {
                var params = url.getParams();
                expect(params.param1).toBe('arg1');
                expect(params.param2).toBe('arg2');
            });

            it('returns undefined for unknown parameters', function() {
                expect(url.getParam('nonExistant')).toBeUndefined();
            });

            it('gets individual querystring parameters', function() {
                var param = url.getParam('param1');
                expect(param).toBe('arg1');
            });

            it('adds parameters to existing querystring', function() {
                var newUrl = url.addParam('param3', 'arg3');
                //todo: don't rely on order of parameters
                expect(newUrl.toString())
                    .toBe('http://www.example.com?param1=arg1&param2=arg2&param3=arg3');
            });

        });

        describe('Given the url: http://www.example.com', function() {
            var url = new Url('http://www.example.com');

            it('adds a parameter to empty querystring', function() {
                var newUrl = url.addParam('new_param', 'new_arg');
                var querystring = newUrl.getQuerystring();
                expect(querystring).toBe('new_param=new_arg');
            });

        });

        describe('When constructed from window.location', function() {
            var url = new Url(window.location);

            it('creates an object', function() {
                expect(url).not.toBeUndefined();
            });

        });

    });


});
