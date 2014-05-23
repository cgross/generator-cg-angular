'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var cgUtils = require('../utils.js');

var CgangularGenerator = module.exports = function CgangularGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.config.set('partialDirectory','partial/');
        this.config.set('directiveDirectory','directive/');
        this.config.set('filterDirectory','filter/');
        this.config.set('serviceDirectory','service/');
        var inject = {
            js: {
                file: 'index.html',
                marker: cgUtils.JS_MARKER,
                template: '<script src="<%= filename %>"></script>'
            },
            less: {
                relativeToModule: true,
                file: '<%= module %>.less',
                marker: cgUtils.LESS_MARKER,
                template: '@import "<%= filename %>";'
            },
            scss: {
                relativeToModule: true,
                file: '<%= module %>.scss',
                marker: cgUtils.SASS_MARKER,
                template: '@import "<%= filename %>";'
            }
        };
        this.config.set('inject',inject);
        this.config.save();
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CgangularGenerator, yeoman.generators.Base);

CgangularGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    var prompts = [{
        name: 'appname',
        message: 'What would you like the angular app/module name to be?',
        default: path.basename(process.cwd())
    },{
        name: 'router',
        type:'list',
        message: 'Which router would you like to use?',
        default: 0,
        choices: ['Standard Angular Router','Angular UI Router']
    },{
        name: 'builder',
        type:'list',
        message: 'Which build tool would you like to use?',
        default: 0,
        choices: ['Grunt','Gulp']
    },{
        name: 'css',
        type:'list',
        message: 'Which CSS preprocessor would you like to use',
        default: 0,
        choices: ['LESS','Sass']
    }];

    this.prompt(prompts, function (props) {

        this.appname = props.appname;

        if (props.router === 'Angular UI Router') {
            this.uirouter = true;
            this.routerJs = 'bower_components/angular-ui-router/release/angular-ui-router.js';
            this.routerModuleName = 'ui.router';
            this.routerViewDirective = 'ui-view';
        } else {
            this.uirouter = false;
            this.routerJs = 'bower_components/angular-route/angular-route.js';
            this.routerModuleName = 'ngRoute';
            this.routerViewDirective = 'ng-view';
        }
        this.config.set('uirouter',this.uirouter);

        this.builder = props.builder;

        this.css = props.css;
        if (this.css === 'LESS'){
            this.cssExt = 'less';
        } else {
            this.cssExt = 'scss';
        }
        this.config.set('css',this.css);

        cb();
    }.bind(this));
};



CgangularGenerator.prototype.app = function app() {
    this.directory('skeleton/','./');
    if (this.builder === 'Grunt') {
        this.copy('Gruntfile.js','Gruntfile.js');
    } else {
        this.copy('gulpfile.js','gulpfile.js');
    }
    if (this.css === 'LESS'){
        this.copy('app.less','app.less');
    } else {
        this.copy('app.scss','app.scss');
    }
};
