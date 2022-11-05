import ts from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import { babel } from '@rollup/plugin-babel';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

const output_file = 'libra';

const plugins = [
  json(),
  ts({
    tsconfig: `tsconfig.json`,
  }),
  resolve({ preferBuiltins: false }),
  babel({
    babelHelpers: 'runtime',
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  }),
  commonjs(),
  production && terser(),
];

const input = `lib/index.ts`;

export default [
  {
    input,
    output: [
      { file: `dist/${output_file}.js`, format: 'cjs' },
      { file: `dist/${output_file}.esm.js`, format: 'es' },
    ],
    plugins,
  },
  {
    input,
    output: [{ name: 'libra', file: `dist/${output_file}.umd.js`, format: 'umd' }],
    plugins,
  },
  {
    input,
    output: [{ name: 'libra', file: `dist/${output_file}.umd.min.js`, format: 'umd' }],
    plugins,
  },
];
