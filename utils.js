var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var chalk = require('chalk');

_.str = require('underscore.string');
_.mixin(_.str.exports());

exports.addToFile = function(filename,lineToAdd,beforeMarker,spacing){
	try {
		var fullPath = path.join(process.cwd(),filename);
		var fileSrc = fs.readFileSync(fullPath,'utf8');

		var indexOf = fileSrc.indexOf(beforeMarker);
        var lineStart = fileSrc.substring(0,indexOf).lastIndexOf('\n') + 1;
        var indent = fileSrc.substring(lineStart,indexOf);
		fileSrc = fileSrc.substring(0,indexOf) + lineToAdd + "\n" + indent + fileSrc.substring(indexOf);

		fs.writeFileSync(fullPath,fileSrc);

	} catch(e) {
		throw e;
	}
};

exports.JS_MARKER = "<!-- Add New Component JS Above -->";
exports.LESS_MARKER = "/* Add Component LESS Above */";

exports.ROUTE_MARKER = "/* Add New Routes Above */";
exports.STATE_MARKER = "/* Add New States Above */";


exports.cleanDirectory = function(directoryName) {

	if (_(directoryName).startsWith('/') || _(directoryName).startsWith('\\')) {
		directoryName = directoryName.substring(1);
	}

	if (_(directoryName).endsWith('/') || _(directoryName).endsWith('\\')) {
		directoryName = directoryName.substring(0,directoryName.length - 1);
	}

	return directoryName + '/';
};

exports.processTemplates = function(name,dir,type,that,defaultDir,configName){

    if (!defaultDir) {
        defaultDir = 'templates'
    }
    if (!configName) {
        configName = type + 'Templates';
    }

    var templateDirectory = path.join(path.dirname(that.resolved),defaultDir);
    if(that.config.get(configName)){
        templateDirectory = path.join(process.cwd(),that.config.get(configName));
    }
    _.chain(fs.readdirSync(templateDirectory))
        .filter(function(template){
            return template[0] !== '.';
        })
        .each(function(template){
            var customTemplateName = template.replace(type,name);
            var templateFile = path.join(templateDirectory,template);
            //create the file
            that.template(templateFile,dir + customTemplateName);
            //inject the file reference into index.html/app.less/etc as appropriate
            exports.inject(dir + customTemplateName,that);
        });
};

exports.inject = function(filename,that) {
    //special case to skip unit tests
    if (_(filename).endsWith('-spec.js')) {
        return;
    }

    var ext = path.extname(filename);
    if (ext[0] === '.') {
        ext = ext.substring(1);
    }
    var config = that.config.get('inject')[ext];
    if (config) {
        var lineTemplate = _.template(config.template)({filename:filename});
        exports.addToFile(config.file,lineTemplate,config.marker);
        that.log.writeln(chalk.green(' updating') + ' %s',config.file);
    }
};
