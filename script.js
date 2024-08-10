let currentPlayer = 'X';
let gameBoard;
let isGameOver = false;
let mode;

// Toggle theme between dark and light mode
document.getElementById('theme-toggle').addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        document.getElementById('mode-label').innerText = "Dark Mode";
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        document.getElementById('mode-label').innerText = "Light Mode";
    }
});

function startGame() {
    const modeRadios = document.getElementsByName('mode');
    mode = getSelectedMode(modeRadios);

    // Reset game state
    isGameOver = false;
    currentPlayer = 'X';
    document.getElementById('message').innerText = '';

    // Hide mode selection and show game board
    document.getElementById('mode-selection').style.display = 'none';
    document.getElementById('game').style.display = 'grid';

    // Initialize game board
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    renderBoard();
}

function renderBoard() {
    const gameElement = document.getElementById('game');
    gameElement.innerHTML = '';
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.innerText = cell;
        cellElement.addEventListener('click', handleCellClick);
        gameElement.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (!isGameOver && gameBoard[index] === '') {
        makeMove(index);
        if (mode === 'with-ai' && !isGameOver) {
            // Add a delay before the AI makes a move
            setTimeout(makeAIMove, 500); // 500ms delay
        }
    }
}

function makeMove(index) {
    gameBoard[index] = currentPlayer;
    renderBoard();
    checkWin();
    if (!isGameOver) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch turns
    }
}

function makeAIMove() {
    // Simple AI: Randomly choose an empty cell
    let emptyCells = gameBoard.reduce((acc, cell, index) => {
        if (cell === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    if (emptyCells.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        makeMove(emptyCells[randomIndex]);
    }
}

function checkWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
            announceWinner(gameBoard[a]);
            return;
        }
    }

    if (!gameBoard.includes('')) {
        announceDraw();
    }
}

function announceWinner(winner) {
    isGameOver = true;
    document.getElementById('message').innerText = `Player ${winner} wins!`;
}

function announceDraw() {
    isGameOver = true;
    document.getElementById('message').innerText = 'It\'s a draw!';
}

function getSelectedMode(radios) {
    for (let radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return 'two-players'; // Default mode
}
