/*jshint node: true, strict: false */

// -------------------------- grunt -------------------------- //

module.exports = function( grunt ) {

  var banner = ( function() {
    var src = grunt.file.read('js/packery.js');
    var re = new RegExp('^\\s*(?:\\/\\*[\\s\\S]*?\\*\\/)\\s*');
    var matches = src.match( re );
    var banner = matches[0].replace( 'Packery', 'Packery PACKAGED' );
    return banner;
  })();

  grunt.initConfig({

    // ----- tasks settings ----- //

    jshint: {
      docs: [ 'js/**/*.js'  ],
      options: grunt.file.readJSON('.jshintrc')
    },

    requirejs: {
      pkgd: {
        options: {
          baseUrl: 'bower_components',
          include: [
            'jquery-bridget/jquery.bridget',
            'packery/js/packery'
          ],
          out: 'dist/packery.pkgd.js',
          optimize: 'none',
          paths: {
            packery: '../',
            jquery: 'empty:'
          },
          wrap: {
            start: banner
          }
        }
      }
    },

    uglify: {
      pkgd: {
        files: {
          'dist/packery.pkgd.min.js': [ 'dist/packery.pkgd.js' ]
        },
        options: {
          banner: banner
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-requirejs');

  grunt.registerTask( 'pkgd-edit', function() {
    var outFile = grunt.config.get('requirejs.pkgd.options.out');
    var contents = grunt.file.read( outFile );
    // get requireJS definition code
    var definitionRE = /define\(\s*'packery\/js\/packery'(.|\n)+factory\s*\)/;
    var definition = contents.match( definitionRE )[0];
    // remove name module
    var fixDefinition = definition.replace( "'packery/js/packery',", '' )
      // ./item -> packery/js/item
      .replace( /'.\//g, "'packery/js/" );
    contents = contents.replace( definition, fixDefinition );
    grunt.file.write( outFile, contents );
    grunt.log.writeln( 'Edited ' + outFile );
  });

  grunt.registerTask( 'default', [
    'jshint',
    'requirejs',
    'pkgd-edit',
    'uglify'
  ]);

};
