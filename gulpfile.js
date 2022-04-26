const { src, dest, parallel, series, watch } = require("gulp");
const uglify = require("gulp-uglify");
const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const htmlreplace = require("gulp-html-replace");
const replace = require("gulp-replace");
const del = require("del");

// folder path
const path = {
    src: "./src/",
    dist: "./build/",
    devCSS: "./src/css",
    devSassfolder: "./src/sass/**/*.+(sass|scss)",
    devSass: "./src/sass/*.+(sass|scss)",
    devJS: "./src/js/**/*js",
    devHTML: "./src/*.html",
    devImages: "./src/images/*.+(png|jpg|jpeg|gif|svg)",
    provCSS: "./build/css",
    provJS: "./build/js",
    provImages: "./build/images/",
};

let partten = /[\.\.\/]*(\/images\/*.+[png|jpg|jpeg|gif|svg])/gi;
// do : sourcemaps + sass -> css
function buildCSS() {
    return src(path.devSass)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write("."))
        .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(rename({ extname: ".min.css" }))
        .pipe(replace(partten, "..$1"))
        .pipe(dest(path.provCSS));
}

// ---= production =---\\
// clean
function clean() {
    return del(path.dist); // 需刪除檔案或目錄
}

// // do : babel + uglify + rename
function buildJS() {
    return src(path.devJS)
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(dest(path.provJS));
}
function buildHTML() {
    return src(path.devHTML)
        .pipe(
            htmlreplace({
                css: "css/app.min.css",
                js: {
                    src: "js/index.min.js",
                    tpl: '<script src="%s" defer></script>',
                },
            })
        )
        .pipe(dest(path.dist));
}
function buildImgaes() {
    return src(path.devImages).pipe(dest(path.provImages));
}
// ---= dev =---\\
function devSass() {
    return src(path.devSass)
        .pipe(sass().on("error", sass.logError))
        .pipe(dest(path.devCSS))
        .pipe(browserSync.stream());
}
function serve() {
    devSass();
    browserSync.init({
        server: {
            baseDir: path.src,
        },
    });

    watch(path.devHTML).on("change", browserSync.reload);
    watch(path.devSassfolder, series(devSass)).on("change", browserSync.reload);
    watch(path.devJS).on("change", browserSync.reload);
}

exports.prod = series(
    clean,
    parallel(buildCSS, buildJS),
    buildHTML,
    buildImgaes
);
exports.serve = serve;
