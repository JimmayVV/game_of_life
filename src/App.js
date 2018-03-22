import React, { Component } from 'react';
import './App.css';
import GameGrid from './components/GameGrid';

class App extends Component {
  constructor(props) {
    super(props);

    // Initial data
    let rows = 50,
        cols = 50,
        grid = this.getNewGrid(this.clearGridLogic, rows, cols);

    // Set this initial data to state, with a couple other options
    this.state = {
      grid: grid,
      rows: rows,
      cols: cols,
      paused: true,
      round: 0
    };

    this.timer = null;

    this.advanceRound = this.advanceRound.bind(this);
    this.advanceRoundLogic = this.advanceRoundLogic.bind(this);
    this.toggleCell = this.toggleCell.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.seedGame = this.seedGame.bind(this);
    this.toggleGame = this.toggleGame.bind(this);
  }

  advanceRound() {
    let newGrid = this.getNewGrid(this.advanceRoundLogic);
    let round = this.state.round;

    this.setState({ grid: newGrid, round: ++round});
  }

  seedGame() {
    let newGrid = this.getNewGrid(this.seedLogic);
    this.setState({grid: newGrid, round: 0});
  }

  // _rows & _cols are optional, and ideally will take from state, but exist here for the initial render
  // when state will be undefined
  getNewGrid(testFunc, _rows, _cols) {
    let rows = _rows || this.state.rows,
        cols = _cols || this.state.cols,
        grid = [],
        count = 1;

    for (let r = 0; r < rows; r++) {
      let row = [];
      for (let c = 0; c < cols; c++, count++) {
        let result = testFunc(r, c);
        row.push({id: count, active: result});
      }
      grid.push(row);
    }

    return grid;
  }

  resetGame() {
    let grid = this.getNewGrid(this.clearGridLogic, this.state.rows, this.state.cols);

    this.setState({grid: grid, round: 0, paused: true});
    clearTimeout(this.timer);
  }

  toggleGame() {
    // We can pull this from state later
    let speed = 150;

    if (this.state.paused) {
      this.setState({paused: false});
      this.timer = setInterval(this.advanceRound, speed);
    } else {
      this.setState({paused: true});
      clearTimeout(this.timer);
    }
  }

  toggleCell(row, col) {
    if (this.state.paused !== true || this.state.round !== 0) return 1;
    
    let grid = this.state.grid;

    grid[row][col].active = !grid[row][col].active;

    this.setState({grid});
  }

  seedLogic() {
    return Math.random() < 0.25;
  }

  clearGridLogic() {
    return false;
  }

  advanceRoundLogic(row, col) {
    let alive = false;  // Initialize a variable to represent if the current cell is alive
    let neighbors = 0;  // Keep track of how many live neighbors there are
    let state = this.state;

    // Loop through all of the cells that surround the given coordinate
    for (let rowOffset = -1; rowOffset < 2; rowOffset++) {
      for (let colOffset = -1; colOffset < 2; colOffset++) {
        // If the center cell is up, skip it (we don't need that yet)
        if (rowOffset === 0 && colOffset === 0) {
          alive = isItemAlive(row, col);
          continue;
        }
        if (checkCell(row + rowOffset, col + colOffset)) ++neighbors;
      }
    }

    // We now know if the given cell is alive, as well as how many alive neighbors there are.
    // With this knowledge we can calculate a few tests and return if the given cell should live next round.

    // Based on the rules of Game of Life, determine if a given cell should
    // be alive, or dead:
    //
    // 1. Any live cell with fewer than two live neighbours dies,
    //    as if caused by underpopulation.
    // 2. Any live cell with two or three live neighbours lives
    //    on to the next generation.
    // 3. Any live cell with more than three live neighbours dies,
    //    as if by overpopulation.
    // 4. Any dead cell with exactly three live neighbours becomes
    //    a live cell, as if by reproduction

    // If alive, and 2, or 3 total neighbors, then this cell will continue to live...
    if ((alive && (neighbors === 2 || neighbors === 3)) ||
      // If current cell is dead, but there are 3 alive neighbors, then this cell will live
      (!alive && neighbors === 3)
    ) return true;  // In either of the above scenario's, this cell should live

    // If we're still here, then this cell should die
    return false;

    function checkCell(row, col) {
      // Catch boundaries
      if (row >= state.rows) row = 0;
      if (col >= state.cols) col = 0;
      if (row < 0) row += state.rows;
      if (col < 0) col += state.cols;

      return isItemAlive(row, col);
    }

    function isItemAlive(row, col) {
      return state.grid[row][col].active;
    }
  }

  render() {
    return (
      <div className="wrapper">
        <h2>Game of Life - Round: {this.state.round}</h2>
        <div className="wrapper-row">
          <div className="rules">
            Rules
          </div>
          <GameGrid grid={this.state.grid} toggleCell={this.toggleCell} />
          <div className="commands">
            <h3>Commands</h3>
            <button onClick={this.resetGame}>Reset</button>
            <button onClick={this.seedGame} disabled={!(this.state.round === 0 && this.state.paused)}>Seed</button>
            <button onClick={this.toggleGame}>{this.state.paused ? 'Start' : 'Pause'}</button>
            <button onClick={this.advanceRound} disabled={!this.state.paused}>Next</button>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
