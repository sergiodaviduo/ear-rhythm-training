module.exports = function(grunt) {

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
        concat: {
            app: {
                src: ['mysite/music_training/static/js/src/**/*.js'],
                dest: 'mysite/music_training/static/js/main.js'
            }
        },
        uglify: {
            app: {
                files: {'mysite/music_training/static/js/app.min.js': ['mysite/music_training/static/js/src/**/*.js']}
            }
        },
        watch: {
            options: {livereload: true},
            javascript: {
                files: ['mysite/music_training/static/js/src/**/*.js'],
                tasks: ['concat', 'uglify']
            }
        }
});

  // Load plugins here.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Register tasks here.
  grunt.registerTask('default', ['uglify', 'watch']);

};