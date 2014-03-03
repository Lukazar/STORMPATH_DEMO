'use strict';
module.exports = function(grunt) {

  // Project configuration.
  grunt
          .initConfig({
            pkg: grunt.file.readJSON('server/package.json'),
            minSuffix: 'min',
            distName: 'spdemo',
            meta: {
              version: '<%= pkg.version %>',
              banner: '/*! spdemo.js - v<%= meta.version %> - '
                      + '<%= grunt.template.today("yyyy-mm-dd") %>\n'                      
                      + '* Copyright (c) <%= grunt.template.today("yyyy") %> '
                      + 'Luke Jones; Licensed MIT */\n',

            },
            clean: {
              files: ['dist', 'dist/plugins', 'dist/css', '!dist/css/images'],
            },
            concat: {
              templateDist: {
                options: {
                  banner: '<%= meta.banner %>',
                  stripBanners: true
                },
                files: {
                  'dist/<%= distName %>.js': ['js/core.js',
                      'js/app/controllers/*.js', 'js/app/models/*.js',
                      'js/app/collections/*.js', 'js/app/views/**/*.js',
                      'js/app/app.js', 'js/app/helpers/*.js'],
                  'dist/plugins/libs.js': ['js/plugins/jquery/*.js',
                      'js/plugins/backbone/underscore*.js',
                      'js/plugins/backbone/backbone*.js',
                      'js/plugins/handlebars/*.js',
                      'js/plugins/async/*.js'],
                  'dist/css/main.css': ['css/main.css']
                }
              }
            },
            uglify: {
              target: {
                options: {
                  banner: '<%= meta.banner %>'
                },
                files: {
                  'dist/<%= distName %>.<%= minSuffix %>.js': ['dist/<%= distName %>.js'],
                }
              },
            },
            symlink: {
              explicit: {
                files: [{
                  src: 'images',
                  dest: 'dist/images'
                }, {
                  src: 'images',
                  dest: 'dist/css/images'
                }]
              }
            }           
          });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // Default task.
  grunt.registerTask('default', ['clean', 'concat', 'uglify', 'symlink']);

};
