var concat = require('gulp-concat');
var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')
var templateCache = require('gulp-angular-templatecache');
var addsrc = require('gulp-add-src');


gulp.task('build', function () {
    gulp.src('src/**/*.htm')
        .pipe(templateCache({
            module: 'AudioTrackr'
        }))
        
        //.pipe(gulp.src(['src/app.js', 'src/**/*.js']))
        // needs fix: https://github.com/wearefractal/vinyl-fs/issues/25
        .pipe(addsrc(['src/app.js', 'src/**/*.js']))
        
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});



gulp.task('watch', function () {
    gulp.watch('src/**/*', ['build'])
});
