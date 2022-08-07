const { src, dest } = require('gulp'),
	path = require('./paths'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	// nunjucksRender = require('gulp-nunjucks-render'),
	pug = require('gulp-pug'),
	prettyHtml = require('gulp-pretty-html');

let srcDir = path.src.html,
	destDir = path.dest.html;

module.exports = function html() {
	return src(srcDir)
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'Error in HTML ' + err.plugin,
					sound: false,
					message: err.message
				}
			})
		}))
		// .pipe(nunjucksRender({
		// 	path: ['app/src/html/layouts/', 'app/src/html/includes/', 'app/src/html/mixins/'],
		// 	ext: '.html',
		// }))
		.pipe(pug({ 
			pretty: true
		}))
		.pipe(prettyHtml())
		.pipe(dest(destDir))
};