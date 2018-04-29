
var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    prefixer    = require('gulp-autoprefixer'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    imports     = require('gulp-imports'),
    pug         = require('gulp-pug'),
    cssmin      = require('gulp-minify-css'),
    rimraf      = require('rimraf'),
    csscomb     = require('gulp-csscomb'),
    browserSync = require('browser-sync'),
    media_group = require('gulp-group-css-media-queries'),
    rename      = require('gulp-rename'),
    prettyHtml  = require('gulp-pretty-html'),
    reload      = browserSync.reload;



    var path = {
            dist: {
                css: 'dist/css/',
                html: 'dist/',
                js: 'dist/js/',
                images: 'dist/images/'
            },

            src: {
                css: ['!src/scss/_*.scss','src/scss/*.scss'],
                pug: ['!src/pug/**/_*.pug','src/pug/**/*.pug'],
                js: ['src/js/*.js'],
            },

            watch: {
                css: 'src/scss/**/*.scss',
                pug: 'src/pug/**/*.pug',
                js: 'src/js/**/*.js',
                images: 'src/images'
            },

            clean: 'dist'
    }


    var config = {
        server: {
            baseDir: './dist'
        },
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: 'Postnov.Frontend'
    };




    //sass
    gulp.task('css:build', function() {
        return gulp.src(path.src.css)
            .pipe(sass())
            .on('error', function (err) {
                console.log(err.toString());
                this.emit('end');
            })
            .pipe(prefixer({
                browsers: ['last 15 versions'],
                cascade: false,
                grid: true
            }))
            .pipe(csscomb())
            .pipe(media_group())
            .pipe(gulp.dest(path.dist.css))
            .pipe(rename({suffix: '.min'}))
            .pipe(cssmin())
            .pipe(gulp.dest(path.dist.css))
            .pipe(reload({ stream: true }));
    });



    //pug

    gulp.task('pug:build', function() {
        return gulp.src(path.src.pug)
            .pipe(pug({pretty: true}))
            .on('error', function (err) {
                console.log(err.toString());
                this.emit('end');
            })
            .pipe(prettyHtml({
                indent_size: 4,
                indent_char: ' ',
                unformatted: ['code', 'pre', 'em', 'strong', 'i', 'b', 'br']
            }))
            .pipe(gulp.dest(path.dist.html))
            .pipe(reload({ stream: true }))
    });


    //js
    gulp.task('js:build', function() {
        return gulp.src(path.src.js)
            .pipe(imports())
            .on('error', function (err) {
                console.log(err.toString());
                this.emit('end');
            })
            .pipe(gulp.dest(path.dist.js))
            .pipe(uglify())
            .pipe(rename({suffix:'.min'}))
            .pipe(gulp.dest(path.dist.js))
            .pipe(reload({ stream: true }))
    });


    //watch
    gulp.task('watch', ['images:build', 'fonts:build', 'css:build','js:build', 'pug:build'], function () {
        gulp.watch(path.watch.css, ['css:build'])
        gulp.watch(path.watch.js, ['js:build'])
        gulp.watch(path.watch.pug, ['pug:build'])
    });



    //build
    gulp.task('build', [
        'pug:build',
        'css:build',
        'js:build',
        'images:build',
        'fonts:build',
    ])


    gulp.task('webserver', function() {
        browserSync(config);
    });

    gulp.task('clean', function(cb) {
        rimraf(path.clean, cb);
    });

    gulp.task('default', ['build', 'webserver', 'watch']);
