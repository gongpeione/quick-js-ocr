import typescript from 'rollup-plugin-typescript2';
import sass from 'rollup-plugin-sass';
import uglify from 'rollup-plugin-uglify';

export default {
    input: './example/example.ts',
    output: {
        name: 'JsOCR',
        file: './example/example.js',
        format: 'umd',
        globals: {
            vue: 'Vue'
        }
    },
    plugins: [
        sass({ output: 'example/example.css' }),
        typescript(),
        uglify()
    ]
}