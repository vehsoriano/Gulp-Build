var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    plumber = require ('gulp-plumber'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');
    uglifycss = require('gulp-uglifycss');
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    gulpCopy = require('gulp-copy'),
    sourcemaps = require('gulp-sourcemaps'),
	  reload = browserSync.reload;

var paths = {
  index         : 'index.html',
  bootstrapJs   : 'node_modules/bootstrap/dist/js/bootstrap.min.js',
  bootstrapScss : 'node_modules/bootstrap/scss/*.scss',
  jquery        : 'node_modules/jquery/dist/jquery.slim.min.js',
  tether        : 'node_modules/tether/dist/js/tether.min.js',
  fontAwesome   : 'node_modules/font-awesome/css/font-awesome.min.css',
  jsDest        : 'dist/assets/js',
  css           : 'dist/assets/css/app.css',
  cssDest       : 'dist/assets/css',
  scss          : 'src/scss/app.scss',
  scssGlob      : 'src/scss/**/*.scss',
  javascripts   : 'src/js/*.js'
}

// #1 Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// #2 HTML tasks
gulp.task('html' , function(){
	gulp.src(paths.index)
  .pipe(plumber())
  .pipe(reload({stream:true}));
});

// #3 vendor Scss file-node
gulp.task('vendor', function() {
  return gulp.src(paths.bootstrapScss)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('vendor.css'))
    .pipe(uglifycss({
      "maxLineLen": 100,
      "uglyComments": true
    }))
    .pipe(rename('vendor.min.css'))
    .pipe(gulp.dest(paths.cssDest));
});

// #4 assets Scss to css
gulp.task('sass', function () {
  return gulp.src(paths.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.cssDest))
    .pipe(reload({stream:true}));
});

// #5 css to min.css
gulp.task('minify', function(){
  return gulp.src(paths.css)
  .pipe(plumber())
  .pipe(uglifycss({
    "maxLineLen": 100,
    "uglyComments": true
  }))
  .pipe(rename('app.min.css'))
  .pipe(gulp.dest(paths.cssDest))
  .pipe(reload({stream:true}));
});

// #6 javascripts
gulp.task('javascripts', function() {
  return gulp.src(paths.javascripts)
  .pipe(plumber())
  .pipe(concat('javascript.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.jsDest))
  .pipe(reload({stream:true}));
});

// #8 JavaScript file-node
gulp.task('vendorJs', function() {
  return gulp.src(paths.bootstrapJs)
  .pipe(concat('vendor.min.js'))
  .pipe(gulp.dest(paths.jsDest));
});

//jQuery library
gulp.task('jquery', function(){
  return gulp.src(paths.jquery)
  .pipe(gulp.dest(paths.jsDest));
});

//tether
gulp.task('tether', function(){
  return gulp.src(paths.tether)
  .pipe(gulp.dest(paths.jsDest));
});

//font awesome
gulp.task('font:Awesome', function(){
  return gulp.src(paths.fontAwesome)
  .pipe(gulp.dest(paths.cssDest));
});

// gulp watch
gulp.task('watch', function () {
  gulp.watch(paths.index, ['html']);
  gulp.watch(paths.scssGlob, ['sass']);
  gulp.watch(paths.css, ['sass', 'minify']);
  gulp.watch(paths.javascripts, ['javascripts']);
});

// Image min with pngquant
gulp.task('images', function () {
    return gulp.src('src/images/*')
      .pipe(imagemin({
          progressive: true,
          use: [pngquant()]
      }))
      .pipe(gulp.dest('dist/assets/images'));
});


// gulp default
gulp.task('default', ['browser-sync', 'watch', 'images', 'sass', 'vendor', 'minify', 'vendorJs', 'javascripts', 'jquery', 'tether', 'font:Awesome']);
