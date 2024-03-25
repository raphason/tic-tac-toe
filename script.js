const Gameboard = (function() {
    const rows = 3;
    const columns = 3;
    let board = [];

    //Create Board
    const reset = () => {
        board = [];
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Square());
            }
        }
    }

    const getSquare = (square) => {
        let row = Math.floor(square / rows);
        let column = square % columns;

        return board[row][column];
    };

    const getBoard = () => board;

    const printBoard = () => {
        const boardValues = board.map(row => row.map(square => square.getValue()));
        console.log(boardValues);
    };

    const markSquare = (square, symbol) => {
        square.changeValue(symbol);
    };

    return { getBoard, printBoard, markSquare, getSquare, reset, rows, columns };
})();

const GameController = (function() {
    playerOne = createPlayer("Player One", 0, "X");
    playerTwo = createPlayer("Player Two", 1, "O");
    players = [playerOne, playerTwo];
    let activePlayer;
    let winnerFound;

    const getActivePlayer = () => activePlayer;

    const swapActivePlayer = () => {
        activePlayer = activePlayer == players[0] ? players[1] : players[0];
    }

    const checkWinner = () => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < winningCombinations.length; i++) {
            let combo = winningCombinations[i];
            let match = true;

            for (let j = 1; j < combo.length; j++) {
                let current = Gameboard.getSquare(combo[j]).getValue();
                let previous = Gameboard.getSquare(combo[j-1]).getValue();

                if (current != previous || current == "") {
                    match = false;
                }
            }

            if (match === true) { 
                return match;
            }
        }

        return false;
    }

    const playRound = (square) => {
        let selectedSquare = Gameboard.getSquare(square);

        if (!winnerFound && selectedSquare.isEmpty()) {
            console.log(getActivePlayer().name + " marks square " + square + ".")
            Gameboard.markSquare(selectedSquare, getActivePlayer().symbol);
            Gameboard.printBoard();
            swapActivePlayer();
            winnerFound = checkWinner();
        }
        else {
            console.log("Game over or square full!");
        }
    };

    const newGame = () => {
        Gameboard.reset();
        activePlayer = players[0];
        winnerFound = false;
    }

    newGame();

    return { playRound, getActivePlayer, newGame };
})();

const DisplayController = (function() {
    const colors = ["red", "blue"];

    const squares = document.getElementsByClassName("square");
    Object.setPrototypeOf(HTMLCollection.prototype, Array.prototype);
    squares.forEach(square => square.addEventListener("click", squareClickHandler));

    const resetButton = document.getElementById("reset-button");
    resetButton.addEventListener("click", resetClickHandler);    

    function squareClickHandler(e) {
        let currentSquare = e.target.dataset.number;
        GameController.playRound(currentSquare);
        currentPlayer = GameController.getActivePlayer().number;

        e.target.style.color = colors[GameController.getActivePlayer().number];

        displayBoard();
    }

    function resetClickHandler() {
        GameController.newGame();
        squares.forEach(square => square.innerHTML = '');
    };

    const displayBoard = () => {
        for (let i = 0; i < squares.length; i++) {
            let currentSquare = squares[i];
            currentSquare.innerHTML = '';
            let squareText = Gameboard.getSquare(i).getValue();
            let textNode = document.createTextNode(squareText);

            currentSquare.appendChild(textNode);
        }
    }
})();

function Square() {
    let value = "";

    const isEmpty = () => value == "";
    const getValue = () => value;
    const changeValue = (symbol) => {
        value = symbol;
    };

    return { changeValue, getValue, isEmpty };
}

function createPlayer(name, number, symbol) {

    const setName = (newName) => name = newName;

    return { name, number, symbol, setName };
}