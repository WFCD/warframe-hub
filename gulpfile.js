const gulp = require('gulp');
const minify = require('gulp-minify');
const cleanCss = require('gulp-clean-css');
const del = require('del');

gulp.task('pack-js', ['clean-js'], () => {
  gulp.src(['assets/js/*.js'])
    .pipe(minify({
      ext: {
        min: '.js',
      },
      noSource: true,
    }))
    .pipe(gulp.dest('public/js'));
});

gulp.task('pack-css', ['clean-css'], () => {
  gulp.src(['assets/css/*.css'])
    .pipe(cleanCss())
    .pipe(gulp.dest('public/css'));
});

gulp.task('clean-js', () => {
  del([
    'public/js/main.js',
    'public/js/map.js',
  ]);
});

gulp.task('clean-css', () => {
  del([
    'public/css/main.css',
    'public/css/main.night.css',
    'public/css/main.retro.css',
    'public/css/main.eidolon.css',
    'public/css/common.css',
  ]);
});

gulp.task('default', ['pack-js', 'pack-css']);
