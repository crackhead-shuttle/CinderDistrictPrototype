import { defineConfig } from 'vite';

export default defineConfig({
  base: '/CinderDistrictPrototype/',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});
