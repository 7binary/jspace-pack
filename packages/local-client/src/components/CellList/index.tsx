import { Fragment, useEffect } from 'react';
import { useTypedSelector } from '../../hooks/use-typed-selector';
import CellListItem from '../CellListItem';
import AddCell from '../AddCell';
import './cell-list.css';
import { useActions } from '../../hooks/use-actions';

const CellList: React.FC = () => {
  const { fetchCells } = useActions();
  const cells = useTypedSelector(({ cells }) => cells.order.map(id => cells.data[id]));

  useEffect(() => {
    fetchCells();
  }, [fetchCells]);

  const renderedCells = cells.map(cell => (
    <Fragment key={cell.id}>
      <CellListItem key={cell.id} cell={cell}/>
      <AddCell prevCellId={cell.id}/>
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell prevCellId={null} forceVisible={true}/>
      {renderedCells}
    </div>
  );
};

export default CellList;
