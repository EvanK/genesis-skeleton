module.exports = function(grunt) {

  /**
   * Dependencies
   */

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-smushit');

  /**
   * Tasks
   */

  grunt.registerTask('default',         ['less', 'concat', 'copy']);
  grunt.registerTask('build',           ['clean','default', 'minify']);
  grunt.registerTask('minify',          ['cssmin', 'uglify', 'smushit'])
  grunt.registerTask('server',          ['default', 'express-server', 'reload', 'open', 'watch']);

  grunt.registerTask('express-server',  'Start an express web server', function() {
    process.env.PORT = grunt.config.get('server.port');

    return require(grunt.config.get('dirs.server') + '/app');
  });

  /**
   * Configuration
   */

  grunt.config.init({

    // Constants
    dirs: {
      client    : './src/client/',
      lib       : './components/',
      server    : './src/server/',
      web       : './public/',
      build     : './public/build/'
    },

    files: {
      img       : 'img/**/*',
      js        : 'js/**/*.js',
      less      : 'less/**/*.less',
      views     : 'views/**/*'
    },

    // Common
    pkg         : grunt.file.readJSON('package.json'),
    meta        : {
      banner    : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - '                   +
                  '<%= grunt.template.today("yyyy-mm-dd") %>\\n'                                 +
                  '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>'                       +
                  '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                  ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    clean:      {
      build:    '<%= dirs.build %>'
    },
    watch:      {
      all:      {
        files   : ['<%= dirs.server + files.views %>'
                  ,'<%= dirs.server + files.js %>'
                  ,'<%= dirs.client + files.js %>'
                  ,'<%= dirs.client + files.less %>'],
        tasks   : ['default', 'reload'],
        options : { interrupt: true }
      }
    },

    // Compilation
    less:       {
      app:      {
        src     : ['<%= dirs.lib %>/github-fork-ribbon-css/gh-fork-ribbon.css'
                  ,'<%= dirs.client + files.less %>'],
        dest    : '<%= dirs.build %>css/<%= pkg.name %>.css'
      }
    },

    // Concatenation
    copy:       {
      app:      {
        options : {
          cwd   : '<%= dirs.client %>'
        },
        files   : { '<%= dirs.build %>img/': '<%= dirs.client + files.img %>' }
      },
      lib:      {
        options : {
          cwd   : '<%= dirs.client %>'
        },
        files   : { '<%= dirs.build %>img/': '<%= dirs.lib %>/bootstrap/<%= files.img %>' }
      }
    },
    concat:     {
      options:  {
        banner  : '<%= meta.banner %>'
      },
      all:      {
        src     : ['<%= dirs.lib %>/angular-1.0.3/angular.js'
                  ,'<%= dirs.lib %>/angular-1.0.3/angular-resource.js'
                  ,'<%= dirs.client + files.js %>'],
        dest    : '<%= dirs.build %>/js/<%= pkg.name %>.js'
      }
    },

    // Minification
    cssmin:     {
      options:  {
        banner  : '<%= meta.banner %>',
      },
      all:      {
        src     : '<%= less.app.dest %>',
        dest    : '<%= dirs.build %>/css/<%= pkg.name %>.min.css'
      }
    },
    smushit:    {
      all:      {
        src     : '<%= dirs.build %>/img'
      }
    },
    uglify:     {
      options:  {
        banner  : '<%= meta.banner %>'
      },
      app:      {
        src     : ['<%= concat.all.dest %>'],
        dest    : '<%= dirs.build %>/js/<%= pkg.name %>.min.js'
      }
    },

    // Live-Reload Reverse-Proxy Server
    open:       {
      dev:      {
        url     : 'http://localhost:8000/'
      }
    },
    reload:     {
      port      : 8000,         // Browser-targeted port

      proxy:    {
        host    : 'localhost',  // Viewing port
        port    : 8001          // Source port
      }
    },
    server:     {
      port      : 8001          // Source port
    }

  });

};