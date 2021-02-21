import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellsRouter } from './routes/create-cells.router';

export const serve = (filename: string, port: number, dir: string, useProxy: boolean) => {
  const app = express();

  app.use(express.json());
  app.use(createCellsRouter(filename, dir));

  if (useProxy) {
    app.use(createProxyMiddleware({
      target: 'http://localhost:3000',
      ws: true,
      logLevel: 'silent',
    }));
  } else {
    const packagePath = require.resolve('@jspace-cli/local-client/build/index.html');
    app.use(express.static(path.dirname(packagePath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};
