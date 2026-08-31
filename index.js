function Gameboard() {
  const rows = 3;
  const columns = 3;

  const board = [];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const move = (player, row, column) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addToken(player);
      return true;
    } else return false;
  };

  const evaluate = () => {
    const simplifiedBoard = [];
    board.forEach((row) => {
      row.forEach((col) => {
        simplifiedBoard.push(col.getValue());
      });
    });

    const wins = [
      [0, 4, 8],
      [2, 4, 6],
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];

    for (const [a, b, c] of wins) {
      if (
        simplifiedBoard[a] !== 0 &&
        simplifiedBoard[a] === simplifiedBoard[b] &&
        simplifiedBoard[a] === simplifiedBoard[c]
      ) {
        return true;
      }
    }
    return false;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, move, evaluate, printBoard };
}

function Cell() {
  let value = 0;

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    console.log(
      `Putting ${getActivePlayer().name}'s token into row ${row} column ${column}...`,
    );
    
    if (!board.move(getActivePlayer().token, row, column)) {
      console.log("Already used");
      return;
    }

    if (!board.evaluate()) {
      switchPlayerTurn();
      printNewRound();
    } else {
      console.log("${getActivePlayer().name} has won");
    }
  };

  // Initial play game message
  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();

// function ScreenController() {
//     const game = GameController();
//     const activeDisplay = document.querySelector(".turn");
//     const boardDiv = document.querySelector(".board");
//     console.log(game.getBoard());
//     for (const cell of game.getBoard()) {
//         alert(cell);
//     }

// }

// ScreenController();
