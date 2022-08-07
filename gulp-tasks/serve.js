const { src, watch, series, parallel } = require('gulp'),
	path   = require('./paths'),
	server = require('browser-sync').create();

const html = require('./html'),
	styles = require('./styles'),
	scripts = require('./scripts'),
	images = require('./images'),
	svgSprite = require('./svgSprite');

function readyReload(cb) {
	server.reload();
	cb();
}

module.exports = function serve(cb) {
	server.init({
		server: { 
			baseDir: path.dest.base
		},
		port: 3000,
		notify: false,
		online: true,
		open: false,
		cors: true
	});

	watch([path.watch.img + '**/*.{jpg,png,svg,gif,ico,webp}', '!' + path.watch.img + '/sprite/**'], series(parallel(images.convert2webp, images.imageMinify), readyReload));
	watch(path.watch.spriteSvg, series(svgSprite, readyReload));
	watch(path.watch.scss, series(styles, cb => src(path.dest.css).pipe(server.stream()).on('end', cb)));
	watch(path.watch.js, series(scripts, readyReload));
	watch(path.watch.html, series(html, readyReload));

	return cb();
}