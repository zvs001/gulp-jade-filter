# gulp-jade-filter

This plugin help you to reduce jade compilation time.

##Install
```
npm i gulp-jade-filter --save-dev
```
On first run this plugin create jade inheritance tree. Each other run plugin check all files and push only modificated files. If it is child, plugin push his parent file. But you should select glob for parent files.

For example, i have ```app/jade``` directory, where i create main templates like ```home.jade, about.jade, contacts.jade``` etc.

###File tree example:
```js
common/
  vars.pug
  mixins.pug
templates/
  header.pug
  footer.pug
home.jade
about.jade
```

###Gulp task example:
```js
var jade = require('gulp-pug');
var jadeFilter = require("gulp-jade-filter")

gulp.task('jade', function () {
  return gulp.src('app/jade/**/*.{jade,pug}')
  .pipe( jadeFilter({ match: "*.jade" }))
  .pipe(jade())
  .pipe(gulp.dest('dist/'))
});
```

###Full composition (gulp#4) 
```js
'use strict';
 
const $ = require('gulp-load-plugins')({
    rename: {
    'jade-filter': 'jadeFilter'
  }
});
 
const gulp = require('gulp');
const combine = require('stream-combiner2').obj
 
gulp.task('jade', function () {
  return combine(
    gulp.src( 'dev/jade/**/*.{jade,pug}' ), //[!important] all jade/pug files you have 
    $.jadeFilter({ match: "*.pug" }),  //default=> "*.jade" (relative to gulp.src) 
    $.pug({
      pretty: true
    }),
    gulp.dest( 'app/' )
  ).on("error", $.notify.onError())
});
 
 
gulp.task("jade:watch", function(){
    gulp.watch( 'dev/jade/**/*.{jade,pug}', gulp.series('jade') );//all jade/pug files you have 
});
 
gulp.task('default', gulp.series('jade', 'jade:watch'));
```

##Api
###option.match:
This is minimatch option that relative to gulp.src directory.

>default: ``*.jade``

###option.ext:
This option used for including file.

>default: ``pug``

