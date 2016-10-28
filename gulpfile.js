var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
var util = require('gulp-util');
var rename = require('gulp-rename');
var through2 = require('through2');
var jsdc = require('jsdc');
var lefty = require('lefty');
var jaw = require('jaw');

var fs = require('fs');
var path = require('path');

var package = require('./package.json');

function mkdir(dir) {
  if(!fs.existsSync(dir)) {
    var parent = path.dirname(dir);
    mkdir(parent);
    fs.mkdirSync(dir);
  }
}

gulp.task('clean-bulid', function() {
  return gulp.src('./build/*')
    .pipe(rimraf());
});

gulp.task('clean-web', function() {
  return gulp.src('./web/*')
    .pipe(rimraf());
});

function cb(file, enc, cb) {
  util.log(path.relative(file.cwd, file.path));
  var content = file.contents.toString('utf-8');
  jsdc.reset();
  content = jsdc.parse(content);
  file.contents = new Buffer(content);
  cb(null, file);
}
function cb2(file, enc, cb) {
  util.log(path.relative(file.cwd, file.path));
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
  gulp.watch(['./tests/**/*.jsx', '!./tests/**/*-lie.jsx'], function(file) {
    gulp.src(file.path)
      .pipe(through2.obj(jsx))
      .pipe(rename({extname:'.js'}))
      .pipe(gulp.dest(path.dirname(file.path)));
  });
});

gulp.task('clean-jsx', function() {
  gulp.src(['./tests/**/script.js', './tests/**/*-lie.*', './tests/test*.js'])
    .pipe(rimraf());
});

function jsx(file, enc, cb) {
  util.log(path.relative(file.cwd, file.path));
  var content = file.contents.toString('utf-8');
  if(content.indexOf('`') > -1) {
    content = content.replace(/`([^`]+)`/g, function($0, $1) {
      return JSON.stringify(jaw.parse($1));
    });
  }
  content = lefty.parse(content, true);
  file.contents = new Buffer(content);
  cb(null, file);
}

gulp.task('build-test', ['clean-jsx'], function() {
  gulp.src(['./tests/**/*.jsx', '!./tests/**/*-lie.jsx'])
    .pipe(through2.obj(jsx))
    .pipe(rename({
      extname:'.js'
    }))
    .pipe(gulp.dest('./tests/'));
});

gulp.task('spm', function() {
  gulp.src('./dist/migi/' + package.version + '/index.js')
    .pipe(gulp.dest('./dist'))
});
