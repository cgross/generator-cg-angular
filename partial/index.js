'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var cgUtils = require('../utils.js');
var _ = require('underscore');
var chalk = require('chalk');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var PartialGenerator = module.exports = function PartialGenerator(args, options, config) {

    yeoman.generators.NamedBase.apply(this, arguments);

    try {
        this.appname = require(path.join(process.cwd(), 'package.json')).name;
    } catch (e) {
        this.appname = 'Cant find name from package.json';
    }

};

util.inherits(PartialGenerator, yeoman.generators.NamedBase);

PartialGenerator.prototype.askFor = function askFor() {
    var cb = this.async();
    var name = this.name;
    var defaultDir = this.config.get('partialDirectory');
    if (!_(defaultDir).endsWith('/')) {
        defaultDir += '/';
    }

    var prompts = [
        {
            name: 'route',
            message: 'Enter your route url (i.e. /mypartial/:id).  If you don\'t want a route added for you, leave this empty.'
        },
        {
            name:'dir',
            message:'Where would you like to create the partial files?',
            default: defaultDir + name + '/'
        }
    ];

    this.prompt(prompts, function (props) {
        this.route = props.route;
        this.dir = cgUtils.cleanDirectory(props.dir);

        cb();
    }.bind(this));
};

PartialGenerator.prototype.files = function files() {

    this.ctrlname = _.camelize(_.classify(this.name)) + 'Ctrl';

    this.template('partial.js', this.dir+this.name+'.js');
    this.template('partial.html', this.dir+this.name+'.html');
    this.template('partial.less', this.dir+this.name+'.less');
    this.template('spec.js', this.dir+this.name+'-spec.js');

    cgUtils.addToFile('index.html','<script src="'+this.dir+this.name+'.js"></script>',cgUtils.JS_MARKER,'  ');
    this.log.writeln(chalk.green(' updating') + ' %s','index.html');

    cgUtils.addToFile('app.less','@import "'+this.dir+this.name+'.less";',cgUtils.LESS_MARKER,'');
    this.log.writeln(chalk.green(' updating') + ' %s','app.less');

    if (this.route && this.route.length > 0){

        var partialUrl = this.dir+this.name+'.html';

        if (this.config.get('uirouter')) {
            var code = '$stateProvider.state(\''+this.name+'\', {\n        url: \''+this.route+'\',\n        templateUrl: \''+partialUrl+'\'\n    });';
            cgUtils.addToFile('app.js',code,cgUtils.STATE_MARKER,'    ');
        } else {
            cgUtils.addToFile('app.js','when(\''+this.route+'\',{templateUrl: \''+partialUrl+'\'}).',cgUtils.ROUTE_MARKER,'    ');
        }
        this.log.writeln(chalk.green(' updating') + ' %s','app.js');
    }

};
