# gulp-jade-filter

This plugin help you to reduce jade compilation time.

##Instalation
```
npm i gulp-jade-filter
```

For example, i have ```app/jade``` directory, where i create main templates like ```home.jade, about.jade, contacts.jade``` etc.

###File tree example:
```js
common/
--vars.pug
--mixins.pug
templates/
--header.pug
--footer.pug
home.jade
about.jade
```

###Gulp task example:
```js
var jade = require('gulp-pug');
var jadeFilter = require("gulp-jade-filter")

gulp.task('jade', function () {
  return gulp.src('app/jade/**/*.{jade,pug}')
  .pipe(jadeFilter{ match: "*.jade" })
  .pipe(jade())
  .pipe(gulp.dest('dist/'))
});
```


##Api
###option.match:
This is minimatch option that relative to gulp.src directory.

>default: ``*.jade``

###option.ext:
This option used for including file.

>default: ``pug``

