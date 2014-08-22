/**
 * Created by furier on 19/07/14.
 */
'use strict';

var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var cssmin = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rimraf = require('gulp-rimraf');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var nodemon = require('gulp-nodemon');
var imagemin = require('gulp-imagemin');
var concatCss = require('gulp-concat-css');
var source = require('vinyl-source-stream');
var livereload = require('gulp-livereload');
var minifyHTML = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');

(function client() {

    (function html() {
        gulp.task('html', function () {
            gulp.src('app/views/**/*.html')
                .pipe(changed('dist/app/views'))
                //.pipe(minifyHTML())
                .pipe(gulp.dest('dist/app/views'));
        });
    }());

    (function images() {
        gulp.task('imagemin', function () {
            gulp.src('app/images/**')
                .pipe(changed('dist/app/images'))
                .pipe(imagemin())
                .pipe(gulp.dest('dist/app/images'));
        });
    }());

    (function styles() {
        gulp.task('css', function () {
            gulp.src('app/styles/**/*.css')
                //.pipe(concatCss('bundle.css'))
                .pipe(gulp.dest('dist/app/styles'))
                .pipe(cssmin())
                .pipe(rename({suffix: '.min'}))
                .pipe(gulp.dest('dist/app/styles'));
            gulp.src(['node_modules/alertifyjs/src/css/core.css',
                'node_modules/alertifyjs/src/css/themes/bootstrap/bootstrap.css'])
                .pipe(changed('dist/app/styles'))
                .pipe(concatCss('alertify.css'))
                .pipe(gulp.dest('dist/app/styles'))
                .pipe(cssmin())
                .pipe(rename({suffix: '.min'}))
                .pipe(gulp.dest('dist/app/styles'));
        });
        gulp.task('fonts', function () {
            gulp.src('app/fonts/**')
                .pipe(changed('dist/app/fonts'))
                .pipe(gulp.dest('dist/app/fonts'));
        });
    }());

    (function javaScript() {
        gulp.task('jshint', function () {
            gulp.src('app/scripts/**/*.js')
                .pipe(jshint('.jshintrc'))
                .pipe(jshint.reporter('default'));
        });
        gulp.task('uglify', function () {
            gulp.src('app/scripts/**/*.js')
                .pipe(changed('dist/app/scripts'))
                .pipe(gulp.dest('dist/app/scripts'))
                .pipe(ngAnnotate())
                .pipe(uglify())
                .pipe(rename({suffix: '.min'}))
                .pipe(gulp.dest('dist/app/scripts/min'));
        });
        //Using browserify to run once
        gulp.task('browserify', function () {
            var b = browserify();
            b.add('./app/scripts/app.js');
            b.bundle().pipe(source('bundle.js'))
                      .pipe(gulp.dest('dist/app/scripts'));
        });
        //Using watchify to watch changes and rebuild continuously
        gulp.task('watchify', function () {
            var bundler = watchify('./app/scripts/app.js');
            //bundler.transform('brfs');
            bundler.on('update', rebundle);
            function rebundle() {
                return bundler.bundle()
                    // log errors if they happen
                    .on('error', function (e) {
                        gutil.log('Browserify Error', e);
                    })
                    .pipe(source('bundle.js'))
                    .pipe(gulp.dest('dist/app/scripts'))
            }
            return rebundle();
        });
        gulp.task('js', ['jshint', 'uglify']);
    }());

    (function bowerComponents() {
        gulp.task('bower', function () {
            gulp.src('app/bower_components/**')
                .pipe(gulp.dest('dist/app/bower_components'));
        });
    }());

}());

(function server() {

    gulp.task('copy-server-to-dist', function () {
        if (!fs.existsSync('dist/wsdata.json')) {
            gulp.src('default.wsdata.json')
                .pipe(rename('wsdata.json'))
                .pipe(gulp.dest('dist'));
        }
        gulp.src(['server.js', 'package.json', '.bowerrc', 'bower.json'])
            .pipe(gulp.dest('dist'));
        gulp.src('lib/**')
            .pipe(gulp.dest('dist/lib'));
        gulp.src('assets/**')
            .pipe(gulp.dest('dist/assets'));
    });
    gulp.task('server', ['copy-server-to-dist'], function () {
        gulp.watch(['server.js', 'lib/**'], ['copy-server-to-dist']);
        // If nodemon starts too quick, files hasn't always been copied over before the server is started
        // resulting in nodemon crashing...
        setTimeout(function () {
            nodemon({ script: 'dist/server.js', ext: 'js', env: { 'NODE_ENV': 'development', 'DEBUG': null }, watch: ['lib', 'assets', 'server.js'] })
                .on('restart', function () {
                    console.log('restarted!')
                });
        }, 1000);
    });

}());

(function common() {
    gulp.task('livereload', function () {
        livereload.listen();
        gulp.watch([
            'dist/server.js',
            'dist/lib/**',
            'dist/assets/**',
            'dist/app/**'
        ]).on('change', livereload.changed);
    });
    gulp.task('clean', function () {
        gulp.src(['dist/app', 'dist/lib', 'dist/assets', 'dist/*.json', 'dist/server.js', 'dist/.bowerrc', '!dist/wsdata.json'], {
            read: false
        }).pipe(rimraf());
    });
}());

gulp.task('build', ['html', 'css', 'fonts', 'imagemin', 'bower'], function () {
    gulp.src(['app/.htaccess', 'app/robots.txt'])
        .pipe(gulp.dest('dist/app'));
});
gulp.task('build-prod', ['browserify', 'build']);
gulp.task('build-dev', ['watchify', 'build']);


gulp.task('dist', ['clean', 'copy-server-to-dist', 'build-prod']);

gulp.task('default', ['server', 'livereload', 'build-dev'], function () {
    gulp.watch('app/styles/**/*.css', ['css']);
    gulp.watch('app/views/**/*.html', ['html']);
    gulp.watch('app/fonts/**', ['fonts']);
    gulp.watch('app/bower_components/**', ['bower']);

    //watchify takes care of rebuilding JS when changes occurre
    //gulp.watch('app/scripts/**/*.js', ['js']);

    //websync currently doesn't use any images, so no need to run this task
    //gulp.watch('app/images/**/*.html', ['imagemin']);
});