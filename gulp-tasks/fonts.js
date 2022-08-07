const { src, dest } = require('gulp'),
	path = require('./paths'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter'),
	fs = require('fs'),				//filesystem
	mergeStream = require('merge-stream'),
	save = require('gulp-save');

let srcDir = path.src.fonts,
	destDir = path.dest.fonts,
	scssFontfaces = path.src.scssFontfaces,
	scssFontVars = path.src.scssFontVars;

function otf2ttf(srcDir) {
	return src([srcDir + '/**/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(file => file.base + '/'));
}

module.exports.convert2woff = function (cb) {
	mergeStream(otf2ttf(srcDir), src([srcDir + '/**/*.ttf']))
		.pipe(save('ttfFonts'))
		.pipe(ttf2woff())
		.pipe(dest(file => file.base + '/'))
		.pipe(save.restore('ttfFonts'))
		.pipe(ttf2woff2())
		.pipe(dest(file => file.base + '/'));
	cb();
}

module.exports.includeInScss = function (cb) {
	var getFiles = (function _getFiles(srcDir, files_) {
		files_ = files_ || [];
		var files = fs.readdirSync(srcDir);
		for (var i in files) {
			var name = srcDir + files[i];
			if (fs.statSync(name).isDirectory()) {
				_getFiles(name + '/', files_);
			} else {
				let fontname = files[i].split('.');
				if (fontname[fontname.length - 1] == 'ttf')
					files_.push(fontname[0]);
			}
		}
		return files_;
	})(srcDir);

	try {
		const fileFontFaces = fs.openSync(scssFontfaces, 'w');
		const fileFontVars = fs.openSync(scssFontVars, 'w');
		let lastFontName;

		for (let i = 0; i < getFiles.length; i++) {
			let fontWeight = 400,
				fontStyle = 'normal',
				fontName = getFiles[i];

			fontName = fontName.toLowerCase();

			if (fontName.includes('italic')) {
				fontName = fontName.replace('italic', '');
				fontStyle = 'italic';
			}

			fontName = fontName.split('-');

			switch (fontName[fontName.length - 1]) {
				case 'black':
				case 'heavy':
					fontWeight = 900;
					break;
				case 'extrabold':
				case 'ultrabold':
					fontWeight = 800;
					break;
				case 'bold':
					fontWeight = 700;
					break;
				case 'semibold':
				case 'demibold':
					fontWeight = 600;
					break;
				case 'medium':
					fontWeight = 500;
					break;
				case 'light':
					fontWeight = 300;
					break;
				case 'extralight':
				case 'ultralight':
					fontWeight = 200;
					break;
				case 'thin':
				case 'hairline':
					fontWeight = 100;
					break;
				case 'regular':
				case 'normal':
				case 'book':
				default:
					fontWeight = 400;
					break;
			}
			fs.appendFileSync(fileFontFaces,
				`@include font("${fontName[0]}", "${getFiles[i]}", "${fontWeight}", "${fontStyle}");\r\n`
			);
			if (fontName[0] != lastFontName) {
				fs.appendFileSync(fileFontVars,
					`$${fontName[0]}: ${fontName[0]}, sans-serif;\r\n`
				);
			}
			lastFontName = fontName[0];
		}

		fs.closeSync(fileFontFaces);
		fs.closeSync(fileFontVars);
	} catch (err) {
		console.error('error opening file: ' + err)
	}

	cb();
}

module.exports.moveFonts = function () {
	return src(srcDir + '/**/*.{ttf,otf,woff,woff2}')
		.pipe(dest(destDir));
}