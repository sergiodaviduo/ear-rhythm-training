// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';

export default {
	input: 'src/app.js',
	output: {
		file: 'mysite/music_training/static/js/app.js',
		format: 'iife',
		assetFileNames: 'assets/../../css/animate.css'
	},
	plugins: [resolve(), css({output: "animate.css"}),],
    watch: {
        input: 'src/**/*'
    }
};