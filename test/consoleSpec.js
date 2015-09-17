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
    'wf-js-common/console'
], function(
    console
) {
    'use strict';

    describe('moxie:console', function() {

        it('Open your console, you should see nothing...', function() {

            console.log('memory:', console.memory);

            console.debug('debug');
            console.dir({key:'value'});
            console.error('error');

            console.group('group');
            console.groupEnd('');

            console.groupCollapsed('groupCollapsed');
            console.info('info');
            console.log('log');

            console.time('time');
            console.timeEnd();

            console.timeStamp('timeStamp');

            console.trace();
            console.warn('warn');

        });

    });

});
