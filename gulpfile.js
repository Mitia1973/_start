var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    accord = require('gulp-accord');

var connect = require('gulp-connect');

var gulpif = require('gulp-if'),
    dirSync = require('gulp-dir-sync');

var sprite = require('css-sprite').stream;

var path = {
  jade: ['src/*.jade', '!src/_*.jade'],
  stylus: ['src/css/*.styl', '!src/css/_*.styl'],
  src: ['src/js/**/*', 'src/fonts/**/*', 'src/img/**/*']
};

var opts = {};
opts.filter = '^((?!\.db).)*$';

gulp.task('copy', function(){
     dirSync( 'src/js', 'dest/js' );
     dirSync( 'src/fonts', 'dest/fonts' );
     dirSync( 'src/img', 'dest/img', opts );
});

gulp.task('jade', function(){
  gulp.src(path.jade)
  .pipe(accord('jade', { pretty: true }))
  .on('error', function (error) {
    console.error('error!!!!!' + error);
  })
  .pipe(gulp.dest('dest'))
  .pipe(connect.reload());
});

gulp.task('stylus', function(){
  gulp.src(path.stylus)
  .pipe(sourcemaps.init())
  .pipe(accord('stylus'))
  .on('error', function (error) {
    console.error('error!!!!!' + error);
  })
  .pipe(autoprefixer())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dest/css'))
  .pipe(connect.reload());
});

gulp.task('imagemin', function(){
  gulp.src('src/img/**/*.{gif,jpg,png,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest('dest/img'))
    .pipe(connect.reload());
});


gulp.task('sprites', function () {
  gulp.src('./src/img/png-sprite/*.png')
    .pipe(sprite({
      name: 'pngsprite',
      style: '_sprite.styl',
      cssPath: '../img/',
      processor: 'stylus',
      template: 'stylus.template.mustache',
      margin: 4,
      retina: true,
      orientation: 'binary-tree',
    }))
    .pipe(gulpif('*.png', gulp.dest('./src/img/'), gulp.dest('./src/css/')))
});



gulp.task('server', function() {
  connect.server({
    root: 'dest',
    livereload: true
  });
});


gulp.task('default', ['stylus', 'jade', 'copy', 'server'], function() {
  gulp.watch('src/css/**/*.styl', ['stylus']);
  gulp.watch('src/*.jade', ['jade']);
  gulp.watch(path.src, ['copy']);
});