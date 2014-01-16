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

    /**
     * Create a new url object
     *
     * @classdesc
     * Represents a URL, and provides parsing of it.
     * This is a basic utility to parse URLs. It's expected to grow as we need
     * features. Treat a Url object as immutable.
     *
     * @name Url
     * @param {String|Window.Location} url
     * @constructor
     *
     * @example <caption>Parsing a String URL</caption>
     * var url = new Url('http://www.example.com?param1=arg1&amp;param2=arg2');
     * console.log(url.getParams()); // { param1: 'arg1', param2: 'arg2' }
     *
     * @example <caption>Parsing the current page's URL</caption>
     * var url = new Url(window.location);
     */
    var Url = function Url(url) {
        // Allow users to pass in window.location or just a URL
        this.url = String(url);
    };

    /**
     * The original URL passed to the constructor
     * @method Url#getHref
     * @returns {String}
     */
    Url.prototype.getHref = function() {
        return this.url;
    };

    /**
     * Alias for {@link Url#getHref}
     * @method Url#toString
     */
    Url.prototype.toString = Url.prototype.getHref;

    /**
     * The base URL
     * @method Url#getBaseUrl
     * @returns {String} The URL without the querystring
     */
    Url.prototype.getBaseUrl = function() {
        return this.url.split('?')[0];
    };

    /**
     * The querystring
     *
     * @method Url#getQuerystring
     * @returns {String} The querystring part of the URL
     *
     * @example
     * var url = new Url('http://www.youtube.com/results?search_query=cat');
     * console.log(url.getQuerystring()); // search_query=cat
     */
    Url.prototype.getQuerystring = function() {
        var qs = this.url.split('?')[1];
        return (typeof qs === 'undefined') ? '' : qs;
    };

    /**
     * @method Url#getParam
     *
     * @param {String} name The name of a querystring parameter
     * @returns {String} The value of a querystring parameter
     *
     * @example
     * var url = new Url('http://www.flickr.com/search/?q=cat&ss=0');
     * console.log(url.getParam('q')); // 'cat'
     */
    Url.prototype.getParam = function(name) {
        return this.getParams()[name];
    };

    /**
     * Returns an object with properties named after the
     * querystring parameters, and values from the arguments.
     *
     * @method Url#getParams
     * @returns {{}}
     *
     * @example
     * var url = new Url('http://www.flickr.com/search/?q=cat&ss=0');
     * console.log(url.getParams()); // { q: 'cat', ss: '0' }
     */
    Url.prototype.getParams = function() {
        var params = {};
        var querystring = this.getQuerystring();
        if (querystring.length < 1) {
            return {};
        }

        var arr = querystring.split('&');

        //for each name/value pair, create a property
        for (var i = 0; i < arr.length; i++) {
            var nameValue = arr[i].split('=');
            params[nameValue[0]] = nameValue[1];
        }

        return params;
    };

    /**
     * Adds a parameter to the Url and returns a new Url object
     * @method Url#addParam
     * @param {String} name The name of the querystring parameter
     * @param {String} value The value of the querystring parameter
     * @returns {Url}
     */
    Url.prototype.addParam = function(name, value) {
        //return a new Url with the added param

        var params = this.getParams();
        //todo: see if this param is already in the collection

        params[name] = value;

        var nameValues = [];
        for (var p in params) {
            if (params.hasOwnProperty(p)) {
                nameValues.push(p + '=' + params[p]);
            }
        }

        var s = this.getBaseUrl() + '?' + nameValues.join('&');
        return new Url(s);
    };

    return Url;
});
