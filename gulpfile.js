/**
 * Created by furier on 19/07/14.
 */
'use strict';

var path = require('path');

var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var rimraf = require('gulp-rimraf');
var rename = require('gulp-rename');
var concatCss = require('gulp-concat-css');
var livereload = require('gulp-livereload');

function startExpress() {
    require('./server');
}

gulp.task('css', function () {
    gulp.src('app/styles/**/*.css')
        .pipe(concatCss('bundle.css'))
        .pipe(gulp.dest('dist/app/styles'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/app/styles'));
});

gulp.task('uglify', function () {
    gulp.src('app/scripts/**/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/app/scripts'));
});

gulp.task('livereload', function () {
    livereload.listen();
    gulp.watch('dist/**').on('change', livereload.changed);
});

gulp.task('clean', function () {
    gulp.src('dist/**', { read: false })
        .pipe(rimraf());
})

gulp.task('default', ['livereload'], function() {
    startExpress();
    gulp.watch('app/styles/**/*.css', ['css']);
    gulp.watch('app/scripts/**/*.js', ['uglify']);
});