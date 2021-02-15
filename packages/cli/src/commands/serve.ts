import { Command } from 'commander';
import { serve } from 'local-api';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
  .command('serve [filename]')
  .option('-p, --port <number>', 'port to run server on', '4040')
  .description('Open file for editing')
  .action(async (filename = 'notebook.js', options: {port: string}) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      await serve(
        path.basename(filename),
        +options.port,
        dir,
        !isProduction,
      );
      console.log(`Opened ${filename} inside ${dir}`);
      console.log(`Navigate to http://localhost:${options.port} to edit.`);
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${options.port} is in use. Try different port.`);
      } else {
        console.log('Error happened:', err.message);
      }
      process.exit(1);
    }
  });
