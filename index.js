var gulp = require('gulp');
var sass = require('gulp-sass');
var fs = require('fs');
var clean = require('gulp-clean');

exports.setup = function(srcDir, outDir) {

    gulp.task('clean', function () {
        var isExists = fs.existsSync(outDir);
        if(isExists) {
            return gulp.src(outDir).pipe(clean({force: true, allowEmpty: true}));
        }
        return Promise.resolve(true);
    });

    gulp.task('source', function () {
        return gulp.src(srcDir + '/**/*.!(map|scss)')
            .pipe(gulp.dest(outDir));
    });    

    gulp.task('sass', function () {
        return gulp.src(srcDir + '/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(outDir));
    });

    gulp.task('build', gulp.series(['clean', 'source', 'sass']));

}