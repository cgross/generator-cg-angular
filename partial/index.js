'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var cgUtils = require('../utils.js');
var _ = require('underscore');
var chalk = require('chalk');
var fs = require('fs');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var PartialGenerator = module.exports = function PartialGenerator(args, options, config) {

    yeoman.generators.NamedBase.apply(this, arguments);

};

util.inherits(PartialGenerator, yeoman.generators.NamedBase);

PartialGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    var prompts = [
        {
            name: 'route',
            message: 'Enter your route url (i.e. /mypartial/:id).  If you don\'t want a route added for you, leave this empty.'
        }
    ];

    this.prompt(prompts, function (props) {
        this.route = props.route;
        cgUtils.askForModuleAndDir('partial',this,true,cb);
    }.bind(this));
};

PartialGenerator.prototype.files = function files() {

    this.ctrlname = _.camelize(_.classify(this.name)) + 'Ctrl';

    cgUtils.processTemplates(this.name,this.dir,'partial',this,null,null,this.module);

    if (this.route && this.route.length > 0){
        var partialUrl = this.dir + this.name + '.html';
        cgUtils.injectRoute(this.module.file,this.config.get('uirouter'),this.name,this.route,partialUrl,this);
    }

};
