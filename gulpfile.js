var gulp = require('gulp');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var svgmin      = require('gulp-svgmin');
var svgstore    = require('gulp-svgstore');
var cheerio     = require('gulp-cheerio');
var browserSync = require('browser-sync').create();
var exec = require('child_process').exec;

var $ = require('gulp-load-plugins')();

var paths = {
  sass: './src/assets/scss/**/*.scss',
  js: './src/assets/js/*.js',
  vendor: './vendor/',
  img: './src/assets/images/**',
  files: './src/files/**',
  templates: ['src/**/*.html', '!src/inc/**/*.html'],
  icons: './src/assets/icons/*',
  build: './build/'
};

gulp.task('icons', function () {
  return gulp.src(paths.icons)
    .pipe(svgmin())
    .pipe(svgstore({ fileName: 'icons.svg', inlineSvg: true}))
    .pipe(cheerio({
      run: function ($, file) {
        $('svg').addClass('hide');
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest('./_includes/'));
});

gulp.task('imagemin', function() {
  return gulp.src('images/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('images'));
});

gulp.task('compress', function() {
  return gulp.src('_site/assets/js/engblog.js')
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('assets/js'));
});

gulp.task('scss-lint', function () {
  gulp.src('assets/css/**/*.scss')
    .pipe($.scssLint({
      'config': 'scss-lint.yml'
    }));
});

gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: "127.0.0.1:4000"
  });
});

gulp.task('reference', function (cb) {
  exec('cd ./node_modules/backstopjs/; npm run reference', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('test', function (cb) {
  exec('cd ./node_modules/backstopjs/; npm run test', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('default', function() {
  // place code here
});
