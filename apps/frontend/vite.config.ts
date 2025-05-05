import path from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import react from '@vitejs/plugin-react-swc';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const PORT = 3000;

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          // Copies the worker from monorepo root node_modules to your build output
          src: path.resolve(__dirname, '../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs'),
          dest: '.', // Final path: dist/public/pdf.worker.min.mjs
        },
      ],
    }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  build: {
    outDir: '../backend/dist/public', // Where Vite builds to (public assets for Express)
  },
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.resolve(__dirname, '../../node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.resolve(__dirname, 'src$1'),
      },
    ],
  },
  server: {
    port: PORT,
    host: true,
  },
  preview: {
    port: PORT,
    host: true,
  },
});
