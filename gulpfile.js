var concat = require('gulp-concat');
var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
//var sourcemaps = require('gulp-sourcemaps')
//var uglify = require('gulp-uglify')


gulp.task('js', function () {
    //gulp.src(['src/**/lettersCtrl.js', 'src/**/*.js'])
    //gulp.src(['src/**/*.js'])
    gulp.src(['src/**/app.js', 'src/**/*.js'])
        //.pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        //.pipe(uglify())
        //.pipe(sourcemaps.write())
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});


gulp.task('watch', ['js'], function () {
    gulp.watch('src/**/*.js', ['js'])
});

gulp.task('default', function() {
    console.log('default task');
});
