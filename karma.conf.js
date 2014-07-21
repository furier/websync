// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/angularjs-scroll-glue/src/scrollglue.js',
      'app/bower_components/restangular/dist/restangular.js',
      'app/bower_components/lodash/dist/lodash.js',
      'app/bower_components/underscore.string/lib/underscore.string.js',
      'app/bower_components/socket.io-client/dist/socket.io.js',
      'app/bower_components/ng-socket-io/ng-socket-io.js',
      'app/bower_components/react/react.js',
      'app/bower_components/jstree/dist/jstree.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/client/mock/**/*.js',
      'test/client/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
