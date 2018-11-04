var gulp = require('gulp');
var pug = require('gulp-pug');
var babel = require('gulp-babel');
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

// setting : Pug Options
var pugOptions = {
  pretty: true
}

// Pug
gulp.task('pug', () => {
  return gulp.src([paths.pug, '!' + paths.pugNotRead])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug(pugOptions))
    .pipe(gulp.dest(paths.html));
});

// Babel
gulp.task('babel', () => {
  gulp.src(paths.jsSrc)
    .pipe(babel())
    .pipe(gulp.dest(paths.jsApp));
});

// Browser Sync
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: paths.html
    }
  });
  gulp.watch(paths.js, ['reload']);
  gulp.watch(paths.html, ['reload']);
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
