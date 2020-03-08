var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var browserSync = require("browser-sync").create();
var minify = require("gulp-csso");
var del = require("del");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");


gulp.task("style", function () {
    return gulp.src("source/sass/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([autoprefixer({
            overrideBrowserslist:  ['last 3 versions'],
            cascade: false
        })]))
        .pipe(gulp.dest("public/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("public/css"));
});
gulp.task("clean", function () {
    return del("public");
});
gulp.task("copy", function () {
    return gulp.src([
        "source/fonts/**/*.{woff,woff2}",
        "source/img/**",
        "source/js/**",
        "source/*.html"
    ], {
        base: "source",
        since: gulp.lastRun("copy")
    })
        .pipe(gulp.dest("public"));
});

gulp.task("watch", function () {
    gulp.watch("source/sass/*.scss", gulp.series("style"));
    gulp.watch("source", gulp.series("copy"));

});
gulp.task("build", gulp.series("clean",gulp.parallel("style", "copy")));
gulp.task("serve", function () {
    browserSync.init({
        server: "public"
    });
    browserSync.watch("public/**/*.*").on("change", browserSync.reload);
});

gulp.task("dev", gulp.series("build", gulp.parallel("watch", "serve")));