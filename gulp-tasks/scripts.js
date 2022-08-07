const { src, dest }         = require('gulp'),
	path                     = require('./paths'),
	plumber                  = require('gulp-plumber'),
	notify                   = require('gulp-notify'),
	webpack                  = require('webpack-stream'),
	CircularDependencyPlugin = require('circular-dependency-plugin'),
	{ DuplicatesPlugin }     = require("inspectpack/plugin");
	//eslint                   = require('gulp-eslint'),
	//fileInclude              = require('gulp-file-include'),
	//rename                   = require('gulp-rename'),
	//babel                    = require('gulp-babel'),
	//uglify                   = require('gulp-uglify-es').default,

let srcDir = path.src.js,
	destDir = path.dest.js;

module.exports = function scripts() {
	src([srcDir, '!/**/main.js'])
		.pipe(dest(destDir));

	return src(srcDir)
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Error in JS plugin: ' + err.plugin,
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe(webpack({
			mode: process.env.NODE_ENV, 
			entry: {
				main: './app/src/js/main.js'
			},
			output: {
				filename: '[name].js',
			},
			module: {
				rules: []
			},
			plugins: [
				new CircularDependencyPlugin(),
				new DuplicatesPlugin(),
			],
			resolve: {
				extensions: ['.js', '.jsx']
			},
			optimization: {
			    //minimize: true
				minimize: false
			},
			devtool: (process.env.NODE_ENV = 'production') ? 'none' : 'eval-sourse-map'
		}))
		.pipe(dest(destDir));
}