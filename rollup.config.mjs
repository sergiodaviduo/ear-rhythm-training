// rollup.config.js

export default {
	input: 'src/app.js',
	output: {
		file: 'mysite/music_training/static/js/app.js',
		format: 'iife'
	},
    watch: {
        input: 'src/**/*'
    }
};