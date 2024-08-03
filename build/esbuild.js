
import esbuild from 'esbuild';


esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  sourcemap: true,
  minify: false,
  target: ['esnext']
}).catch(() => process.exit(1));