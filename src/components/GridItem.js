import React from 'react';

const GridItem = (props) => {
  let active = (props.active) ? ' active' : '';
  let big = (props.big) ? ' big' : '';
  let location = props.location;

  /*const itemClick = (row, col) => {
    alert(`Row: ${row} Col: ${col} was clicked!`);
  };*/

  return (
    <div className={`grid-item${active}${big}`} onClick={() => props.toggleCell(location.row, location.col)}></div>
  );
}

export default GridItem;