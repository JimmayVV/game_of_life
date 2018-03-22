import React from 'react';
import GridItem from './GridItem';

const GameGrid = (props) => {
  let big = (props.grid.length <= 20);

  return (
    <div className="grid">
      {
        props.grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="grid-row">
              {
                row.map((col, colIndex) => {
                  return <GridItem key={col.id} active={col.active} big={big} location={{row: rowIndex, col: colIndex}} toggleCell={props.toggleCell} />;
                })
              }
            </div>
          );
        })
      }
    </div>
  );
}

export default GameGrid;