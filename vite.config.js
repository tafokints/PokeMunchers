import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  base: './',
  server: {
    host: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      'phaser': 'phaser/dist/phaser.js'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  define: {
    'typeof CANVAS_RENDERER': '"true"',
    'typeof WEBGL_RENDERER': '"true"',
    'typeof EXPERIMENTAL': '"false"',
    'typeof PLUGIN_CAMERA3D': '"false"',
    'typeof PLUGIN_FBINSTANT': '"false"',
    'typeof FEATURE_SOUND': '"true"'
  }
})
