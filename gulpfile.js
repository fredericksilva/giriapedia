// include gulp
var gulp = require('gulp');
 
// include plug-ins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var clean = require('gulp-clean');

gulp.task('clean_bundled', function() {
  return gulp.src('./giriapedia/static/js/bundled.min.js').pipe(clean());
})

// JS concat, strip debugging code and minify
gulp.task('bundle-scripts', ['clean_bundled'], function() {

  var jsPath = {
    jsSrc: [
      './giriapedia/static/js/**/*.js'
    ],
    jsDest:'./giriapedia/static/js/'
  };
  gulp.src(jsPath.jsSrc)
    .pipe(concat('bundled.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(jsPath.jsDest));
});

// CSS concat, auto-prefix, minify, then rename output file
gulp.task('minify-css', function() {
  var cssPath = {
    cssSrc:[
      './giriapedia/static/css/*.css',
      '!*.min.css',
      '!/**/*.min.css'
    ],
    cssDest:'./giriapedia/static/css/'
  };

  return gulp.src(cssPath.cssSrc)
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(cssPath.cssDest));
});

// default gulp task
gulp.task('default', ['bundle-scripts', 'minify-css'], function() {
  // watch for JS changes
  gulp.watch('./giriapedia/static/js/**/*.js', ['bundle-scripts']);
  // watch for CSS changes
  gulp.watch('./giriapedia/static/css/*.css', ['minify-css']);
});






