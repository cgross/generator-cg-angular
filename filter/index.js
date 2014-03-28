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

var FilterGenerator = module.exports = function FilterGenerator(args, options, config) {

	yeoman.generators.NamedBase.apply(this, arguments);

};

util.inherits(FilterGenerator, yeoman.generators.NamedBase);

FilterGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    cgUtils.askForModuleAndDir('filter',this,false,cb);
};

FilterGenerator.prototype.files = function files() {

    cgUtils.processTemplates(this.name,this.dir,'filter',this,null,null,this.module);

};
