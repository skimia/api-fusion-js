var $gulp = require('gulp');

var $ts =       require('gulp-typescript');
var $sass =      require('gulp-sass');
var $template =  require('gulp-templatecache');
var $live =      require('gulp-livereload');

var sassConfig = {
    onError: console.error.bind(console, 'SASS Error:')
}

$gulp.task('ts', function() {
    return $gulp.src('src/ts/**/*.ts')
        .pipe($ts({
            out: 'fusion.core.js',
            target: 'ES5'
        }))
        .pipe($gulp.dest('dist/js'));
});
$gulp.task('tst', function() {
    return $gulp.src('src/ts/**/*.html')
        .pipe($template({
            root: '/ts',
            moduleName: 'jstack',
            output: 'fusion.core.templates.js',
            strip: __dirname +'/ts/'
        }))
        .pipe($gulp.dest('dist/js'));
});

$gulp.task('sass', function(){

    return $gulp.src('src/sass/**/*.scss')
        .pipe($sass(sassConfig))
        .pipe($gulp.dest('dist/css'));
});

$gulp.task('watch', ['ts','tst'], function() {

    $live.listen();

    $gulp.watch('src/ts/**/*.ts', ['ts'])
        .on('change', function(event){
            console.info('-----Change detected on "' + event.path +'"-----');
            //$live.changed(event.path);
        });
    $gulp.watch('src/ts/**/*.html', ['tst'])
        .on('change', function(event){
            console.info('-----Change detected on "' + event.path +'"-----');
            $live.changed(event.path);
        });

    $gulp.watch('src/sass/**/*.scss', ['sass'])
        .on('change', function(event){
            console.info('-----Change detected on "' + event.path +'"-----');
            $live.changed(event.path);
        });

    $gulp.watch(['dist/js/**/*.js','dist/css/**/*.css'])
        .on('change', function(event){
            $live.changed(event.path);
        });
});