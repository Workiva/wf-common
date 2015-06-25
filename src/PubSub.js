define(function(require) {
    'use strict';

    function PubSub() {
        this.subs = {};
    }

    PubSub.prototype = {

        sub: function sub(name, callback) {
            if (!this.subs[name]) {
              this.subs[name] = [];
            }

            this.subs[name].push(callback);
        },

        unsub: function unsub(name, callback) {
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
