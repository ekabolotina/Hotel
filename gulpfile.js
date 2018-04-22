var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    gautoprefixer = require('gulp-autoprefixer'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    webpackStream = require('webpack-stream'),
    uglify = require('gulp-uglify'),
    cssBase64 = require('gulp-css-base64'),
    named = require('vinyl-named'),

    base = {
        dist: 'front',
        build: 'wp-content/themes/hotel/static'
    },
    params = {
        site: 'http://hotel.local',
        templates: 'wp-content/themes/hotel/templates',
        dist: {
            fonts: base.dist + '/fonts',
            scss: base.dist + '/css',
            img: base.dist + '/img',
            scripts: base.dist + '/scripts'
        },
        build: {
            fonts: base.build + '/fonts',
            img: base.build + '/img',
            css: base.build + '/css',
            js: base.build + '/js'
        }
    };


// BrowserSync
gulp.task('browser-sync', function(){
    browserSync.init({
        proxy: {
            target: params.site,
        },
        notify: true
    });
});

gulp.task('browser-sync-reload', function(){
    browserSync.reload();
});


// IMGs
gulp.task('imgs', function(){
    return gulp.src(params.dist.img + '/**/*.{png,gif,jpg,jpeg}')
        .pipe(imagemin())
        .pipe(gulp.dest(params.build.img));
});


// Fonts
gulp.task('fonts', function(){
    return gulp.src(params.dist.fonts + '/**/*.*')
        .pipe(gulp.dest(params.build.fonts));
});


// SASS
gulp.task('scss', function(){
    return gulp.src(params.dist.scss + '/*.scss')
        .pipe(sourcemaps.init({ largeFile: true }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gautoprefixer({ browsers: ['last 5 versions'], cascade: false }))
        .pipe(sourcemaps.write())
        .pipe(cssBase64())
        .pipe(gulp.dest(params.build.css))
        .pipe(browserSync.stream());
});


// Scripts
gulp.task('common-scripts', function(){
    return gulp.src([params.dist.scripts + '/*.js'])
        .pipe(rigger())
        .pipe(gulp.dest(params.build.js));
});

gulp.task('scripts', ['common-scripts'], function(){
    return gulp.src([params.dist.scripts + '/es/*.js'])
        .pipe(named())
        .pipe(webpackStream( {output: {filename: '[name].js'} } ))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(params.build.js));
});


// Build project
gulp.task('build', ['scss', 'scripts', 'imgs', 'fonts'], function(){
    gulp.src(params.dist.fonts + '/**/*') // Build fonts
        .pipe(gulp.dest(params.build.fonts));

    gulp.src(params.build.css + '/*.css') // Build CSS
        .pipe(cssnano())
        .pipe(gulp.dest(params.build.css));

    gulp.src(params.build.js + '/*.js') // Build JS
        .pipe(uglify())
        .pipe(gulp.dest(params.build.js));
});


// Watch project
gulp.task('watch', ['scss', 'scripts', 'browser-sync'], function(){
    gulp.watch(base.dist + '/**/*.scss', ['scss']); // Watch SCSS
    gulp.watch(base.dist + '/**/*.js', ['scripts', 'browser-sync-reload']); // Watch Scripts
    gulp.watch(params.templates + '/**/*.twig', browserSync.reload); // Watch Templates
});


gulp.task('default', ['watch']);
