[![Build Status](https://travis-ci.org/WebFilings/wf-common.png)](https://travis-ci.org/WebFilings/wf-common)

WebFilings Common JavaScript Utilities
================================================================================

> Common JavaScript functionality for all WebFilings applications.


Consuming This Library
--------------------------------------------------------------------------------

- Distribution is through bower. _Don't forget to add the version to the end of the URL!_

```bash
# install bower if you haven't already
$ npm install -g bower

# install this package
$ bower install git@github.com:WebFilings/wf-js-common.git#{version}
```

- In your requirejs configuration, ensure the following config exists
for both wf-js-common and its dependencies:

```javascript
requirejs.config({
    paths: {
        'wf-js-common': 'path-to-bower_components/wf-js-common/src/',

        modernizr: 'path-to-bower_components/modernizr/modernizr'
    },
    shim: {
        modernizr: {
            exports: 'Modernizr'
        }
    }
});
```


Development: Getting Started
--------------------------------------------------------------------------------

```bash
# clone the repo
$ git clone git@github.com:WebFilings/wf-js-common.git
$ cd wf-js-common

# install global tools if you haven't already
$ npm install -g bower
$ npm install -g grunt-cli

# run init script
$ ./init.sh
```

The init script will initialize your local environment
and ensure that you have all global and local dependencies installed.

#### Quality Assurance

##### For Developers

To get started developing:

```bash
# ensure everything is working when checking out a new branch:
$ grunt qa

# setup lint and test watches and serve as you develop:
$ grunt dev
```

##### For QA

There's a special grunt task for you! It will:

- lint the code
- run the tests
- report on code coverage
- generate the API docs
- open the project web site so you can get going fast!

```bash
$ grunt qa
```

_You should run this every time you checkout a branch_.
It will do everything to get you going.

#### Project Structure

- `bower_components` libraries distributed by [Bower][Bower]
- `docs` project design and API documentation
- `node_modules` libraries distributed by [NPM][NPM]
- `out` output from build tasks
- `src` source files
- `test` test files
- `tools` supporting tools for code quality, builds, etc.

#### Managing Dependencies

Familiarize yourself with the package managers we use:

- [NPM][NPM] manages [Node][Node] dependencies.
- [Bower][Bower] manages web dependencies (like jquery, lodash, etc.).


Development: Process
--------------------------------------------------------------------------------

This project uses [wf-js-grunt](https://github.com/WebFilings/wf-js-grunt#tasks).
Please see that repo for more information.

[Node]: http://nodejs.org/api/
[NPM]: https://npmjs.org/
[Bower]: http://bower.io/

