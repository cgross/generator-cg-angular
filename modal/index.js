'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var cgUtils = require('../utils.js');
var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
var chalk = require('chalk');
var path = require('path');

var ModalGenerator = module.exports = function ModalGenerator(args, options, config) {

    yeoman.generators.NamedBase.apply(this, arguments);

};

util.inherits(ModalGenerator, yeoman.generators.NamedBase);

ModalGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    cgUtils.askForModuleAndDir('modal',this,true,cb);
};

ModalGenerator.prototype.files = function files() {

    this.ctrlname = _.camelize(_.classify(this.name)) + 'Ctrl';

    cgUtils.processTemplates(this.name,this.dir,'modal',this,null,null,this.module);

    setTimeout((function(){

	    console.log('');
	    console.log('  Open this modal by using ' + chalk.bold('angular-ui-bootstrap') + ' module\'s ' + chalk.bold('$modal') + ' service:');
	    console.log('');
	    console.log('  $modal.open({');
	    console.log('      templateUrl: \'' + path.join(this.dir,this.name + '.html') + '\',');
	    console.log('      controller: \''+ this.ctrlname +'\'');
	    console.log('  }).result.then(function(result){');
	    console.log('      //do something with the result');
	    console.log('  });');
	    console.log('');

    }).bind(this),200);

};