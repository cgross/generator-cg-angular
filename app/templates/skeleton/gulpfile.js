//Experimental

/*jslint node: true */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var less = require('gulp-less');
var gCheerio = require('gulp-cheerio');
var ngHtml2js = require("gulp-ng-html2js");
var ngmin = require('gulp-ngmin');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-cssmin');
var packagejson = require('./package.json');
var streamqueue = require('streamqueue');
var rimraf = require('rimraf');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var stylish = require('jshint-stylish');
var domSrc = require('gulp-dom-src');

var htmlminOptions = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    // removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
};

gulp.task('clean', function() {
    rimraf.sync('dist');
});

gulp.task('css', ['clean'], function() {
    return gulp.src('app.less')
        .pipe(less())
        .pipe(cssmin({keepSpecialComments: 0}))
        .pipe(rename('app.full.min.css'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('js', ['clean'], function() {

    var templateStream = gulp.src(['!node_modules/**','!index.html','!_SpecRunner.html','!.grunt/**','!dist/**','!bower_components/**','**/*.html'])
        .pipe(htmlmin(htmlminOptions))
        .pipe(ngHtml2js({
            moduleName: packagejson.name
        }));

    var jsStream = domSrc({file:'index.html',selector:'script[data-build!="exclude"]',attribute:'src'});

    var combined = streamqueue({ objectMode: true });

    combined.queue(jsStream);
    combined.queue(templateStream);

    return combined.done()
        .pipe(concat('app.full.min.js'))
        .pipe(ngmin())
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));


    /* 
        Should be able to add to an existing stream easier, like:
        gulp.src([... partials html ...])
          .pipe(htmlmin())
          .pipe(ngHtml2js())
          .pipe(domSrc(... js from script tags ...))  <-- add new files to existing stream
          .pipe(concat())
          .pipe(ngmin())
          .pipe(uglify())
          .pipe(gulp.dest());

        https://github.com/wearefractal/vinyl-fs/issues/9
    */
});

gulp.task('indexHtml', ['clean'], function() {
    return gulp.src('index.html')
        .pipe(gCheerio(function ($) {
            $('script[data-remove!="exclude"]').remove();
            $('link').remove();
            $('body').append('<script src="app.full.min.js"></script>');
            $('head').append('<link rel="stylesheet" href="app.full.min.css">');
        }))
        .pipe(htmlmin(htmlminOptions))
        .pipe(gulp.dest('dist/'));
});

gulp.task('images', ['clean'], function(){
    return gulp.src('img/**')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/'));
});

gulp.task('fonts', ['clean'], function(){
    return gulp.src('bower_components/font-awesome/fonts/**')
        .pipe(gulp.dest('dist/bower_components/font-awesome/fonts/'));
});

gulp.task('jshint', function(){
    gulp.src(['!node_modules/**','!.grunt/**','!dist/**','!bower_components/**','**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('build', ['clean', 'css', 'js', 'indexHtml', 'images', 'fonts']);

/* 

-specifying clean dependency on each task is ugly
https://github.com/robrich/orchestrator/issues/26

-gulp-jasmine needs a phantomjs option
https://github.com/sindresorhus/gulp-jasmine/issues/2

*/

/*
    "gulp-dom-src": "~0.1.0",
    "gulp-concat": "~2.1.7",
    "gulp-uglify": "~0.2.1",
    "gulp-cssmin": "~0.1.3",
    "gulp-imagemin": "~0.1.5",
    "gulp-less": "~1.2.2",
    "gulp-cheerio": "~0.2.0",
    "gulp-rename": "~1.2.0",
    "gulp-ng-html2js": "~0.1.6",
    "gulp-ngmin": "~0.1.2",
    "gulp-htmlmin": "~0.1.2",
    "gulp-jshint": "~1.5.0",
    "gulp-jasmine": "~0.2.0",
    "jshint-stylish": "~0.1.5",
    "rimraf": "~2.2.6",
    "streamqueue": "0.0.5",
    "gulp": "~3.5.5"
*/