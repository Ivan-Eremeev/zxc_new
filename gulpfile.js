const tasksFolder = "./gulp-tasks";

const { src, dest, watch, parallel, series } = require('gulp'),
	html = require(tasksFolder + '/html'),
	styles = require(tasksFolder + '/styles'),
	scripts = require(tasksFolder + '/scripts'),
	fonts = require(tasksFolder + '/fonts'),
	images = require(tasksFolder + '/images'),
	svgSprite = require(tasksFolder + '/svgSprite'),
	clear = require(tasksFolder + '/clear'),
	serve = require(tasksFolder + '/serve'),
	favicon = require(tasksFolder + '/favicon'),
	pngSprite = require(tasksFolder + '/pngSprite');

// function setMode(isProduction = false) {
// 	return cb => {
// 		process.env.NODE_ENV = isProduction ? 'production' : 'development';
// 		cb();
// 	}
// }

const dev = series(
	//images.convert2webp,
	images.imageMinify,
	parallel(
		html,
		scripts,
		styles,
		fonts.moveFonts,
		svgSprite,
		pngSprite,
		favicon.moveFavicon
	)
);

const notImg = parallel(
	html,
	scripts,
	styles,
	fonts.moveFonts,
	svgSprite,
	pngSprite,
	favicon.moveFavicon
);

function start(cb) {
	let env = process.env.NODE_ENV;
	env = env ? env.trim() : 'development';
	process.env.NODE_ENV = env;
	
	if (env == 'production') {
		return series(parallel(clear.dist, clear.cacheAll), dev);
	} else {
		return series(clear.dist, dev, serve);
	}
}

function startNotImg(cb) {
	return series(parallel(clear.dist, clear.cacheAll), notImg);
}

module.exports.clearDist = series(clear.dist);
module.exports.clearCache = series(clear.cacheAll);
module.exports.html = series(html);
module.exports.styles = series(styles);
module.exports.scripts = series(scripts);
module.exports.images = series(clear.cacheAll, parallel(images.convert2webp, images.imageMinify));
module.exports.fonts = series(fonts.convert2woff, fonts.includeInScss);
module.exports.fontsMove = series(fonts.moveFonts);
module.exports.svgSprite = series(svgSprite);
module.exports.pngSprite = series(pngSprite);
module.exports.favicon = series(favicon.moveFavicon);

// module.exports.start = series(clear.dist, dev, serve);
// module.exports.build = series(parallel(clear.dist, clear.cacheAll), dev);
module.exports.notImg = startNotImg();
module.exports.default = start();