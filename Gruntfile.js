module.exports = function(grunt) {

    require('wf-grunt').init(grunt, {
        options: {
            requireConfig: {
                paths: {
                    lodash: 'bower_components/lodash/dist/lodash',
                    modernizr: 'bower_components/modernizr/modernizr',
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
