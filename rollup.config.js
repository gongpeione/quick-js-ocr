import typescript from 'rollup-plugin-typescript2';

export default {
	input: './jsocr.ts',
	output: {
		name: 'JsOCR',
		file: './jsocr.js',
		format: 'umd'
	},
	plugins: [
        typescript()
	]
}