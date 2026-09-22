import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'google-sheet-proxy',
        configureServer(server) {
          server.middlewares.use('/api/sheet-data', async (req, res) => {
            try {
              const sheetUrl = 'https://docs.google.com/spreadsheets/d/11dK-AFiGZo2CDpK3FxXy9f2H5WB11nBZD0sYBMVAc5o/export?format=csv';
              const response = await fetch(sheetUrl);
              if (!response.ok) {
                throw new Error(`Google Sheets responded with status ${response.status}`);
              }
              const csv = await response.text();
              res.setHeader('Content-Type', 'text/csv; charset=utf-8');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(csv);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Failed to fetch sheet' }));
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
