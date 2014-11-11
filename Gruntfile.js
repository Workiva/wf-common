module.exports = function(grunt) {

    require('wf-grunt').init(grunt, {
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
                statements: 85,
                branches: 75,
                functions: 80,
                lines: 85
            },
        }
    });
};
