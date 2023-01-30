import typescript from '@rollup/plugin-typescript';
import inject from '@rollup/plugin-inject';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { uglify } from 'rollup-plugin-uglify';
import css from 'rollup-plugin-import-css';
import { swc, defineRollupSwcOption } from 'rollup-plugin-swc3';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import path from 'path';

const devPlugins =
  process.env.ENVIRONMENT === 'DEV'
    ? [
        serve({
          contentBase: 'dist',
          open: true
        }),
        livereload()
      ]
    : [uglify()];

export default {
  input: ['./src/index.tsx'],
  output: {
    format: 'iife',
    dir: 'dist',
    globals: {
      ['./src/Jsx/pragma.ts']: 'jsxPragma',
      ['./src/Jsx/frag.ts']: 'jsxFrag'
    }
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    css(),
    typescript({
      target: 'es2015',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      module: 'esnext',
      moduleResolution: 'node',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve'
    }),
    swc(
      defineRollupSwcOption({
        module: {
          type: 'nodenext'
        },
        jsc: {
          transform: {
            react: {
              pragma: 'jsxPragma',
              pragmaFrag: 'jsxFrag'
            }
          }
        }
      })
    ),
    inject({
      jsxPragma: path.resolve(__dirname, 'src/Jsx/pragma.ts'),
      jsxFrag: path.resolve(__dirname, 'src/Jsx/frag.ts')
    }),

    ...devPlugins
  ]
};
