/*jslint node: true */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');<% if (css === 'LESS') { %>
var less = require('gulp-less');<% } else { %>
var sass = require('gulp-sass');<% } %>
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
var domSrc = require('gulp-dom-src');
var karma = require('gulp-karma');
var connect = require('gulp-connect');
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('underscore');
var prettyReporter = require('../jshint-pretty-reporter');

var htmlminOptions = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
};

var createFolderGlobs = function(fileTypePatterns) {
  fileTypePatterns = Array.isArray(fileTypePatterns) ? fileTypePatterns : [fileTypePatterns];
  var ignore = ['node_modules','bower_components','dist','temp'];
  var fs = require('fs');
  return _.flatten(fs.readdirSync(process.cwd())
          .map(function(file){
            if (ignore.indexOf(file) !== -1 ||
                file.indexOf('.') === 0 ||
                !fs.lstatSync(file).isDirectory()) {
              return null;
            } else {
              return fileTypePatterns.map(function(pattern) {
                return file + '/**/' + pattern;
              });
            }
          })
          .filter(function(patterns){
            return patterns;
          })
          .concat(fileTypePatterns));
};

var getSourceJsFiles = function(){
    var $ = cheerio.load(fs.readFileSync('index.html',{encoding:'utf8'}));
    return $('script[data-concat!="false"]').map(function(i,elem){
        return $(elem).attr('src');
    }).get();
};

var endsWith = function(source,suffix){
    return source.indexOf(suffix, source.length - suffix.length) !== -1;
};

gulp.task('clean', function() {
    rimraf.sync('dist');
});

gulp.task('css', ['clean'], function() {
    return gulp.src('app.<%= cssExt %>')
        .pipe(<% if (css === 'LESS') { %>less()<% } else { %>sass()<% } %>)
        .pipe(cssmin({keepSpecialComments: 0}))
        .pipe(rename('app.full.min.css'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('js', ['clean'], function() {

    var templateStream = gulp.src(['!node_modules/**','!bower_components/**','!dist/**','!index.html','!_SpecRunner.html','**/*.html',])
        .pipe(htmlmin(htmlminOptions))
        .pipe(ngHtml2js({
            moduleName: packagejson.name
        }));

    var jsStream = domSrc({file:'index.html',selector:'script[data-concat!="false"]',attribute:'src'});

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
            $('script[data-remove!="false"]').remove();
            $('link[data-remove!="false"]').remove();
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
    return gulp.src(createFolderGlobs('*.js'))
        .pipe(jshint())
        .pipe(jshint.reporter(prettyReporter))
        .pipe(jshint.reporter('fail'));
});

var runKarma = function(files,browsers){
    files = _.flatten(files);
    return gulp.src(files)
    .pipe(karma({
        frameworks: ['jasmine'],
        logLevel:'ERROR',
        reporters:['mocha'],
        browsers: browsers,
        action: 'run'
    }));
};

gulp.task('test', ['jshint'], function() {
    var files = getSourceJsFiles();
    files.push('bower_components/angular-mocks/angular-mocks.js');
    files = files.concat(createFolderGlobs('*-spec.js'));

    return runKarma(files,['PhantomJS','Chrome','Firefox']);
});

gulp.task('serve', function(){

    connect.server({
        livereload: true
    });

    gulp.watch(createFolderGlobs(['*.js','*.<%= cssExt %>',,'*.html']),
        function(event){

            var reloadDependencies = [];

            if (endsWith(event.path,'.js')) {

                //lint the changed js file
                gulp.task('watch_jshint',function(){
                    return gulp.src([event.path])
                        .pipe(jshint())
                        .pipe(jshint.reporter(prettyReporter))
                        .pipe(jshint.reporter('fail'));
                });

                reloadDependencies.push('watch_jshint');

                //find the appropriate unit test for the changed file
                var spec = event.path;
                if (!endsWith(event.path,'-spec.js')) {
                    spec = event.path.substring(0,event.path.length - 3) + '-spec.js';
                }

                //if the spec exists then lets run it
                if (fs.existsSync(spec)) {
                    var files = getSourceJsFiles();
                    files.push('bower_components/angular-mocks/angular-mocks.js');
                    files.push(spec);

                    gulp.task('watch_karma',['watch_jshint'],function(){
                        return runKarma(files,['PhantomJS']);
                    });

                    reloadDependencies.push('watch_karma');
                }
            }
<% if (css === 'Sass') { %>
            if (endsWith(event.path,'.scss')){
                gulp.task('watch_sass', function() {
                    return gulp.src('app.scss')
                        .pipe(sass())
                        .pipe(cssmin({keepSpecialComments: 0}))
                        .pipe(rename('app.css'))
                        .pipe(gulp.dest('./'));
                });
                reloadDependencies.push('watch_sass');
            }<% } %>

            gulp.task('watch_reload',reloadDependencies,function(){
                gulp.src(event.path)
                    .pipe(connect.reload());
            });

            gulp.run('watch_reload');
    });

});

gulp.task('build', ['clean', 'css', 'js', 'indexHtml', 'images', 'fonts']);