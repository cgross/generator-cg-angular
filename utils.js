var path = require('path');
var fs = require('fs');
var _ = require('underscore');

_.str = require('underscore.string');
_.mixin(_.str.exports());

exports.addToFile = function(filename,lineToAdd,beforeMarker,spacing){
	try {
		var fullPath = path.join(process.cwd(),filename);
		var fileSrc = fs.readFileSync(fullPath,'utf8');

		var indexOf = fileSrc.indexOf(beforeMarker);
		fileSrc = fileSrc.substring(0,indexOf) + lineToAdd + "\n" + spacing + fileSrc.substring(indexOf);

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
