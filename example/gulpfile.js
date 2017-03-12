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
    $.jadeFilter({ match: "*.jade" }),  //default=> "*.jade" (relative to gulp.src) 
    $.debug(),
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