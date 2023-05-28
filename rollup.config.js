// rollup.config.js
import clear from 'rollup-plugin-clear'

export default {
	input: 'src/app.js',
    plugins: [
        clear({
            targets: ['mysite/music_training/static/js/']
        })
    ],
	output: {
        dir: 'mysite/src',
		file: 'app.js',
		format: 'iife'
	},
    watch: {
        include: 'src/app.js'
    }
};