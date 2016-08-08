/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');
var nconf = require('nconf');

nconf.argv().env().file({file: 'config.json'});

/**
 * Environment Variables
 */
exports.environment = {
  'ENV'           : nconf.get('ENV'),
  'BACKEND_URL'   : nconf.get('BACKEND_URL'),
  'APP_SECRET'    : nconf.get('APP_SECRET'),
  'AWS_KEY'       : nconf.get('AWS_KEY'),
  'AWS_SECRET'    : nconf.get('AWS_SECRET'),
  'AWS_BUCKET'    : nconf.get('AWS_BUCKET'),
  'AWS_REGION'    : nconf.get('AWS_REGION'),
  'PUSHER_APP_KEY': nconf.get('PUSHER_APP_KEY')
};

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src : 'src',
  dist: 'dist',
  tmp : '.tmp',
  publish : '.publish',
  e2e : 'e2e'
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude  : [/\/bootstrap\.js$/, /\/bootstrap-sass\/.*\.js/, /\/bootstrap\.css/],
  directory: 'bower_components'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title) {
  'use strict';

  return function (err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
