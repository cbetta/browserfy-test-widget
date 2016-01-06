var gulp        = require('gulp');
var jshint      = require('gulp-jshint')
var stylish     = require('jshint-stylish');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var uglify      = require('gulp-uglify');
var buffer      = require('vinyl-buffer');
var gutil       = require('gulp-util');
var watchify    = require('watchify');
var assign      = require('lodash.assign');
var webserver   = require('gulp-webserver');
var babel       = require('gulp-babel');

widgetOptions = {
  entries: ['./js/widget/main.js'],
  debug: true,
  standalone: 'widget'
};
allWidgetOptions = assign({}, watchify.args, widgetOptions);
var widgetBuild = browserify(allWidgetOptions);

iframeOptions = {
  entries: ['./js/iframe/main.js'],
  debug: true,
  standalone: 'iframe'
};
allIframeOptions = assign({}, watchify.args, iframeOptions);
var iframeBuild = browserify(allIframeOptions);

gulp.task('lint', function() {
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('build-widget', ['lint'], function() {
  return build(widgetBuild, 'dropin.js', './build/widget/');
});

gulp.task('build-iframe', ['lint'], function() {
  return build(iframeBuild, 'iframe.js', './build/iframe/');
});

gulp.task('build', ['lint', 'build-widget', 'build-iframe']);

gulp.task('serve-widget', function() {
  gulp.src('build/widget')
    .pipe(webserver({
      port: 3000,
      livereload: {enable: true, port: 2345},
      open: true
    }));
});

gulp.task('serve-iframe', function() {
  gulp.src('build/iframe')
    .pipe(webserver({
      port: 3001,
      livereload: {enable: true, port: 2346},
      open: false
    }));
});

gulp.task('serve', ['serve-iframe', 'serve-widget']);

gulp.task('watch-widget', ['lint'], function() {
  b = watchify(widgetBuild);
  b.on('update', function(){
    build(widgetBuild, 'dropin.js', './build/widget/');
  });
  b.on('log', gutil.log);
  return build(widgetBuild, 'dropin.js', './build/widget/');
});

gulp.task('watch-iframe', ['lint'], function() {
  b = watchify(iframeBuild);
  b.on('update', function(){
    build(iframeBuild, 'iframe.js', './build/iframe/');
  });
  b.on('log', gutil.log);
  return build(iframeBuild, 'iframe.js', './build/iframe/');
});

gulp.task('watch', ['watch-widget', 'watch-iframe']);

gulp.task('default', ['watch', 'serve']);

function build(b, filename, target) {
  return b.bundle()
    .pipe(source(filename))
    .pipe(buffer())
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest(target));
}
