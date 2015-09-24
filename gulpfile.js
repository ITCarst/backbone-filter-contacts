//Gulp Dependencies
var gulp = require("gulp"),
    rename = require("gulp-rename"),
    notify = require("gulp-notify"),
    uglify = require("gulp-uglify"),
    del = require("del"),
    livereload = require("gulp-livereload");

//Style Dependencies
var sass = require("gulp-sass"),
    minifycss = require("gulp-minify-css");

//JS Dependencies
var jshint = require("gulp-jshint"),
    concat = require("gulp-concat"),
    rjs = require("requirejs"),
    shell = require("gulp-shell");

//Test Dependencies
var karma = require("karma").server;

//Tasks
//jshint - client js
gulp.task("lint-client", function () {
    return gulp.src(["public/js/**/*.js", "!public/js/libs/**", "!public/js/build.js"])
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});
//jshint - tests js
gulp.task("lint-test", function () {
    return gulp.src("test/**/*.test.js")
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
        .pipe(shell(["r.js -o public/js/build.js"]))
        .pipe(notify("Build completed!"));
});

//Styles
gulp.task("sass", function () {
    return gulp.src("public/scss/screen.scss", {style : "expanded"})
        .pipe(sass())
        //.pipe(rename({suffix: ".min"}))
        //.pipe(minifycss())
        .pipe(gulp.dest("dist"))
        .pipe(notify({message : "Styles completed!"}));
});

gulp.task("test", function (done) {
    karma.start({
        configFile: __dirname + "/karma.conf.js",
        singleRun: false
    }, function (exitCode) {
        done(exitCode ? "There are failing unit tests" : undefined);
    });
});

//Clean
gulp.task("clean", function () {
    del(["../dist"]);
});

gulp.task("autotest", function () {
    gulp.start("test");
});

//Default task
gulp.task("default", ["clean"], function () {
    gulp.start("sass", "test_r", "build", "lint-client", "lint-test", "autotest");
});

//Gulp Watch
gulp.task("watch", function () {
    //watch sass files
    gulp.watch("public/scss/screen.scss", ["sass"]);
    //watch js files
    gulp.watch("test/**/*.js", ["test"]);
    //create livereaload
    livereload.listen();
    //watch the files on dist folder
    gulp.watch(["dist/**"]).on("change", livereload.changed);
});
