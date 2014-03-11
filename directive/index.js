'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var cgUtils = require('../utils.js');
var chalk = require('chalk');
var _ = require('underscore');
var fs = require('fs');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var DirectiveGenerator = module.exports = function DirectiveGenerator(args, options, config) {

    yeoman.generators.NamedBase.apply(this, arguments);

    try {
        this.appname = require(path.join(process.cwd(), 'package.json')).name;
    } catch (e) {
        this.appname = 'Cant find name from package.json';
    }

};

util.inherits(DirectiveGenerator, yeoman.generators.NamedBase);

DirectiveGenerator.prototype.askFor = function askFor() {
    var cb = this.async();
    var name = this.name;
    var defaultDir = this.config.get('directiveDirectory');
    if (!_(defaultDir).endsWith('/')) {
        defaultDir += '/';
    }

    var prompts = [{
        type:'confirm',
        name: 'needpartial',
        message: 'Does this directive need an external html file (i.e. partial)?',
        default: true
    },{
        name:'dir',
        message:'Where would you like to create the directive files?',
        default: function(props){
            if (props.needpartial){
                return defaultDir + name + '/';
            } else {
                return defaultDir;
            }
        }
    }];

    this.prompt(prompts, function (props) {
        this.needpartial = props.needpartial;
        this.dir = cgUtils.cleanDirectory(props.dir);

        cb();
    }.bind(this));

};

DirectiveGenerator.prototype.files = function files() {

    var configName = 'directiveSimpleTemplates';
    var defaultDir = 'templates/simple';
    if (this.needpartial) {
        configName = 'directiveComplexTemplates';
        defaultDir = 'templates/complex';
    }

    this.htmlPath = this.dir + this.name + '.html';

    cgUtils.processTemplates(this.name,this.dir,'directive',this,defaultDir,configName);

};