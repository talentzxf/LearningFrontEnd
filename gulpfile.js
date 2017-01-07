var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var paths = {
    pages: ['src/*.html']
};

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/rubiccube.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

var watchedImgProcessingBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/CameraImgPicker.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dst"));
});

function bundle() {
    watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dst"));

    watchedImgProcessingBrowserify
        .bundle()
        .pipe(source('img.js'))
        .pipe(gulp.dest("dst"));
}

gulp.task("default", ["copy-html"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);