import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';

const srcPath = './src/jsocr.ts';
const name = 'JsOCR';

export default [{
	input: srcPath,
	output: {
		name: name,
		file: './dist/jsocr.js',
		format: 'umd'
	},
	plugins: [
        typescript()
	]
},{
	input: srcPath,
	output: {
		name: name,
		file: './dist/jsocr.min.js',
		format: 'umd'
	},
	plugins: [
        typescript(),
        uglify()
	]
}]