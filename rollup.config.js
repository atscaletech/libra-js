import ts from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from "rollup-plugin-terser";
import json from '@rollup/plugin-json';
import { babel } from '@rollup/plugin-babel';

const PACKAGE_ROOT_PATH = process.cwd()
const { LERNA_PACKAGE_NAME, LERNA_ROOT_PATH } = process.env
const production = !process.env.ROLLUP_WATCH

const output_file = `${LERNA_PACKAGE_NAME}`.replace('@', '').replace('/', '.');

const plugins = [
  json(),
  ts({
    tsconfig: `${LERNA_ROOT_PATH}/tsconfig.json`,
  }),
  resolve(),
  babel({
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  }),
  commonjs(),
  production && terser(),
];

const input = `${PACKAGE_ROOT_PATH}/lib/index.ts`;

export default [
  {
    input,
    output: [
      {file: `dist/${output_file}.js`, format: 'cjs'},
      {file: `dist/${output_file}.esm.js`, format: 'es'},
    ],
    plugins,
  },
  {
    input,
    output: [
      { name: LERNA_PACKAGE_NAME, file: `dist/${output_file}.umd.js`, format: 'umd'},
    ],
    plugins,
  },
  {
    input,
    output: [
      { name: LERNA_PACKAGE_NAME, file: `dist/${output_file}.umd.min.js`, format: 'umd'},
    ],
    plugins,
  },
];