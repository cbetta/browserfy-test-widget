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

browserifyOptions = {
  entries: ['./js/main.js'],
  debug: true
};
allOptions = assign({}, watchify.args, browserifyOptions);
var browserifyBuild = browserify(allOptions);

gulp.task('lint', function() {
  return gulp.src(['js/*.js', 'modules/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('build', ['lint'], function() {
  return build(browserifyBuild);
});

gulp.task('watch', function() {
  b = watchify(browserifyBuild);
  b.on('update', function(){
    build(b);
  });
  b.on('log', gutil.log);
  return build(b);
})

function build(b) {
  return b.bundle()
    .pipe(source('widget.js'))
    .pipe(buffer())
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest('./build/'));
}
