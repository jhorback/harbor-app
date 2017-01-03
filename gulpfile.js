
var buildDir = 'build/testbuild-bundled-with-shell';

var PolymerProject = require('polymer-build').PolymerProject;
var gulp = require('gulp');
var mergeStream = require('merge-stream');
var del = require("del");
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var cssSlam = require('css-slam').gulp;
var htmlMinifier = require('gulp-html-minifier');



var project = new PolymerProject({
  entrypoint: 'src/index.html',
  shell: 'src/harbor-elements/harbor-app/harbor-app.html',
  "sourceGlobs": [
    "src/**/*"   
  ],
//   fragments: [
//     'src/my-view1.html',
//     'src/my-view2.html',
//     'src/my-view3.html'
//   ]
"includeDependencies": [
    "bower_components/webcomponentsjs/webcomponents-lite.js"
  ]
});



gulp.task("clean", function () {
    del(buildDir);
});


gulp.task("build", function () {
   
   var sourcesStream = project.sources()
        .pipe(project.splitHtml())
        .pipe(gulpif(/\.js$/, uglify()))
        .pipe(gulpif(/\.css$/, cssSlam()))
        .pipe(gulpif(/\.html$/, htmlMinifier()))
        .pipe(project.rejoinHtml());

    // Create a build pipeline to write our dependencies & optimized sources streams to the 'build/' dir
    // (not shown: project.dependencies() can also be split & optimized)
    mergeStream(sourcesStream, project.dependencies())
        .pipe(project.bundler)
        .pipe(gulp.dest(buildDir));
});


