// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import obfuscator from 'rollup-plugin-obfuscator';

export default {
	input: 'src/app.js',
	output: {
		file: 'mysite/music_training/static/js/app.js',
		format: 'iife',
		assetFileNames: 'assets/../../css/animate.css'
	},
	plugins: 
	[
		resolve(), css({output: "animate.css"}),
		obfuscator({
			options: {
				splitStrings: false,
    			splitStringsChunkLength: 10
			},
		}),
	],
	watch: {
		input: 'src/**/*'
	},
};