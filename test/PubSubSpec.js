define(function(require) {
    'use strict';

    var ps = require('wf-js-common/PubSub');

    describe('PubSub', function() {

        var key = 'callme';

        beforeEach(function() {
            ps.unsubAll();
        });

        it('should call the subscriber callback', function() {
            var called = false;
            ps.sub(key, function() {
                called = true;
            });
            ps.pub(key);
            expect(called).toBe(true);
        });
        it('should unsubscribe a subscriber', function() {
            var fn = function() {
                called = true;
            };
            var called = false;
            ps.sub(key, fn);
            ps.unsub(key, fn);
            ps.pub(key)
            expect(called).toBe(false);
        });
        it('should unsubscribe all subscribers', function() {
            var fn = function() {
                called = true;
            };
            var called = false;
            ps.sub(key, fn);
            ps.sub(key + key, fn);
            ps.unsubAll();
            ps.pub(key);
            ps.pub(key + key);
            expect(called).toBe(false);
        });

    });
});
