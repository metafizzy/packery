/*jshint node: true, strict: false */

var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

// ----- hint ----- //

var jshint = require('gulp-jshint');

gulp.task( 'hint-js', function() {
  return gulp.src('js/*.js')
    .pipe( jshint() )
    .pipe( jshint.reporter('default') );
});

gulp.task( 'hint-test', function() {
  return gulp.src('test/unit/*.js')
    .pipe( jshint() )
    .pipe( jshint.reporter('default') );
});

gulp.task( 'hint-task', function() {
  return gulp.src('gulpfile.js')
    .pipe( jshint() )
    .pipe( jshint.reporter('default') );
});

var jsonlint = require('gulp-json-lint');

gulp.task( 'jsonlint', function() {
  return gulp.src( '*.json' )
    .pipe( jsonlint() )
    .pipe( jsonlint.report('verbose') );
});

gulp.task( 'hint', [ 'hint-js', 'hint-test', 'hint-task', 'jsonlint' ]);

// -------------------------- make pkgd -------------------------- //

// regex for banner comment
var reBannerComment = new RegExp('^\\s*(?:\\/\\*[\\s\\S]*?\\*\\/)\\s*');

function getBanner() {
  var src = fs.readFileSync( 'js/packery.js', 'utf8' );
  var matches = src.match( reBannerComment );
  var banner = matches[0].replace( 'Packery', 'Packery PACKAGED' );
  return banner;
}

function addBanner( str ) {
  return replace( /^/, str );
}

var rjsOptimize = require('gulp-requirejs-optimize');

gulp.task( 'requirejs', function() {
  var definitionRE = /define\(\s*'packery\/packery'(.|\n)+factory\s*\)/;
  var banner = getBanner();
  // HACK src is not needed
  // should refactor rjsOptimize to produce src
  return gulp.src('js/packery.js')
    .pipe( rjsOptimize({
      baseUrl: 'bower_components',
      optimize: 'none',
      include: [
        'jquery-bridget/jquery-bridget',
        'packery/packery'
      ],
      paths: {
        packery: '../js/',
        jquery: 'empty:'
      }
    }) )
    // munge AMD definition
    .pipe( replace( definitionRE, function( definition ) {
      // remove named module
      return definition.replace( "'packery/packery',", '' )
        // use explicit file paths, './rect' -> 'packery/rect'
        .replace( /'.\//g, "'packery/js/" );
    }) )
    .pipe( replace( "define( 'packery/", "define( 'packery/js/" ) )
    // add banner
    .pipe( addBanner( banner ) )
    .pipe( rename('packery.pkgd.js') )
    .pipe( gulp.dest('dist') );
});


// ----- uglify ----- //

var uglify = require('gulp-uglify');

gulp.task( 'uglify', [ 'requirejs' ], function() {
  var banner = getBanner();
  gulp.src('dist/packery.pkgd.js')
    .pipe( uglify() )
    // add banner
    .pipe( addBanner( banner ) )
    .pipe( rename('packery.pkgd.min.js') )
    .pipe( gulp.dest('dist') );
});

// ----- version ----- //

// set version in source files

var minimist = require('minimist');
var gutil = require('gulp-util');
var chalk = require('chalk');

// use gulp version -t 1.2.3
gulp.task( 'version', function() {
  var args = minimist( process.argv.slice(3) );
  var version = args.t;
  if ( !version || !/^\d\.\d+\.\d+/.test( version ) ) {
    gutil.log( 'invalid version: ' + chalk.red( version ) );
    return;
  }
  gutil.log( 'ticking version to ' + chalk.green( version ) );

  gulp.src('js/packery.js')
    .pipe( replace( /Packery v\d\.\d+\.\d+/, 'Packery v' + version ) )
    .pipe( gulp.dest('js') );

  gulp.src( [ 'package.json' ] )
    .pipe( replace( /"version": "\d\.\d+\.\d+"/, '"version": "' + version + '"' ) )
    .pipe( gulp.dest('.') );
  // replace CDN links in README
  var minorVersion = version.match( /^\d\.\d+/ )[0];
  gulp.src('README.md')
    .pipe( replace( /packery@\d\.\d+/g, 'packery@' + minorVersion ))
    .pipe( gulp.dest('.') );
});

// ----- default ----- //

gulp.task( 'default', [
  'hint',
  'uglify'
]);
