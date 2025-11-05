import { defineConfig } from 'vite';
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      lib: {
        entry: resolve(__dirname, 'src/js/aos.js'),
        name: 'AOS',
        formats: ['es', 'cjs', 'umd'],
        fileName: (format) => {
          if (format === 'umd') return 'aos.js';
          if (format === 'cjs') return 'aos.cjs.js';
          if (format === 'es') return 'aos.esm.js';
        }
      },
      rollupOptions: {
        external: (id) => {
          // For UMD builds, bundle everything
          // For CJS/ESM, externalize lodash and classlist-polyfill
          if (id.includes('lodash') || id === 'classlist-polyfill') {
            // These will be bundled in UMD, external in CJS/ESM
            // Vite handles this automatically per format
            return false;
          }
          return false;
        },
        output: {
          assetFileNames: 'aos.css',
        }
      },
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: false,
          drop_debugger: true
        }
      } : undefined
    },

    css: {
      postcss: {
        plugins: isProduction ? [
          autoprefixer(),
          cssnano({
            preset: 'default'
          })
        ] : [autoprefixer()]
      },
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },

    server: {
      open: '/demo/index.html',
      port: 8080
    },

    publicDir: false
  };
});
