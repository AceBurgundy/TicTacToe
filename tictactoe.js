const X = "X";
const O = "O";
const EMPTY = null;
const WORST_SCORE = -Infinity;
const BEST_SCORE = Infinity;

export function initial_state() {
    // Returns starting state of the board.
    return [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]
    ];
}

export function player(board) {
    // Returns player who has the next turn on a board.
    const list = Array.from(board)
    const x_count = list.flat().filter(cell => cell === X).length;
    const o_count = list.flat().filter(cell => cell === O).length;

    return x_count > o_count ? O : X;
}

function actions(board) {
    // Returns set of all possible actions (i, j) available on the board.
    const possibilities = [];

    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            if (board[row][column] === EMPTY) {
                possibilities.push([row, column]);
            }
        }
    }

    return possibilities;
}

function result(board, action) {
    // Returns the board that results from making move (i, j) on the board.
    if (!Array.isArray(action) || action.length !== 2) {
        throw new Error("Invalid action");
    }

    if (!actions(board).some(([row, col]) => row === action[0] && col === action[1])) {
        throw new Error("Invalid action");
    }

    const buffer_board = JSON.parse(JSON.stringify(board));
    buffer_board[action[0]][action[1]] = player(board);

    return buffer_board;
}

export function winner(board) {
    // Returns the winner of the game, if there is one.
    function check(player) {
        const conditions = [
            board[0].every(cell => cell === player), // Check 1st vertical line
            board[1].every(cell => cell === player), // Check 2nd vertical line
            board[2].every(cell => cell === player), // Check 3rd vertical line
            [board[0][0], board[1][0], board[2][0]].every(cell => cell === player), // Check 1st horizontal line
            [board[0][1], board[1][1], board[2][1]].every(cell => cell === player), // Check 2nd horizontal line
            [board[0][2], board[1][2], board[2][2]].every(cell => cell === player), // Check 3rd horizontal line
            [board[0][0], board[1][1], board[2][2]].every(cell => cell === player), // Check diagonal from top-left to bottom-right
            [board[0][2], board[1][1], board[2][0]].every(cell => cell === player)  // Check diagonal from top-right to bottom-left
        ];

        return conditions.some(condition => condition);
    }

    if (check(X)) {
        return X;
    }

    if (check(O)) {
        return O;
    }

    if (board.every(row => row.every(cell => cell !== EMPTY))) {
        return undefined;
    }

    return null

}

export function terminal(board) {
    // Returns true if the game is over, false otherwise.
    return !actions(board) || winner(board) !== null;
}

export function utility(board) {
    // Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    const game_winner = winner(board);
    return game_winner === X ? 1 : game_winner === O ? -1 : 0;
}

function optimal_decision(board, for_maximizing, value) {
    if (terminal(board)) {
        return [utility(board), null];
    }

    let preferred_value = for_maximizing ? WORST_SCORE : BEST_SCORE;
    let optimal_action = null;

    const action_set = actions(board);
    shuffleArray(action_set);

    for (const action of action_set) {
        if ((for_maximizing && value <= preferred_value) || (!for_maximizing && value >= preferred_value)) {
            break;
        }

        const player_result = optimal_decision(result(board, action), !for_maximizing, preferred_value)[0];

        if ((for_maximizing && player_result > preferred_value) || (!for_maximizing && player_result < preferred_value)) {
            optimal_action = action;
            preferred_value = player_result;
        }
    }

    return [preferred_value, optimal_action];
}

export function minimax(board) {
    // Returns the optimal action for the current player on the board.
    if (terminal(board)) {
        return null;
    }

    if (player(board) === X) {
        return optimal_decision(board, true, BEST_SCORE)[1];
    } else {
        return optimal_decision(board, false, WORST_SCORE)[1];
    }
}

// Helper export function to shuffle an array in-place.
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
