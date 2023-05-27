module.exports = function(grunt) {

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
        uglify: {
            app: {
                files: {
                    'mysite/music_training/static/js/components/generator.min.js': ['src/components/generator.js'],
                    'mysite/music_training/static/js/components/input.min.js': ['src/components/input.js'],
                    'mysite/music_training/static/js/components/test.min.js': ['src/components/test.js'],
                    'mysite/music_training/static/js/constants/songs.min.js': ['src/constants/songs.js'],
                    'mysite/music_training/static/js/app.min.js': ['src/app.js']
                }
            }
        },
        watch: {
            options: {livereload: true},
            javascript: {
                files: ['src/**/*.js'],
                tasks: ['uglify']
            }
        },
        copy: {
            files: {
              cwd: 'src/',                                  // set working folder / root to copy
              src: '**/*',                                  // copy all files and subfolders
              dest: 'mysite/music_training/static/js/',     // destination folder
              expand: true                                  // required when using cwd
            }
        },
        clean: {
            files: {
                src: ["mysite/music_training/static/js/**/*"]
            }
        }
});

  // Load plugins here.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  
  // Register tasks here.
  grunt.registerTask('default', ['copy', 'watch']);
  grunt.registerTask('dev', ['copy', 'watch']);
  grunt.registerTask('publish', ['uglify', 'watch'])

};