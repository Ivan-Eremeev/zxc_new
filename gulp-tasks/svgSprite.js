const { src, dest } = require('gulp'),
	path = require('./paths'),
	rename = require('gulp-rename'),
	svgstore = require('gulp-svgstore'),
	svgSprite = require('gulp-svg-sprite');

let srcDir = path.src.spriteSvg,
	destDir = path.dest.img;

module.exports = function svgIcons2Sprite() {
	return src(srcDir)
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(rename('sprite.svg'))
		.pipe(dest(destDir))

	/*return src(srcDir)
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg",
					//example: true
				}
			},
		}))
		.pipe(dest(destDir))*/
}