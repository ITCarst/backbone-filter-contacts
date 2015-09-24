// Karma configuration
// Generated on Sun Oct 20 2013 07:28:56 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // frameworks to use
    frameworks: ['jasmine', 'requirejs', 'sinon'],

    // list of files / patterns to load in the browser
    files: [
        {pattern: "node_modules/jquery/dist/jquery.min.js", included: false},
        {pattern: "node_modules/underscore/underscore-min.js", included: false},
        {pattern: "node_modules/backbone/backbone-min.js", included: false},
        {pattern: 'public/js/**/*.js', included: false},
        {pattern: 'test/**/*test.js', included: false},
        
        'test/test-main.js',
    ],

    // list of files to exclude
    exclude: [
       'public/js/app/main.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Firefox'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false

  });
};
