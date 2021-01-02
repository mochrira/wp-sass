var gulp = require('gulp');
var sass = require('gulp-sass');
var fs = require('fs');
var path = require('path');
var clean = require('gulp-clean');

function unlinkDir(dirPath) {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
      for (var i = 0; i < files.length; i++) {
        var filePath = dirPath + '/' + files[i];
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
        else
          rmDir(filePath);
      }
    fs.rmdirSync(dirPath);
    return;
};

exports.setup = function(config) {

    let styles = config.styles ?? [];
    let srcDir = config.srcDir ?? './src';
    let outDir = config.outDir ?? './dist';

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
        return gulp.src(styles)
            .pipe(sass({
                includePaths: ['node_modules']
            }).on('error', sass.logError))
            .pipe(gulp.dest(outDir));
    });

    gulp.task('build', gulp.series(['clean', 'source', 'sass']));

    gulp.task('watcher', function () {
        var fileWatcher = gulp.watch(srcDir + '/**/!(*.map|*.scss)', { events: 'all', usePolling: true, interval: 2000 });
        fileWatcher.on('error', function(e) {
            console.log('Error :' + e);
            console.log('Watcher Restarted');
            this.emit('end');
        });
    
        fileWatcher.on('all', function (action, file) {
            var filePath = path.relative(path.resolve(srcDir + '/'), path.resolve(file));
            var distPath = path.resolve(path.resolve(outDir), filePath);
    
            if(action == 'unlinkDir') {
                fs.exists(distPath, function (exists) {
                    if(exists) {
                        unlinkDir(distPath);
                        console.log('Directory Removed: ' + filePath + ' -> ' + distPath);
                    }
                })
            }
    
            if(action == 'change' || action == 'add') {
                var copyFile = function () {
                    fs.copyFile(srcDir + '/' + filePath, distPath, function(e) {
                        console.log((action == 'change' ? 'Changed' : 'Created') + ' : ' + filePath + ' -> ' + distPath);
                    });
                }
                fs.exists(path.dirname(distPath), function (exists) {
                    if(!exists) {
                        fs.mkdir(path.dirname(distPath), {recursive : true}, function () {
                            copyFile();
                        });
                    }else{
                        copyFile();
                    }
                })
            }
    
            if(action == 'unlink') {
                fs.unlink(distPath, function(e) {
                    console.log('Deleted : ' + filePath + ' -> ' + distPath);
                });
            }
        });
    
    
        gulp.watch(styles, { events: 'all', usePolling: true, interval: 2000 }, gulp.series(['sass']));
    });

    gulp.task('watch', gulp.series(['build', 'watcher']));

}