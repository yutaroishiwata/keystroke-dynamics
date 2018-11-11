var gulp = require('gulp');
var pug = require('gulp-pug');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var browserSync = require('browser-sync');

// path
var paths = {
  'pug': './src/pug/*.pug',
  'pugNotRead': './src/pug/**/(_)*.pug',
  'html': './app',
  'jsSrc': './src/js/*.js',
  'jsApp': './app/js',
}

// Pug
gulp.task('pug', () => {
  return gulp.src([paths.pug, '!' + paths.pugNotRead])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.html));
});

// Babel
gulp.task('babel', () =>
  gulp.src(paths.jsSrc)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(paths.jsApp))
);

// eslint
gulp.task('lint', () => {
  return gulp.src(['**/*.js','!node_modules/**'])
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Browser Sync
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: paths.html
    }
  });
  gulp.watch(paths.pug, ['reload']);
  gulp.watch(paths.jsSrc, ['reload']);
});
gulp.task('reload', () => {
  browserSync.reload();
});

// watch
gulp.task('watch', () => {
  gulp.watch([paths.pug, '!' + paths.pugNotRead], ['pug']);
  gulp.watch([paths.jsSrc], ['babel']);
});

// command
gulp.task('default', ['browser-sync','watch']);

