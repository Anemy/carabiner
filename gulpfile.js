'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var normalize = require('node-normalize-scss');
var concat = require('gulp-concat');
var shell = require('gulp-shell');
var server = require( 'gulp-develop-server' );


var config = {
  sassPath: './src/styles',
  bowerDir: './bower_components',
  cssDestDir: './dist/assets/css',
  jsPath: './src/scripts/*.js',
  jsDestDir: './dist/assets/js'
}

gulp.task('copy', function() {
  return gulp
    .src([
      './src/Procfile',
      './src/server.js',
      './src/server_game.js',
      './package.json'
    ])
    .pipe(gulp.dest('dist'));
});

gulp.task('views', function() {
  return gulp
    .src('./src/views/**/*')
    .pipe(gulp.dest('dist/views'));
});

gulp.task('controllers', function() {
  return gulp
    .src('./src/controllers/**/*')
    .pipe(gulp.dest('dist/controllers'));
});

gulp.task('models', function() {
  return gulp
    .src('./src/models/**/*')
    .pipe(gulp.dest('dist/models'));
});

gulp.task('assets', function() {
  return gulp
    .src('./src/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('scripts', function() {
  return gulp.src([
      config.bowerDir + '/jquery/dist/jquery.js',
      config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js',
      config.jsPath
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(config.jsDestDir));
});

gulp.task('sass', function() {
  var sassPaths = [normalize.includePaths];
  sassPaths.push(config.bowerDir + '/bootstrap-sass/assets/stylesheets');

  gulp.src(config.sassPath + '/*.scss')
    .pipe(concat('main.css'))
    .pipe(sass({
      includePaths: sassPaths
    }).on('error', sass.logError))
    .pipe(gulp.dest(config.cssDestDir));
});

gulp.task('sass:watch', function() {
  gulp.watch('./src/styles/*.scss', ['sass']);
});

gulp.task('js', ['copy', 'assets', 'views', 'models',
                 'controllers', 'scripts']);

gulp.task('js:watch', function() {
  gulp.watch(['src/*.js', 'src/**/*.js'], ['js']);
});

gulp.task( 'server:start', function() {
    server.listen( { path: './dist/server.js' } );
});

gulp.task( 'server:restart', function() {
    gulp.watch( [ './dist/server.js' ], server.restart );
});

gulp.task('watchall', ['js:watch', 'sass:watch', 'server:restart']);
gulp.task('buildall', ['js', 'sass']);
gulp.task('default', [ 'js', 'sass', 'server:start', 'watchall']);
