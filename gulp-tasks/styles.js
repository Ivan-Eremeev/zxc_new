const { src, dest } = require('gulp'),
	path = require('./paths'),
	gulpif = require('gulp-if'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	sass = require('gulp-sass')(require('node-sass')),
	cleanCSS = require('gulp-clean-css'),
	sourcemaps = require('gulp-sourcemaps'),
	groupMedia = require('gulp-group-css-media-queries'),
	shorthand = require('gulp-shorthand'),
	autoprefixer = require('gulp-autoprefixer'),
	//webpCss          = require('gulp-webpcss'),
	gulpStylelint = require('gulp-stylelint'),
	rename = require("gulp-rename"),
	purgecss = require('gulp-purgecss');

//sass.compiler = require('node-sass');

let srcDir = path.src.scss,
	destDir = path.dest.css;

module.exports = function styles() {
	return src(srcDir)
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'Error in SCSS plugin: ' + err.plugin,
					sound: false,
					message: err.message
				}
			})
		}))
		/*.pipe(gulpStylelint({
			failAfterError: false,
			reporters: [{
				formatter: 'string',
				console: true
			}]
		}))*/
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: "expanded",
			includePaths: ['node_modules']
		}))
		.pipe(groupMedia())
		.pipe(autoprefixer({
			overrideBrowserslist: ["last 10 versions"],
			cascade: true,//false?
			//grid: true?
		}))
		//.pipe(webpCss())
		//.pipe(shorthand())
		.pipe(rename("style.css"))
		// clean unused css
		// .pipe(purgecss({
		// 	content: [path.dest.html + '**/*.html', path.dest.js + '**/*.js']
		// }))
		.pipe(dest(destDir))
		.pipe(cleanCSS({
			level: { 1: { specialComments: 0 } },
			debug: true,
			compatibility: '*'
		}, details => {
			console.log(`${details.name}: 
					Original size:${details.stats.originalSize} - Minified size: 
					${details.stats.minifiedSize}`)
		}))
		.pipe(gulpif(process.env.NODE_ENV == 'development', sourcemaps.write()))
		.pipe(rename({ suffix: '.min' }))
		.pipe(dest(destDir))
}