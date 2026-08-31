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

  const evaluate = (player) => {
    const simplifiedBoard = [];
    board.forEach((row) => {
      row.forEach((cell) => {
        simplifiedBoard.push(cell.getValue());
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
        return player;
      }
    }

    //checking for tie
    if (!simplifiedBoard.some((cell) => cell === 0)) {
      return "tie";
    }
    return 0;
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

    const result = board.evaluate(getActivePlayer());

    if (result === 0) {
      switchPlayerTurn();
      printNewRound();
    } else if (result === "tie") {
      console.log("It's a tie");
    } else {
      console.log(`${getActivePlayer().name} has won`);
    }
  };

  // Initial play game message
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

// const game = GameController();

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    // Render board squares
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        cellButton.dataset.row = i;
        cellButton.dataset.column = j;

        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    // Make sure I've clicked a column and not the gaps in between
    if (!selectedColumn || !selectedRow) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();
}

ScreenController();
