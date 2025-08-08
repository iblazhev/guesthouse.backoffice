import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/_main.scss";`,
      },
    },
    modules: {
      localsConvention: "camelCase", // Convert dashes to camelCase
      scopeBehaviour: "local", // Default behavior is local scope
    },
  },
  base: `/`,
  build: {
    outDir: "build",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: "client/rsc/[ext]/[name][extname]",
        chunkFileNames: "client/rsc/[name].[hash].js",
        entryFileNames: "client/rsc/js/client.js",
      },
    },
  },
});
