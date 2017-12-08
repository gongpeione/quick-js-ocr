import typescript from 'rollup-plugin-typescript2';
import sass from 'rollup-plugin-sass';
import uglify from 'rollup-plugin-uglify';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

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
        sass({
            output: 'example/example.css',
            processor: css => {
                return postcss([autoprefixer, cssnano])
                        .process(css)
                        .then(result => result.css)
            }
        }),
        typescript(),
        uglify()
    ]
}