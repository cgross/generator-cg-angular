'use strict';
var path = require('path');

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function (grunt) {
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
        files: ['js/**/*','css/**/*','img/**/*','lib/**/*','partial/**/*','service/**/*','filter/**/*','directive/**/*','index.html'],
        tasks: ['jshint']
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        smarttabs: true,
        globals: {
          jQuery: true,
          angular: true,
          console: true,
          $: true,
          _: true,
          moment: true
        }
      },
      files: ['js/**/*.js','partial/**/*.js','service/**/*.js','filter/**/*.js','directive/**/*.js']
    },
    clean: {
      before:{
        src:['bin','temp']
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
            module:'<%= _.slugify(appname) %>'
        },
        src: [ 'partial/**/*.html','directive/**/*.html' ],
        dest: 'temp/templates.js'
      }
    },
    copy: {
      main: {
        files: [
          {src: ['index.html'], dest: 'bin/'},
          {src: ['img/**'], dest: 'bin/'},
          {src: ['lib/angular-ui/build/angular-ui-ieshiv.js'], dest: 'bin/'},
          {src: ['lib/font-awesome/build/assets/font-awesome/font/**'], dest: 'bin/',filter:'isFile',expand:true},
          // {src: ['lib/select2/*.png','lib/select2/*.gif'], dest:'bin/css/',flatten:true,expand:true},
          {src: ['lib/angular-mocks/angular-mocks.js'], dest: 'bin/'}
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
        src:'bin/index.html'
      }, 
      addscript: {
        options:{
          append:{selector:'body',html:'<script src="app.full.min.js"></script>'}
        },
        src:'bin/index.html'
      },       
      removecss: {
        options:{
          remove:'link',
          append:{selector:'head',html:'<link rel="stylesheet" href="css/app.full.min.css">'}
        },
        src:'bin/index.html'
      },
      addcss: {
        options:{
          append:{selector:'head',html:'<link rel="stylesheet" href="css/app.full.min.css">'}
        },
        src:'bin/index.html'
      }      
    },
    cssmin: {
      main: {
        src:['temp/app.css','<%%= dom_munger.data.appcss %>'],
        dest:'bin/css/app.full.min.css'
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
        dest:'bin/app.full.min.js'
      }
    },
    htmlmin: {
      main: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'bin/index.html': 'bin/index.html'
        }
      }
    },
    imagemin: {
      main:{
        files: [{
          expand: true, cwd:'bin/',
          src:['**/{*.png,*.jpg}'],
          dest: 'bin/'
        }]
      }
    },
    jasmine: {
      unit: {
        src: ['<%%= dom_munger.data.appjs %>','lib/angular-mocks/angular-mocks.js'],
        options: {
          specs: 'test/unit/**/*.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-dom-munger');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build',['jshint','clean:before','less','dom_munger:readcss','dom_munger:readscripts','ngtemplates','cssmin','concat','ngmin','uglify','copy','dom_munger:removecss','dom_munger:addcss','dom_munger:removescripts','dom_munger:addscript','htmlmin','imagemin','clean:after']);
  grunt.registerTask('server', ['jshint','connect', 'watch']);
  grunt.registerTask('test',['dom_munger:readscripts','jasmine'])
};
