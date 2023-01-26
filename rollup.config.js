import typescript from '@rollup/plugin-typescript';
import inject from '@rollup/plugin-inject';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { uglify } from 'rollup-plugin-uglify';
import css from 'rollup-plugin-import-css';
import { swc, defineRollupSwcOption } from 'rollup-plugin-swc3';
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
    format: 'es',
    dir: 'dist',
    globals: {
      ['./src/Jsx/pragma.ts']: 'jsxPragma',
      ['./src/Jsx/frag.ts']: 'jsxFrag'
    }
  },
  plugins: [
    css(),
    typescript({
      target: 'es5',
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
      outDir: './dist',
      noEmit: true,
      jsx: 'preserve'
    }),
    swc(
      defineRollupSwcOption({
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
