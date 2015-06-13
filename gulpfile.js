var gulp = require('gulp');
var clean = require('gulp-clean');
var util = require('gulp-util');
var rename = require('gulp-rename');
var through2 = require('through2');
var jsdc = require('jsdc');
var lefty = require('lefty');

var fs = require('fs');
var path = require('path');

function mkdir(dir) {
  if(!fs.existsSync(dir)) {
    var parent = path.dirname(dir);
    mkdir(parent);
    fs.mkdirSync(dir);
  }
}

gulp.task('clean-bulid', function() {
  return gulp.src('./build/*')
    .pipe(clean());
});

gulp.task('clean-web', function() {
  return gulp.src('./web/*')
    .pipe(clean());
});

function cb(file, enc, cb) {
  var target = file.path.replace(path.sep + 'src' + path.sep,  path.sep + 'build' + path.sep);
  util.log(path.relative(file.cwd, file.path), '->', path.relative(file.cwd, target));
  var content = file.contents.toString('utf-8');
  jsdc.reset();
  content = jsdc.parse(content);
  file.contents = new Buffer(content);
  cb(null, file);
}
function cb2(file, enc, cb) {
  var target = file.path.replace(path.sep + 'build' + path.sep,  path.sep + 'web' + path.sep);
  util.log(path.relative(file.cwd, file.path), '->', path.relative(file.cwd, target));
  var content = file.contents.toString('utf-8');
  content = 'define(function(require, exports, module){' + content + '});';
  file.contents = new Buffer(content);
  cb(null, file);
}

gulp.task('default', ['clean-bulid', 'clean-web'], function() {
  gulp.src('./src/**/*.js')
    .pipe(through2.obj(cb))
    .pipe(gulp.dest('./build/'))
    .pipe(through2.obj(cb2))
    .pipe(gulp.dest('./web/'));
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', function(file) {
    var to = file.path.replace(path.sep + 'src' + path.sep,  path.sep + 'build' + path.sep);
    to = path.dirname(to);
    var to2 = file.path.replace(path.sep + 'src' + path.sep,  path.sep + 'web' + path.sep);
    to2 = path.dirname(to2);
    gulp.src(file.path)
      .pipe(through2.obj(cb))
      .pipe(gulp.dest(to))
      .pipe(through2.obj(cb2))
      .pipe(gulp.dest(to2));
  });
});

gulp.task('clean-jsx', function() {
  gulp.src(['./tests/**/*.js', '!./tests/*.js'])
    .pipe(clean());
});

function jsx(file, enc, cb) {
  var target = file.path.replace('jsx',  'js');
  util.log(path.relative(file.cwd, file.path), '->', path.relative(file.cwd, target));
  var content = file.contents.toString('utf-8');
  content = 'define(["migi"],function(require,exports,module){' + lefty.parse(content, true) + '});';
  file.contents = new Buffer(content);
  cb(null, file);
}

gulp.task('build-test', ['clean-jsx'], function() {
  gulp.src('./tests/**/*.jsx')
    .pipe(through2.obj(jsx))
    .pipe(rename({extname:'.js'}))
    .pipe(gulp.dest('./tests/'));
});