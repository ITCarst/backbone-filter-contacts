//Gulp Dependencies
var gulp = require("gulp"),
    rename = require("gulp-rename"),
    notify = require("gulp-notify"),
    uglify = require("gulp-uglify"),
    del = require("del"),
    livereload = require("gulp-livereload");

//Build Dependencies
var browserify = require("gulp-browserify");

//Style Dependencies
var sass = require("gulp-sass"),
    minifycss = require("gulp-minify-css");

//JS Dependencies
var jshint = require("gulp-jshint"),
    concat = require("gulp-concat"),
    rjs = require("requirejs"),
    shell = require("gulp-shell");

//Test Dependencies
var jasmine = require("gulp-jasmine"),
    mocha = require("gulp-mocha");

//Tasks
//jshint - client js
gulp.task("lint-client", function () {
    return gulp.src(["**/*.js", "!node_modles/**", "!libs/**", "!gulpfile.js"])
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});
//jshint - tests js
gulp.task("lint-tests", function () {
    return gulp.src("./tests/**/*js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

//before we run the build make sure the r.js is installed
gulp.task("test_r", function () {
    return gulp.src("")
        .pipe(shell(["r.js"], {ignoreErrors: true}))
        .on("error", notify.onError({
            title: "r.js",
            message: "Error r.js is not installed"
        }))
        .pipe(notify({message: "r.js is installed"}));
});

//build the main.min.js
gulp.task("build", function () {
    return gulp.src("")
        .pipe(shell(["r.js -o build.js"]))
        .pipe(notify("Build completed!"));
});

//Styles
gulp.task("sass", function () {
    return gulp.src("../scss/screen.scss", {style : "expanded"})
        .pipe(sass())
        .pipe(rename({suffix: ".min"}))
        .pipe(minifycss())
        .pipe(gulp.dest("../dist"))
        .pipe(notify({message : "Styles completed!"}));
});

//Clean
gulp.task("clean", function () {
    del(["../dist"]);
});

//Default task
gulp.task("default", ["clean"], function () {
    gulp.start("sass", "test_r", "build");
});

//Gulp Watch
gulp.task("watch", function () {
    //watch sass files
    gulp.watch("../scss/screen.scss", ["sass"]);
    //watch js files
    gulp.watch("**/*.js", ["js"]);
    //create livereaload
    livereload.listen();
    //watch the files on dist folder
    gulp.watch(["../dist/**"]).on("change", livereload.changed);
});
