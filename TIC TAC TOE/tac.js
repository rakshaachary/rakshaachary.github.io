let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let w;
let h;

let ai = 'X';
let human = 'O';
let currentPlayer = human;

function setup() {
    createCanvas(400, 400);
    w = width / 3;
    h = height / 3;
}

function equals3(a, b, c) {
    return a === b && b === c && a !== '';
}

function checkWinner() {
    // Check for a winner

    // Rows
    for (let i = 0; i < 3; i++) {
        if (equals3(board[i][0], board[i][1], board[i][2])) {
            return board[i][0];
        }
    }

    // Columns
    for (let i = 0; i < 3; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            return board[0][i];
        }
    }

    // Diagonals
    if (equals3(board[0][0], board[1][1], board[2][2])) {
        return board[0][0];
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
        return board[2][0];
    }

    // Check for a tie
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                openSpots++;
            }
        }
    }

    if (openSpots === 0) {
        return 'tie';
    }

    // No winner or tie yet
    return null;
}

function mousePressed() {
    if (currentPlayer === human) {
        // Human makes a turn
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);

        // If valid turn
        if (board[i][j] === '') {
            board[i][j] = human;

            // Check for a winner or tie
            let result = checkWinner();
            if (result === null) {
                currentPlayer = ai;  // Switch to AI's turn
                bestMove();
            } else {
                // Game is over, show result
                console.log('Game over:', result);
            }
        }
    }
}

function draw() {
    background(255);
    strokeWeight(4);

    line(w, 0, w, height);
    line(w * 2, 0, w * 2, height);
    line(0, h, width, h);
    line(0, h * 2, width, h * 2);

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let x = w * i + w / 2;
            let y = h * j + h / 2;
            let spot = board[i][j];
            textSize(32);
            let r = w / 4;
            if (spot === human) {
                noFill();
                ellipse(x, y, r * 2);
            } else if (spot === ai) {
                line(x - r, y - r, x + r, y + r);
                line(x + r, y - r, x - r, y + r);
            }
        }
    }

    let result = checkWinner();
    if (result !== null) {
        noLoop();
        let resultP = createP('');
        resultP.style('font-size', '32pt');
        if (result === 'tie') {
            resultP.html('Tie!');
        } else {
            resultP.html(`${result} wins!`);
        }
    }
}

function bestMove() {
    let move = { i: -1, j: -1 };
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = ai;
                let score = minimax(board, 0, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = { i, j };
                }
            }
        }
    }
    if (move.i !== -1 && move.j !== -1) {
        board[move.i][move.j] = ai;
        currentPlayer = human;
    }
}

let scores = {
    X: 1,
    O: -1,
    tie: 0
};

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let q = 0; q < 3; q++) {
            for (let r = 0; r < 3; r++) {
                if (board[q][r] === '') {
                    board[q][r] = ai;
                    let score = minimax(board, depth + 1, false);
                    board[q][r] = '';
                    bestScore = max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let q = 0; q < 3; q++) {
            for (let r = 0; r < 3; r++) {
                if (board[q][r] === '') {
                    board[q][r] = human;
                    let score = minimax(board, depth + 1, true);
                    board[q][r] = '';
                    bestScore = min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}



