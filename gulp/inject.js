'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var fs = require('fs');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function() {
  browserSync.reload();
});

gulp.task('inject', ['ioconfig', 'scripts', 'styles', 'fonts', 'img'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], { read: false });

  var injectScripts = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.js')
  ], { read: false });

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.preprocess({context : conf.environment}))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});


gulp.task('ioconfig', function () {
  var src = path.join(conf.wiredep.directory, 'ionic-platform-web-client/dist/ionic.io.bundle*.js');
  var dest = path.join(conf.wiredep.directory, 'ionic-platform-web-client/dist');
  var ioconfig = fs.readFileSync(path.join(conf.paths.ionic, '.io-config.json'), "utf8").slice(0, -1);
  var start = '"IONIC_SETTINGS_STRING_START";var settings =';
  var end =  '; return { get: function(setting) { if (settings[setting]) { return settings[setting]; } return null; } };"IONIC_SETTINGS_STRING_END"';
  var replaceBy = start + ioconfig + end;

  // log('inject .io-config in ionic.io.bundle.js');
  gulp.src(src)
    .pipe($.replace(/"IONIC_SETTINGS_STRING_START.*IONIC_SETTINGS_STRING_END"/, replaceBy))
    .pipe(gulp.dest(dest));
});
