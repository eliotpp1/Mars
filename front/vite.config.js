import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxInject: `import React from 'react'`, // Assure que React est accessible dans les fichiers JSX
  },
  server: {
    open: true, // Ouvre automatiquement le navigateur au lancement
  },
});
