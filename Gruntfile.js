module.exports = function(grunt) {

    require('wf-grunt').init(grunt, {
        jshint: {
            test: {
                src: ['test/**/*.js', '!**/packages/**']
            }
        },
        options: {
            sauceLabs: {
                buildNumber: process.env.TRAVIS_BUILD_NUMBER,
                testName: 'wf-common unit tests',
                username: process.env.SAUCE_LABS_USERNAME,
                accessKey: process.env.SAUCE_LABS_ACCESS_KEY
            },
            requireConfig: {
                paths: {
                    modernizr: 'bower_components/modernizr/modernizr',
                    lodash: 'bower_components/lodash/lodash',
                    bowser: 'bower_components/bowser/bowser',
                    'wf-js-common': './src',
                    'test': './test'
                },
                shim: {
                    modernizr: {
                        exports: 'Modernizr'
                    }
                }
            },
            wwwPort: 9200,
            coverageThresholds: {
                statements: 80,
                branches: 70,
                functions: 75,
                lines: 80
            },
        }
    });
};
