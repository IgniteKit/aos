import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();
  const root = resolve(__dirname, '..');

  // Serve dist files at /dist
  app.use('/dist', express.static(resolve(root, 'dist')));

  // Serve demo files at root
  app.use(express.static(resolve(root, 'demo')));

  const server = app.listen(8080, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:8080');
  });

  // Wait a bit to ensure server is fully ready
  await new Promise(resolve => setTimeout(resolve, 500));

  return server;
}

const serverPromise = startServer();

export default serverPromise;
