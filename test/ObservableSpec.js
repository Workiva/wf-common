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

define(function(require) {
    'use strict';

    var Observable = require('wf-js-common/Observable');

    describe('Observable', function() {
        describe('Constructor', function() {
            it('should create an Observable class', function() {
                var Ship = function() {
                    this.onHitIceberg = Observable.newObservable(this);
                };

                var titanic = new Ship();

                expect(titanic.onHitIceberg).toBeDefined();
            });
        });

        describe('dispatch', function() {
            it('should dispatch the observable to two observers', function() {
                var Ship = function() {
                    this.onHitIceberg = Observable.newObservable(this);
                };

                var City = function(name) {
                    var self = this;
                    this.name = name;
                    this.sendingHelp = false;
                    this.receivedRadioTransmission = function() {
                        self.sendingHelp = true;
                    };
                };

                var titanic = new Ship();

                var newYork = new City('New York');
                var southHampton = new City('South Hampton');

                // register New York
                titanic.onHitIceberg(newYork.receivedRadioTransmission);

                // register South Hampton
                titanic.onHitIceberg(southHampton.receivedRadioTransmission);

                expect(newYork.sendingHelp).toBe(false);
                expect(southHampton.sendingHelp).toBe(false);

                // the titanic hits an iceberg
                titanic.onHitIceberg.dispatch();

                expect(newYork.sendingHelp).toBe(true);
                expect(southHampton.sendingHelp).toBe(true);
            });

            it('should dispatch the observable and call a callback', function() {
                var self = this;
                this.callbackFunctionExecuted = false;
                var Ship = function() {
                    this.onHitIceberg = Observable.newObservable(this);
                };

                var City = function(name) {
                    var self = this;
                    this.name = name;
                    this.sendingHelp = false;
                    this.receivedRadioTransmission = function() {
                        self.sendingHelp = true;
                    };
                };

                var callback = function() {
                    self.callbackFunctionExecuted = true;
                };

                var titanic = new Ship();

                var newYork = new City('New York');

                // register New York
                titanic.onHitIceberg(newYork.receivedRadioTransmission);

                expect(newYork.sendingHelp).toBe(false);
                expect(this.callbackFunctionExecuted).toBe(false);

                // the titanic hits an iceberg
                titanic.onHitIceberg.dispatch([], callback);

                expect(newYork.sendingHelp).toBe(true);
                expect(this.callbackFunctionExecuted).toBe(true);
            });

            it('should gracefully handle a change to its registered function list during a dispatch', function() {
                var observable = Observable.newObservable();
                var function1Called = false;
                var function1 = function() {
                    observable.remove(function2);
                    observable.remove(function3);
                    function1Called = true;
                };
                var function2Called = false;
                var function2 = function() {
                    if (!function3Called && function1Called) {
                        function2Called = true;
                    } else {
                        throw new Error('Functions called out of order');
                    }
                };
                var function3Called = false;
                var function3 = function() {
                    if (function1Called && function2Called) {
                        function3Called = true;
                    } else {
                        throw new Error('Functions called out of order');
                    }
                };
                observable(function1);
                observable(function2);
                observable(function3);

                observable.dispatch();

                expect(function1Called).toBe(true);
                expect(function2Called).toBe(true);
                expect(function3Called).toBe(true);
            });
        });




        describe('dispatchOn', function() {
            it('should dispatch on the dispatch of another observer', function() {
                var Ship = function() {
                    this.onHitIceberg = Observable.newObservable(this);
                };

                var City = function(name) {
                    var self = this;
                    this.name = name;
                    this.sendingHelp = false;
                    this.receivedRadioTransmission = function() {
                        self.sendingHelp = true;
                    };
                    this.onSendingHelp = Observable.newObservable(this);
                };

                var NewsStation = function(name) {
                    var self = this;
                    this.name = name;
                    this.broadcastingNewNews = false;
                    this.receiveNews = function() {
                        self.broadcastingNewNews = true;
                    };
                };

                var titanic = new Ship();

                var newYork = new City('New York');
                var southHampton = new City('South Hampton');

                var ABC = new NewsStation('ABC');

                // register New York and South Hampton to titanic's onHitIceberg observable
                titanic.onHitIceberg(newYork.receivedRadioTransmission);
                titanic.onHitIceberg(southHampton.receivedRadioTransmission);

                // register ABC to New York's onSendingHelp observable
                newYork.onSendingHelp(ABC.receiveNews);

                // onSendingHelp dispatches when onHitIceberg dispatches
                newYork.onSendingHelp.dispatchOn(titanic.onHitIceberg);

                expect(newYork.sendingHelp).toBe(false);
                expect(southHampton.sendingHelp).toBe(false);
                expect(ABC.broadcastingNewNews).toBe(false);

                // the titanic hits an iceberg
                titanic.onHitIceberg.dispatch();

                expect(newYork.sendingHelp).toBe(true);
                expect(southHampton.sendingHelp).toBe(true);
                expect(ABC.broadcastingNewNews).toBe(true);

            });
        });

        describe('dispose', function() {
            it('should dispose an observable', function() {
                var Ship = function() {
                    this.onHitIceberg = Observable.newObservable(this);
                };

                var titanic = new Ship();

                expect(titanic.onHitIceberg.dispose).not.toThrow();
            });
        });

        describe('remove', function() {
            it('should remove a subscriber from the observable', function() {
                var Ship = function() {
                    this.onHitIceberg = Observable.newObservable(this);
                };

                var City = function(name) {
                    var self = this;
                    this.name = name;
                    this.sendingHelp = false;
                    this.receivedRadioTransmission = function() {
                        self.sendingHelp = true;
                    };
                };

                var titanic = new Ship();

                var newYork = new City('New York');
                var southHampton = new City('South Hampton');

                // register New York
                titanic.onHitIceberg(newYork.receivedRadioTransmission);

                // register South Hampton
                titanic.onHitIceberg(southHampton.receivedRadioTransmission);

                // un-register South Hampton
                titanic.onHitIceberg.remove(southHampton.receivedRadioTransmission);

                expect(newYork.sendingHelp).toBe(false);
                expect(southHampton.sendingHelp).toBe(false);

                // the titanic hits an iceberg
                titanic.onHitIceberg.dispatch();

                expect(newYork.sendingHelp).toBe(true);
                expect(southHampton.sendingHelp).toBe(false);
            });

            it('should remove a subscriber from a chained observable', function() {
                var Ship = function() {
                    this.onHitIceberg = Observable.newObservable(this);
                };

                var City = function(name) {
                    var self = this;
                    this.name = name;
                    this.sendingHelp = false;
                    this.receivedRadioTransmission = function() {
                        self.sendingHelp = true;
                    };
                    this.onSendingHelp = Observable.newObservable(this);
                };

                var NewsStation = function(name) {
                    var self = this;
                    this.name = name;
                    this.broadcastingNewNews = false;
                    this.receiveNews = function() {
                        self.broadcastingNewNews = true;
                    };
                };

                var titanic = new Ship();

                var newYork = new City('New York');
                var southHampton = new City('South Hampton');

                var BBC = new NewsStation('BBC');
                var ABC = new NewsStation('ABC');

                // register New York and South Hampton to titanic's onHitIceberg observable
                titanic.onHitIceberg(newYork.receivedRadioTransmission);
                titanic.onHitIceberg(southHampton.receivedRadioTransmission);

                // onSendingHelp dispatches when onHitIceberg dispatches
                newYork.onSendingHelp.dispatchOn(titanic.onHitIceberg);

                // register ABC to New York's onSendingHelp observable
                newYork.onSendingHelp(ABC.receiveNews);
                newYork.onSendingHelp(BBC.receiveNews);

                // un-register ABC from New York
                newYork.onSendingHelp.remove(ABC.receiveNews);

                expect(newYork.sendingHelp).toBe(false);
                expect(southHampton.sendingHelp).toBe(false);
                expect(ABC.broadcastingNewNews).toBe(false);
                expect(BBC.broadcastingNewNews).toBe(false);

                // the titanic hits an iceberg
                titanic.onHitIceberg.dispatch();

                expect(newYork.sendingHelp).toBe(true);
                expect(southHampton.sendingHelp).toBe(true);
                expect(ABC.broadcastingNewNews).toBe(false);
                expect(BBC.broadcastingNewNews).toBe(true);
            });

            it('shouldn\'t remove a subscriber if it doesn\'t exist', function() {
                var Ship = function() {
                    this.onHitIceberg = Observable.newObservable(this);
                };

                var City = function(name) {
                    var self = this;
                    this.name = name;
                    this.sendingHelp = false;
                    this.receivedRadioTransmission = function() {
                        self.sendingHelp = true;
                    };
                };

                var titanic = new Ship();

                var newYork = new City('New York');
                var southHampton = new City('South Hampton');

                // register South Hampton
                titanic.onHitIceberg(southHampton.receivedRadioTransmission);

                // un-register unknown observer
                titanic.onHitIceberg.remove(newYork.receivedRadioTransmission);

                expect(newYork.sendingHelp).toBe(false);
                expect(southHampton.sendingHelp).toBe(false);

                // the titanic hits an iceberg
                titanic.onHitIceberg.dispatch();

                expect(newYork.sendingHelp).toBe(false);
                expect(southHampton.sendingHelp).toBe(true);
            });
        });
    });
});