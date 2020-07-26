import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
import { terser } from 'rollup-plugin-terser';

const packageJson = require('./package.json');
const name = packageJson.name
  .replace('-', '')
  .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return '';
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
const input = 'src/index.ts';
const minifyExtension = (pathToFile) => pathToFile.replace(/\.js$/, '.min.js');

export default [
  // CommonJS
  {
    input,
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true })
    ]
  },
  {
    input,
    output: {
      file: minifyExtension(packageJson.main),
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true }),
      uglify()
    ]
  },
  // UMD
  {
    input,
    output: {
      file: packageJson.browser,
      format: 'umd',
      sourcemap: true,
      name,
      globals: {
        react: 'React'
      }
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true })
    ]
  },
  {
    input,
    output: {
      file: minifyExtension(packageJson.browser),
      format: 'umd',
      sourcemap: true,
      name,
      globals: {
        react: 'React'
      }
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true }),
      terser()
    ]
  },
  // ES
  {
    input,
    output: {
      file: packageJson.module,
      format: 'es',
      exports: 'named',
      sourcemap: true
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true })
    ]
  },
  {
    input,
    output: {
      file: minifyExtension(packageJson.module),
      format: 'es',
      exports: 'named',
      sourcemap: true
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true }),
      terser()
    ]
  }
];
