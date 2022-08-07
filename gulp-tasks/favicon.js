const { src, dest } = require('gulp'),
	path = require('./paths');

let srcDir = path.src.favicon,
	destDir = path.dest.base;

module.exports.moveFavicon = function () {
	return src(srcDir + '/**/*.*')
		.pipe(dest(destDir));
}