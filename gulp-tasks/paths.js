const srcDir = "./app/src";

const path = process.cwd();
const folderName = path.slice(path.lastIndexOf('\\') + 1);
const env = process.env.NODE_ENV;
const destDir = './app/' +  (env && env.trim() == 'production' ? folderName : "dist");

module.exports = {
	dest: {
		base: destDir + "/",
		html: destDir + "/",
		css: destDir + "/assets/css/",
		js: destDir + "/assets/js/",
		img: destDir + "/assets/img/",
		fonts: destDir + "/assets/fonts/"
	},
	src: {
		base: srcDir + "/",
		html: srcDir + "/pug/pages/*.pug",
		scss: srcDir + "/scss/main.scss",
		js: srcDir + "/js/*.js",
		img: srcDir + "/img/",
		spriteSvg: srcDir + "/img/sprite/**/*.svg",
		spritePng: srcDir + "/img/sprite/**/*.png",
		fonts: srcDir + "/fonts/",
		scssFontfaces: srcDir + "/scss/3_-_base/_fontfaces.scss",
		scssFontVars: srcDir + "/scss/1_-_abstracts/_fonts.scss",
		scssPngSprite: srcDir + "/scss/1_-_abstracts/",
		favicon: srcDir + "/favicon/",
	},
	watch: {
		html: srcDir + "/pug/**/*.pug",
		css: srcDir + "/css/**/*.css",
		scss: srcDir + "/scss/**/*.scss",
		js: srcDir + "/js/**/*.js",
		img: srcDir + "/img/",
		spriteSvg: srcDir + "/img/sprite/**/*.svg",
		spritePng: srcDir + "/img/sprite/**/*.png"
	}
}