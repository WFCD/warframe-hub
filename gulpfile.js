const gulp = require('gulp');
const minify = require('gulp-minify');
const cleanCss = require('gulp-clean-css');
const del = require('del');
const concat = require('gulp-concat');

gulp.task('concat-templates', ['clean-templates'], () => {
  gulp.src(['components/*/template.hbs'])
    .pipe(concat('concat-templates.hbs'))
    .pipe(gulp.dest('views/partials'));
});

gulp.task('concat-js', () => gulp.src(['components/base.js', 'components/*/component.js'])
  .pipe(concat('components.js'))
  .pipe(gulp.dest('assets/js')));

gulp.task('pack-js', ['clean-js', 'concat-js'], () => {
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

gulp.task('clean-templates', () => {
  del([
    'views/partials/concat-templates.hbs',
  ]);
});

gulp.task('clean-js', () => {
  del([
    'assets/js/components.js',
    'public/js/components.js',
    'public/js/main.js',
    'public/js/map.js',
  ]);
});

gulp.task('clean-css', () => {
  del([
    'public/css/main.css',
    'public/css/main.night.css',
    'public/css/main.retro.css',
  ]);
});

gulp.task('default', ['concat-templates', 'pack-js', 'pack-css']);
