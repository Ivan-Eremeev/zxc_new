const { src, dest } = require('gulp'),
	path = require('./paths'),
	rename = require('gulp-rename'),
	spritesmith = require('gulp.spritesmith'),
	merge = require('merge-stream');

let srcDir = path.src.spritePng,
	destDir = path.dest.img + 'sprite/';


module.exports = function pngIcons2Sprite() {
	// Generate our spritesheet
	let spriteData = src(srcDir)
		.pipe(spritesmith({
			imgName: 'sprite.png',
			imgPath: '../img/sprite/sprite.png',
			cssName: '_sprite.scss',
			padding: 5
		}));

	// Pipe image stream onto disk
	let imgStream = spriteData.img
		.pipe(dest(destDir));

	// Pipe CSS stream onto disk
	let cssStream = spriteData.css
		.pipe(dest(path.src.scssPngSprite));

	// Return a merged stream to handle both `end` events
	return merge(imgStream, cssStream);
}