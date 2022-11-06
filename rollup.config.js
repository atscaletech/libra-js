import ts from '@rollup/plugin-typescript';
// import nodePolyfills from 'rollup-plugin-node-polyfills';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import { babel } from '@rollup/plugin-babel';

const production = !process.env.ROLLUP_WATCH;

const outputFileName = 'libra';

const plugins = [
  json(),
  ts({
    tsconfig: `tsconfig.json`,
  }),
  resolve({ preferBuiltins: false, browser: true }),
  babel({
    babelHelpers: 'runtime',
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  }),
  commonjs(),
  production && terser(),
];

const input = `lib/index.ts`;

export default [
  // Browser UMD bundle for CDN
  {
    input,
    output: [{ name: 'libra', file: `dist/${outputFileName}.umd.js`, format: 'umd' }],
    plugins,
  },
  // For modules
  {
    input,
    output: [
      { file: `dist/${outputFileName}.js`, format: 'cjs' },
      { file: `dist/${outputFileName}.esm.js`, format: 'es' },
    ],
    plugins,
  },
];
