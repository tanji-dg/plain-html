'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('ionic:clean', function () {
  return $.del([path.join(conf.paths.ionic, '/www')]);
});

gulp.task('ionic:copy', ['ionic:clean'], function () {
  return gulp.src(conf.paths.dist + '/**/*')
    .pipe(gulp.dest(path.join(conf.paths.ionic, '/www')));
});
