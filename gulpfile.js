var gulp = require('gulp'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    uglify = require('gulp-uglify'),

    // sourcemaps: 可以将打包好的文件重新map回源文件的状态，这样在出错的时候，就不会提示是在例如bundle.js
    // 等打包好了的文件中。而是准确的提示错误信息出现的源码所在位置。方便开发调试
    sourcemaps = require('gulp-sourcemaps');



var production = process.env.NODE_ENV === 'production';

var dependencies = [
    'alt',
    'react',
    'react-dom',
    'react-router',
    'underscore'
];

// 将所有的js文件打包

gulp.task('vendor',function(){
    return gulp.src([
        'bower_components/juqery/dist/jquery.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/magnific-popup/dist/jquery.magnific-popup.js',//响应式的lightbox和模态框脚本
        'bower_components/toaster/toaster.js'//可以对通知提示进行自定义的插件
    ]).pipe(concat('vendor.js'))
      .pipe(gulpif(production,uglify({ mangle:false })))
      .pipe(gulp.dest('public/js'))
})

/*
/将第三方的依赖进行编译，将这些依赖脱离于工程文件进行打包，当工程文件修改重编译的时候，速度更快
*/
gulp.task('browserify-vendor',function() {
    return browserify()
            .require(dependencies)
            .bundle()
            .pipe(source('vendor.bundle.js'))
            .pipe(buffer())
            .gulpif(production,uglify({ mangle:false }))
            .pipe(gulp.dest('public/js'))
})

/*
/将工程文件编译，不包含第三方依赖
*/
gulp.task('browserify',['browserify-vender'],function(){
    return browserify({ entries: 'app/main.js',debug:true })
        .external(dependencies)
        .transform(babelify,{ presets: ['es2015','react']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(gulpif(production,uglify({ mangle: false })))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'))
})


/*
/ 监听打包任务，在修改后重新打包
*/

gulp.task('browserify-watch',['browserify-vendor'],function(){
    var bundler= watchify(browserify({ entries: 'app/main.js', debug:true },watchify.args));
    bundler.external(dependencies)
    bundler.transform(babelify, { presets:['es2015','react'] });
    bundler.on('update',rebundle);
    return rebundle();

    function rebundle(){
         var start = Date.now();
         return bundler.bundle()
            .on('error',function(err) {
                gutil/log(gutil.color.red(err.toString()))
            })
            .on('end', function(){
                gutil.log(gutil/colors.green('finished rebundling in',(Date.now() - start ) + 'ms.'))
            })
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps:true }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public/js/'))
    }
})


gulp.task('styles',function(){
    return gulp.src('app/stylesheets/main.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulpif(production,cssmin()))
        .pipe(gulp.dest('public/css'))
})


gulp.task('watch',function(){
    gulp.watch('app/stylesheets/**/*.less',['styles'])
})

gulp.task('default',['style','vendor','browserify-watch','watch'])
gulp.task('build',['style','vendor','browserify'])
