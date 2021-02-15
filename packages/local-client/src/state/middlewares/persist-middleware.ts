import { Middleware } from 'redux';

import { AppDispatch } from '../store';
import { Action } from '../actions';
import { ActionType } from '../action-types';
import { RootState } from '../reducers';
import { saveCells } from '../action-creators';

interface Store {
  dispatch: AppDispatch,
  getState: () => RootState
}

export const persistMiddleware: Middleware = ({ dispatch, getState }: Store) => {
  let timer: any;

  return (next: (action: Action) => void) =>
    (action: Action) => {
      next(action);

      const monitorActionTypes = [
        ActionType.MOVE_CELL,
        ActionType.UPDATE_CELL,
        ActionType.DELETE_CELL,
        ActionType.INSERT_CELL_AFTER,
      ];
      if (monitorActionTypes.includes(action.type)) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          console.log('...saving');
          saveCells()(dispatch, getState);
        }, 500);
      }
    };
};
