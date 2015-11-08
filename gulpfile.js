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

browserifyOptions = {
  entries: ['./js/main.js'],
  debug: true,
  standalone: 'widget'
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

gulp.task('serve', function() {
  gulp.src('build')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('watch', ['lint'], function() {
  b = watchify(browserifyBuild);
  b.on('update', function(){
    build(b);
  });
  b.on('log', gutil.log);
  return build(b);
})

gulp.task('default', ['watch', 'serve']);

function build(b) {
  return b.bundle()
    .pipe(source('widget.js'))
    .pipe(buffer())
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest('./build/'));
}
