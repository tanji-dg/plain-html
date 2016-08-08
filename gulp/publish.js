'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var s3 = require('gulp-s3');

var nconf = require('nconf');
var ghPages = require('gulp-gh-pages');


gulp.task('deploy', ['build'], function() {
  return gulp.src(['./dist/**/*', 'CNAME'])
    .pipe(ghPages({
      remoteUrl: 'git@github.com:econdos/econdos.github.io.git',
      force: true,
      branch: 'master'
    }));
});

gulp.task('publish', ['deploy']);

// gulp.task('publish', ['bower', 'build'], function () {
//   var awsProperties = {
//     'key'    : conf.environment.AWS_KEY,
//     'secret' : conf.environment.AWS_SECRET,
//     'bucket' : conf.environment.AWS_BUCKET,
//     'region' : conf.environment.AWS_REGION
//   };

//   return gulp.src(path.join(conf.paths.dist, '/**'))
//     .pipe(s3(awsProperties));
// });
