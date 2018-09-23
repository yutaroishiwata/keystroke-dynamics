var gulp = require('gulp');
var pug = require('gulp-pug');
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var browserSync = require('browser-sync');

//path
var paths = {
  'pug': 'app/pug/*.pug',
  'pugNotRead': 'app/pug/**/(_)*.pug',
  'html': './app',
  'js': 'app/js/*.js'
}

//setting : Pug Options
var pugOptions = {
  pretty: true
}

//Pug
gulp.task('pug', () => {
  return gulp.src([paths.pug, '!' + paths.pugNotRead])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug(pugOptions))
    .pipe(gulp.dest(paths.html));
});

//Browser Sync
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

//watch
gulp.task('watch', function () {
  gulp.watch([paths.pug, '!' + paths.pugNotRead], ['pug']);
});

gulp.task('default', ['browser-sync','watch']);
