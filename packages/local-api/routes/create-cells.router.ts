import express from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  const fullPath = path.join(dir, filename);

  router.get('/api/cells', async (req, res) => {
    try {
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
      res.send({ cells: JSON.parse(result) });
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.writeFile(fullPath, JSON.stringify(getDefaultCells()), 'utf-8');
      } else {
        throw err;
      }
    }
  });

  router.post('/api/cells', async (req, res) => {
    const { cells }: {cells: Cell[]} = req.body;
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');
    res.status(201).send({ status: 'OK' });
  });

  return router;
};

const getDefaultCells = (): Cell[] => {
  const randomId = () => Math.random().toString(36).substr(2, 5);

  const codeCell: Cell = {
    id: randomId(),
    type: 'code',
    content: `import React from 'react';
import ReactDOM from 'react-dom';
const App = () => <h1 style={{textAlign:'center'}}>Hello</h1>;
ReactDOM.render(<App/>, document.querySelector('#root'));`,
  };

  const markdownCell: Cell = {
    id: randomId(),
    type: 'text',
    content: `# Click to edit!
- Mark Down
- Syntax`,
  };

  return [markdownCell, codeCell];
};
