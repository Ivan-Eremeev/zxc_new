const del = require('del'),
	path   = require('./paths'),
	cache  = require('gulp-cache');

module.exports.dist = function clearDist() {
	return del(path.dest.base);
}

module.exports.cacheAll = function clearCache(cb) {
	cache.clearAll();
	return cb();
}