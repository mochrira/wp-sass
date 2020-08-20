var gulp = require('gulp');
var sass = require('gulp-sass');

exports.setup = function(srcDir, outDir) {
    
    gulp.task('build', function ()  {
        return gulp.src(srcDir + '/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(outDir))
    });

}