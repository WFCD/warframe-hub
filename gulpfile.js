const gulp = require('gulp');
const minify = require('gulp-minify');
const cleanCss = require('gulp-clean-css');
const del = require('del');
const hashsum = require('gulp-hashsum');

gulp.task('clean-js', () => del([
  './public/js/main.js',
  './public/js/maps.js',
  './public/js/updaters.js',
  './public/js/utilities.js',
  './public/sums.json',
]));

gulp.task('clean-css', () => del([
  './public/css/main.css',
  './public/css/main.night.css',
  './public/css/main.retro.css',
  './public/css/main.eidolon.css',
  './public/css/common.css',
]));

gulp.task('pack-js', () => gulp.src(['assets/js/*.js'])
  .pipe(minify({
    ext: {
      min: '.js',
    },
    noSource: true,
  }))
  .pipe(gulp.dest('public/js')));

gulp.task('pack-css', () => gulp.src(['./assets/css/*.css'])
  .pipe(cleanCss())
  .pipe(gulp.dest('./public/css')));

gulp.task('hash', () => gulp.src(['public/js/**/*.js', 'public/css/**/*.css'])
  .pipe(hashsum({
    dest: 'public',
    json: true,
    force: true,
    filename: 'sums.json',
  })));

gulp.task('default', gulp.series('clean-js', 'clean-css', 'pack-css', 'pack-js'));

gulp.task('default-hash', gulp.series('default', 'hash'));
