import {
  Action,
  BundleCompleteAction,
  BundleStartAction,
  DeleteCellAction,
  Direction,
  InsertAfterCellAction,
  MoveCellAction,
  UpdateCellAction,
} from '../actions';
import { ActionType } from '../action-types';
import { Cell, CellType } from '../cell';
import { AppDispatch } from '../store';
import bundle, { BundledResut } from '../../bundler';
import axios from 'axios';
import { RootState } from '../reducers';

export const updateCell = (id: string, content: string): UpdateCellAction => ({
  type: ActionType.UPDATE_CELL,
  payload: { id, content },
});

export const moveCell = (id: string, direction: Direction): MoveCellAction => ({
  type: ActionType.MOVE_CELL,
  payload: { id, direction },
});

export const deleteCell = (id: string): DeleteCellAction => ({
  type: ActionType.DELETE_CELL,
  payload: id,
});

export const insertCellAfter =
  (id: string | null, type: CellType, content?: string): InsertAfterCellAction => ({
    type: ActionType.INSERT_CELL_AFTER,
    payload: { id, type, content },
  });

const startBundle = (cellId: string): BundleStartAction => ({
  type: ActionType.BUNDLE_START,
  payload: { cellId },
});

const completeBundle = (cellId: string, bundled: BundledResut): BundleCompleteAction => ({
  type: ActionType.BUNDLE_COMPLETE,
  payload: { cellId, bundled },
});

export const createBundle = (cellId: string, input: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(startBundle(cellId));
    const bundled = await bundle(input);
    dispatch(completeBundle(cellId, bundled));
  };

const fetchCellsBegin = (): Action => ({
  type: ActionType.FETCH_CELLS,
});

const fetchCellsComplete = (cells: Cell[]): Action => ({
  type: ActionType.FETCH_CELLS_COMPLETE,
  payload: cells,
});

const fetchCellsError = (error: string): Action => ({
  type: ActionType.FETCH_CELLS_ERROR,
  payload: error,
});

const saveCellsError = (error: string): Action => ({
  type: ActionType.SAVE_CELLS_ERROR,
  payload: error,
});

export const fetchCells = () =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchCellsBegin());
    try {
      const { data: { cells } } = await axios.get<{cells: Cell[]}>('/api/cells');
      dispatch(fetchCellsComplete(cells));
    } catch (err) {
      dispatch(fetchCellsError(err.message));
    }
  };

export const saveCells = () =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const data = getState().cells.data;
    const cells = getState().cells.order.map(id => data[id]);
    try {
      await axios.post('/api/cells', { cells });
    } catch (err) {
      dispatch(saveCellsError(err.message));
    }
  };
