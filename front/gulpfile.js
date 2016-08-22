// Generated on 2016-06-07 using generator-angular 0.14.0
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;

var tempPath = ".tmp/";
var deployPath = "dist/";
var serverPath = "develop/";
var jsSrc = "app/js/**/*.js";
var cssSrc = "app/css/**/*.css";
var indexHTML = "app/index.html";
var templateSrc = "app/html/**/*html";
var htmlTemplatecacheJS = "htmlTemplatecache.js";
var appName = "app";

var wireDepOpt = {
  //exclude: [/bootstrap\.css/],
  directory: "bower_components"
};

gulp.task("less", function () {
    var less = require('gulp-less');
    gulp.src('app/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('app/css'));
});
gulp.task("watch",["less"], function () {
    gulp.watch('app/css/*.less', ['less']);
});

gulp.task("clean", function (done) {
  var del = require('del');
  del([tempPath, serverPath, deployPath], done);
});
gulp.task("htmlCache", function () {
  return gulp.src(templateSrc).
    pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    })).pipe($.angularTemplatecache(htmlTemplatecacheJS, {
      module: appName,
      root: "app/html"
    })).pipe(gulp.dest(tempPath));
});

gulp.task("build-inject",['htmlCache','inject'], function () {
  var injectOpts = {
    starttag: "<!-- htmlTemplateCache:js -->",
    ignorePath: tempPath,//important
    addRootSlash: false
  };
  var injectJS = gulp.src(tempPath+htmlTemplatecacheJS,{read:false});
  return gulp.src(serverPath+"index.html")
    .pipe($.inject(injectJS,injectOpts))
    .pipe(gulp.dest(tempPath))
});

gulp.task("inject",['styles'], function () {
  var injectOpts = {
    ignorePath: ["app","develop"],
    addRootSlash: false
  };
  var injectJs = gulp.src([jsSrc]).pipe($.angularFilesort()).on("error", function () {
    this.emit("end");
  });
  var injectCss = gulp.src([serverPath+"/bower.css",cssSrc],{read: false});
  return gulp.src(indexHTML)
    .pipe($.inject(injectJs, injectOpts)).on("error", function () {
      this.emit("end");
    })
    .pipe($.inject(injectCss, injectOpts))
    .pipe(wiredep(wireDepOpt))
    .pipe(gulp.dest(serverPath))
});

gulp.task("build-image", function () {
  return gulp.src("app/img/**/*").
    pipe(gulp.dest(deployPath+"/img"));
});
gulp.task("build-i18n", function () {
    return gulp.src("app/i18n/*").
        pipe(gulp.dest(deployPath+"/i18n"));
});
gulp.task("build-data", function () {
    return gulp.src("app/data/*").
        pipe(gulp.dest(deployPath+"/data"));
});

gulp.task("build",['less',"build-inject",'build-image','build-i18n','build-data'], function () {
  var assets = $.useref.assets();
  var htmlFilter = $.filter("*.html");
  var jsFilter = $.filter("**/*.js");
  var cssFilter = $.filter("**/*.css");

  gulp.src(tempPath+"index.html")
    .pipe(assets)
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: require("uglify-save-license")}))
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
         empty: true,
         spare: true,
         conditionals: true
     }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(deployPath))
    .pipe($.size({title: deployPath,showFiles: true}))
});
gulp.task("serve",['watch','inject'], function () {
  var browser = "default";
  var browserSync = require("browser-sync");
  var browserSyncSpa = require("browser-sync-spa");
  var server = {
    baseDir: [serverPath,"app",""],
    routes: {
      "/bower_component": "bower_component"
    }
  };
  browserSync.instance = browserSync.init({
    startPath: "/",
    server: server,
    browser: browser
  });
  browserSync.use(browserSyncSpa({
    selector: "[ng-app]"
  }));
});

gulp.task("serve:dist",["build"], function () {
  var browser = "default";
  var browserSync = require("browser-sync");
  var browserSyncSpa = require("browser-sync-spa");
  var server = {
    baseDir: [deployPath],
    routes: {
      "/bower_component": "bower_component"
    }
  };
  browserSync.instance = browserSync.init({
    startPath: "/",
    server: server,
    browser: browser
  });
  browserSync.use(browserSyncSpa({
    selector: "[ng-app]"
  }));
});

gulp.task("styles", function () {
  var lessOptions = {
    options:['bower_components']
  };
  return gulp.src("app/styles/bower.less")
    .pipe(wiredep(wireDepOpt))
    .pipe($.sourcemaps.init())
    .pipe($.less(lessOptions))
    .pipe($.sourcemaps.write())
    .pipe($.autoprefixer())
    .pipe(gulp.dest(serverPath))
});
gulp.task("default",function () {
  gulp.start("build");
});
