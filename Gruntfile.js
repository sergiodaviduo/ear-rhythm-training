module.exports = function(grunt) {

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
        concat: {
            app: {
                src: ['mysite/music_training/static/js/app/*.js', 'mysite/music_training/static/js/generators/*.js'],
                dest: 'mysite/music_training/static/js/main.js'
            }
        },
        uglify: {
            app: {
                files: {'mysite/music_training/static/js/app.min.js': ['mysite/music_training/static/js/app/*.js', 'mysite/music_training/static/js/generators/*.js']}
            }
        },
        watch: {
            options: {livereload: true},
            javascript: {
                files: ['mysite/music_training/static/js/app/*.js'],
                tasks: ['concat']
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