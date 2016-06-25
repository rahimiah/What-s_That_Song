'use strict'

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload');

gulp.task('server', function(){
  livereload.listen();

  nodemon({
    script:'server.js',
    ext: 'js'
  }).on('restart', function(){
    gulp.src('server.js')
        .pipe(livereload());
  });
});

gulp.task('sass', function(){
  gulp.src('./src/assets/stylesheets/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('./src/assets'));
});

gulp.task('watch', function(){
  gulp.watch('./src/assets/stylesheets/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.js', ['server']);
});

gulp.task('build', ['sass']);
gulp.task('default', ['sass','server','watch']);
