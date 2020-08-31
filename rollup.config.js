import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-cpy'
import { terser } from "rollup-plugin-terser";

export default {
  input: 'demo/src/index.js',
  output: [
        {
        file: 'dist/bundle.js',
        format: 'umd'
      },
      {
        file: 'dist/bundle.min.js',
        format: 'umd',
        sourcemap: true,
        plugins: [terser()]
      }
  ],
  plugins: [
    resolve(),
    babel({
        exclude: 'node_modules/**' 
      }),
    commonjs(),
    replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
    copy({
        files: ['demo/*.html', 'demo/favicon.ico'],
        dest: 'dist',
        options: {
          verbose: true,
        }
      }),
  ],
};