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

define([
    'wf-js-common/consoleDev'
], function(
    console
) {
    'use strict';

    xdescribe('moxie:consoleDev', function() {

        it('Open your console, and click the line numbers...', function() {

            console.log('Click the line number, and it should take you to consoleSpec ->');
            //you should be here ^ after clicking the line number!

        });

        it('all the console methods work', function() {

            console.log('memory:', console.memory);

            console.debug('debug');
            console.dir({key:'value'});
            console.error('This error is expected');

            console.group('group');
            console.log('in a a group');
            console.log('still in a a group');
            console.groupEnd();

            console.groupCollapsed('groupCollapsed');
            console.log('in a a group');
            console.log('still in a a group');
            console.groupEnd();

            console.info('info');
            console.log('log');

            console.time('time label');
            console.timeEnd('time label');

            console.timeStamp('timeStamp');

            console.trace();
            console.warn('warn');

        });

    });

});
