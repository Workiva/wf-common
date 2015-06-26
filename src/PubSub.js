/*
 * Copyright 2015 WebFilings, LLC
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

    // polyfill Array.isArray if needed
    if (!Array.isArray) {
      Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
      };
    }

    function joinName(name) {
        if (name && Array.isArray(name)) {
            name = name.join('_');
        }
        return name;
    }

    function PubSub() {
        this.subs = {};
    }

    PubSub.prototype = {

        sub: function sub(name, callback) {
            name = joinName(name);
            if (!this.subs[name]) {
              this.subs[name] = [];
            }

            this.subs[name].push(callback);
        },

        unsub: function unsub(name, callback) {
            name = joinName(name);
            if (!this.subs[name]) {
              return;
            }

            var index = this.subs[name].indexOf(callback);

            if (index === -1){
              return;
            }

            this.subs[name].splice(index, 1);
        },

        pub: function pub(name, message) {
            name = joinName(name);
            if (!this.subs[name]) {
              return;
            }
            var thesubs = this.subs[name];
            for (var i = 0; i < thesubs.length; i++) {
                var subscriber = thesubs[i];
                subscriber(message);
            }
        },

        unsubAll: function unsubAll() {
            this.subs = {};
        }
    };

    var _instance;
    if (!_instance) {
        _instance = new PubSub();
    }

    return _instance;
});
