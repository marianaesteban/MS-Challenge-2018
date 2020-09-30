var gulp = require('gulp');
var deploy = require('gulp-gh-pages');

// Browser sync
var browserSync = require('browser-sync').create();

// Sass and globbing to include files automatically
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

// Optimize
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');

// Cleaning and building
var del = require('del');

// Get config file
var config = require('./config.json');


gulp.task('sass', function(){
	var plugins = [
    autoprefixer({browsers: ['last 2 version']}),
  ];
	return gulp
  .src(config.folderSrc.css + '/styles.scss')
  .pipe(sassGlob())
  .pipe(sass().on('error', sass.logError))
	.pipe(postcss(plugins))
	.pipe(gulp.dest(config.folderSrc.root))
  .pipe(browserSync.stream());
});

// Watch the Sass directory for changes.
gulp.task('watch', function () {
  gulp.watch(config.folderSrc.css + '/**/*.scss', gulp.series('sass'));
});

// Static Server + watching scss/html files
gulp.task('serve', function() {

    browserSync.init({
        server: {
		      baseDir: config.folderSrc.root
		    },
    });

    gulp.watch(config.folderSrc.css + '/**/*.scss', gulp.series('sass'));
    gulp.watch(config.folderSrc.js + '/**/*.js').on('change', browserSync.reload);
		gulp.watch(config.folderSrc.root +'/*.html').on('change', browserSync.reload);
});

// minify js and css
gulp.task('useref', function(){
  return gulp.src(config.folderSrc.root +'/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf(config.folderSrc.js+'/**/*.js', uglify()))
    .pipe(gulp.dest(config.folderDist.root))
		// Minifies only if it's a CSS file
    .pipe(gulpIf(config.folderSrc.css+'/**/.css', cssnano()))
    .pipe(gulp.dest(config.folderDist.root))
});

// optimize images
gulp.task('images', function(){
  return gulp.src(config.folderSrc.img +'/**/*.+(png|jpg|gif|svg)')
  	.pipe(imagemin())
  	.pipe(gulp.dest(config.folderDist.img))
});

gulp.task('clean:dist', function() {
  return del([config.folderDist.root+'/**']).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
	});
});

gulp.task('build', function (done){
	console.log('Building files...');
	return gulp.series('clean:dist','sass', 'useref', 'images')(done);
});

gulp.task('default', gulp.series('serve'));

/**
 * Push build to gh-pages
 */
gulp.task('deploy', function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});