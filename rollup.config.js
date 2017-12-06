import typescript from 'rollup-plugin-typescript2';

export default {
	input: './src/jsocr.ts',
	output: {
		name: 'JsOCR',
		file: './dist/jsocr.js',
		format: 'umd'
	},
	plugins: [
        typescript()
	]
}