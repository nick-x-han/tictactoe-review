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
    return "continue";
  };

  const move = (player, row, column) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addToken(player);
      return evaluate(player);
    } else return "duplicate";
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, move, printBoard };
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
      token: 'X',
    },
    {
      name: playerTwoName,
      token: 'O',
    },
  ];

  let gameState = 0;

  let activePlayer = players[0];

  const getGameState = () => gameState;
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    if (gameState !== 0) return;

    console.log(
      `Putting ${getActivePlayer().name}'s token into row ${row} column ${column}...`,
    );

    let moveResult = board.move(getActivePlayer().token, row, column);

    if (moveResult === "tie") {
      gameState = -1;
      console.log("It's game over");
    } else if (moveResult === players[0].token || moveResult === players[1].token) {
      gameState = getActivePlayer().token;
      console.log(`${getActivePlayer().name} has won`);
    } else if (moveResult === "duplicate") {
      console.log("Already played");
    } else if (moveResult === "continue") {
      switchPlayerTurn();
      printNewRound();
    }

    return moveResult;
  };

  // Initial play game message
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getGameState,
  };
}

// const game = GameController();

function ScreenController() {
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const resetButton = document.querySelector("#reset");
  const player1Input = document.querySelector("#player1");
  const player2Input = document.querySelector("#player2");

  let game = GameController();

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    const gameState = game.getGameState();
    if (gameState === 0)
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    else if (gameState === activePlayer.token) {
        playerTurnDiv.textContent = `${activePlayer.name}'s victory!`;
    }
    else {
        playerTurnDiv.textContent = "It's a tie!";
    }

    // Render board squares
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        cellButton.dataset.row = i;
        cellButton.dataset.column = j;

        let cellValue = cell.getValue();
        if (cellValue !== 0)
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

  function reset() {
    resetButton.textContent = 'Reset';
    if (!player1Input.value) player1Input.value = 'Player One';
    if (!player2Input.value) player2Input.value = 'Player Two';

    game = new GameController(player1Input.value, player2Input.value);
    updateScreen();
  }

  resetButton.addEventListener("click", (e) => reset());

  

  // Initial render
//   updateScreen();
}

ScreenController();
