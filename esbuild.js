
import esbuild from 'esbuild';


esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  sourcemap: true,
  minify: false,
  target: ['esnext'],
  format: 'esm' // Assicurati di usare il formato corretto
}).catch(() => process.exit(1));