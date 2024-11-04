import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve `__dirname` in an ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // Specify the root folder where the index.html is located
  root: '.', // Adjust this if your project structure differs

  plugins: [react()],

  // Define the public directory
  publicDir: 'public', // Ensure the public directory is set for static assets like index.html

  build: {
    // Specify the directory for the build output
    outDir: 'dist', // Customize the output directory for production build

    // Rollup options for handling the input (entry) file
    // rollupOptions: {
    //   // Ensure the correct path to index.html using the resolved __dirname
    //   input: path.resolve(__dirname, 'public/index.html'),
    // },
  },

  // Alias configuration for path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Optional: alias for easier imports
    },
  },
});
