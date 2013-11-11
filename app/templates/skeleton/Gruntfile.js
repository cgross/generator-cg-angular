'use strict';
var path = require('path');

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function (grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    connect: {
      main: {
        options: {
          port: 9001,
          middleware: function(connect, options) {
            return [folderMount(connect, options.base)]
          }
        }
      }
    },
    watch: {
      main: {
        options: {
            livereload: true
        },
        files: ['js/**/*','css/**/*','img/**/*','partial/**/*','service/**/*','filter/**/*','directive/**/*','index.html'],
        tasks: ['jshint']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['js/**/*.js','partial/**/*.js','service/**/*.js','filter/**/*.js','directive/**/*.js']
    },
    clean: {
      before:{
        src:['dist','temp']
      },
      after: {
        src:['temp']
      }
    },
    less: {
      production: {
        options: {
        },
        files: {
          "temp/app.css": "css/app.less"
        }
      }
    },
    ngtemplates: {
      main: {
        options: {
            module:'<%= _.slugify(appname) %>',
            htmlmin: {
              collapseBooleanAttributes: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true,
              removeComments: true,
              removeEmptyAttributes: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true
            }
        },
        src: [ 'partial/**/*.html','directive/**/*.html' ],
        dest: 'temp/templates.js'
      }
    },
    copy: {
      main: {
        files: [
          {src: ['index.html'], dest: 'dist/'},
          {src: ['img/**'], dest: 'dist/'},
          {src: ['bower_components/angular-ui-utils/ui-utils-ieshiv.min.js'], dest: 'dist/'},
          {src: ['bower_components/font-awesome/fonts/**'], dest: 'dist/',filter:'isFile',expand:true}
          // {src: ['bower_components/select2/*.png','bower_components/select2/*.gif'], dest:'dist/css/',flatten:true,expand:true},
          // {src: ['bower_components/angular-mocks/angular-mocks.js'], dest: 'dist/'}
        ]
      }
    },
    dom_munger:{
      readscripts: {
        options: {
          read:{selector:'script[data-build!="exclude"]',attribute:'src',writeto:'appjs'}
        },
        src:'index.html'
      },
      readcss: {
        options: {
          read:{selector:'link[rel="stylesheet"]',attribute:'href',writeto:'appcss'}
        },
        src:'index.html'
      },
      removescripts: {
        options:{
          remove:'script[data-remove!="exclude"]',
          append:{selector:'head',html:'<script src="app.full.min.js"></script>'}
        },
        src:'dist/index.html'
      },
      addscript: {
        options:{
          append:{selector:'body',html:'<script src="app.full.min.js"></script>'}
        },
        src:'dist/index.html'
      },
      removecss: {
        options:{
          remove:'link',
          append:{selector:'head',html:'<link rel="stylesheet" href="css/app.full.min.css">'}
        },
        src:'dist/index.html'
      },
      addcss: {
        options:{
          append:{selector:'head',html:'<link rel="stylesheet" href="css/app.full.min.css">'}
        },
        src:'dist/index.html'
      }
    },
    cssmin: {
      main: {
        src:['temp/app.css','<%%= dom_munger.data.appcss %>'],
        dest:'dist/css/app.full.min.css'
      }
    },
    concat: {
      main: {
        src: ['<%%= dom_munger.data.appjs %>','<%%= ngtemplates.main.dest %>'],
        dest: 'temp/app.full.js'
      }
    },
    ngmin: {
      main: {
        src:'temp/app.full.js',
        dest: 'temp/app.full.js'
      }
    },
    uglify: {
      main: {
        src: 'temp/app.full.js',
        dest:'dist/app.full.min.js'
      }
    },
    htmlmin: {
      main: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        files: {
          'dist/index.html': 'dist/index.html'
        }
      }
    },
    imagemin: {
      main:{
        files: [{
          expand: true, cwd:'dist/',
          src:['**/{*.png,*.jpg}'],
          dest: 'dist/'
        }]
      }
    },
    jasmine: {
      unit: {
        src: ['<%%= dom_munger.data.appjs %>','bower_components/angular-mocks/angular-mocks.js'],
        options: {
          specs: 'test/unit/**/*.js'
        }
      }
    }
  });

  grunt.registerTask('build',['jshint','clean:before','less','dom_munger:readcss','dom_munger:readscripts','ngtemplates','cssmin','concat','ngmin','uglify','copy','dom_munger:removecss','dom_munger:addcss','dom_munger:removescripts','dom_munger:addscript','htmlmin','imagemin','clean:after']);
  grunt.registerTask('server', ['jshint','connect', 'watch']);
  grunt.registerTask('test',['dom_munger:readscripts','jasmine'])
};
