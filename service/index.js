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

var ServiceGenerator = module.exports = function ServiceGenerator(args, options, config) {

	yeoman.generators.NamedBase.apply(this, arguments);

	try {
		this.appname = require(path.join(process.cwd(), 'package.json')).name;
	} catch (e) {
		this.appname = 'Cant find name from package.json';
	}

};

util.inherits(ServiceGenerator, yeoman.generators.NamedBase);

ServiceGenerator.prototype.askFor = function askFor() {
    var cb = this.async();
    var name = this.name;
    var defaultDir = this.config.get('serviceDirectory');
    if (!_(defaultDir).endsWith('/')) {
        defaultDir += '/';
    }

    var prompts = [
        {
            name:'dir',
            message:'Where would you like to create the service files?',
            default: defaultDir
        }
    ];

    this.prompt(prompts, function (props) {
        this.dir = cgUtils.cleanDirectory(props.dir);

        cb();
    }.bind(this));
};

ServiceGenerator.prototype.files = function files() {

    cgUtils.processTemplates(this.name,this.dir,'service',this);

};
