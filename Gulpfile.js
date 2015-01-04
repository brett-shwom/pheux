var gulp = require('gulp')
  , connect = require('gulp-connect')
  ;

gulp.task('connect', function() {
  connect.server({
    root: 'dest-demo',
    port : 8080,
    livereload: true
  })
})

gulp.task('html', function () {
  gulp.src('./demo/**/*.html')
    .pipe(gulp.dest('./dest-demo/'))
    .pipe(connect.reload())
})

gulp.task('js', function () {
  gulp.src('./demo/**/*.js')
    .pipe(gulp.dest('./dest-demo/'))
    .pipe(connect.reload())
})

gulp.task('css', function () {
  gulp.src('./demo/**/*.css')
    .pipe(gulp.dest('./dest-demo/'))
    .pipe(connect.reload());
})

gulp.task('pheux-source', function () {
  gulp.src('./pheux.js')
    .pipe(gulp.dest('./dest-demo/'))
    .pipe(connect.reload())
})


gulp.task('watch', function () {
  gulp.watch(['./demo/**/*.html'], ['html'])
  gulp.watch(['./demo/**/*.js'], ['js'])
  gulp.watch(['./demo/**/*.css'],['css'])
  gulp.watch(['./pheux.js'], ['pheux-source'])
})

gulp.task('default', ['connect', 'compile', 'watch'])
gulp.task('compile', ['js', 'css', 'html','pheux-source'])
