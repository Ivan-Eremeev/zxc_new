const { src, dest } = require('gulp'),
	path = require('./paths'),
	gulpif = require('gulp-if'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	imagemin = require('gulp-imagemin'),
	//imgCompress      = require('imagemin-jpeg-recompress'),
	webp = require('imagemin-webp'),//cwebp
	changed = require('gulp-changed'),
	cache = require('gulp-cache'),
	rename = require('gulp-rename'),
	imageminPngquant = require('imagemin-pngquant')
	mergeStream = require('merge-stream'),
	save = require('gulp-save');

let srcDir = path.src.img,
	destDir = path.dest.img;

module.exports.convert2webp = function (cb) {
	src([srcDir + '**/*.png', '!' + srcDir + '/sprite/**'])
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'Error in WEBP plugin: ' + err.plugin,
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe(gulpif(process.env.NODE_ENV == 'development', changed(destDir), cache.clear()))
		.pipe(cache(imagemin([
			webp({
				quality: 85,
				method: 6
			})
		]), {
			name: 'png-to-webp'
		}))
		.pipe(rename({ extname: '.webp' }))
		.pipe(dest(destDir));

	src([srcDir + '**/*.{jpg,gif,ico,webp}', '!' + srcDir + '/sprite/**'])
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'Error in WEBP plugin: ' + err.plugin,
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe(gulpif(process.env.NODE_ENV == 'development', changed(destDir), cache.clear()))
		.pipe(cache(imagemin([
			webp({
				quality: 70,
				method: 6
			})
		]), {
			name: 'all-except-png-to-webp'
		}))
		.pipe(rename({ extname: '.webp' }))
		.pipe(dest(destDir));
	cb();
}

module.exports.imageMinify = function (cb) {
	src([srcDir + '**/*.{jpg,png,svg,gif,ico}', '!' + srcDir + '/sprite/**'])
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'Error in IMAGE plugin: ' + err.plugin,
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe(gulpif(process.env.NODE_ENV == 'development', changed(destDir), cache.clear()))
		.pipe(cache(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({
				quality: 70
			}),
			imageminPngquant({
				quality: [0.65, 0.8],
				speed: 1
			}),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]), {
			name: 'min-images'
		}))
		.pipe(dest(destDir));


	cb();
}
