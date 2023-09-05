import { initial_state, minimax, player, terminal, winner } from "./tictactoe.js";
import { changeSpanColors, getById } from "./utils.js";

const spanElements = document.querySelectorAll('#tictactoe span')
const AIspanElements = document.querySelectorAll('#AI span')

changeSpanColors(spanElements)
changeSpanColors(AIspanElements)

function handleOrientationChange(mediaQueryList) {
    if (mediaQueryList.matches) {
        spanElements.forEach((span, index) => {
            if (index === 2 || index === 5) {
                span.insertAdjacentHTML("afterend", "<br>")
            }
        })
    }
}

const portraitMediaQuery = window.matchMedia("(orientation: portrait)");

portraitMediaQuery.addEventListener("change", handleOrientationChange);
handleOrientationChange(portraitMediaQuery);

const X = "X";
const O = "O";

const boardElement = getById("board");

const computedStyle = window.getComputedStyle(boardElement);
boardElement.style.height = computedStyle.getPropertyValue("width");

const cell = (value, coordinates) => {
	return `
        <div class="cell" id="${coordinates}">
            ${value !== null ? value : ""}
        </div>
    `;
};

function showWinner(playerName) {

    const playerNameElement = getById("player-name")

    let playerNameMessage = playerName
    let playerWinningStatus = ""
    
    if (playerNameMessage === undefined) {
        playerNameMessage = "Tie"
        playerNameElement.style.fontSize = "5rem"
    } else {
        playerWinningStatus = "Wins"
    }

    playerNameElement.textContent = playerNameMessage
    getById("winning-type").textContent = playerWinningStatus

    getById("winner").classList.add("active")
}

function startGame(board) {
	for (let outer = 0; outer < 3; outer++) {
		for (let inner = 0; inner < 3; inner++) {
			const boardValue = board[outer][inner]
			boardElement.innerHTML += cell(boardValue, `${outer}${inner}`)
		}
	}
}

const getBoard = () => {
	let board = [];
	for (let outer = 0; outer < 3; outer++) {
		let row = [];
		for (let inner = 0; inner < 3; inner++) {
			const currentCell = getById(`${outer}${inner}`).innerHTML.trim()

			currentCell === "" ? row.push(null) : row.push(currentCell)
		}
		board.push(row)
	}
	return board
};

window.onclick = event => {

    const { target } = event
    const elementId = target.id

    const handleRetry = () => {
        getById("board").innerHTML = ""
        startGame(initial_state())
        const board = getBoard()
        const aIAction = minimax(board)
        const aICell = getById(aIAction.join(""))
        getById("menu").classList.add("close")
        getById("winner").classList.remove("active")
        setTimeout(() => {
            aICell.innerHTML = X
        }, 500)
    }

    switch (elementId) {
        case "menu-play-as-X":
            startGame(initial_state())
            getById("menu").classList.add("close")
            break
        case "menu-play-as-O":
            handleRetry()
            break
        case "retry-play-as-X":
            getById("board").innerHTML = ""
            startGame(initial_state())
            getById("winner").classList.remove("active")
            break
        case "retry-play-as-O":
            handleRetry()
            break
        case "back-to-menu":
            getById("board").innerHTML = ""
            getById("winner").classList.remove("active")
            getById("menu").classList.remove("close")
            break
        default:
            break
    }
};

boardElement.onclick = event => {

	const { target } = event
	const cell = getById(target.id)
	const cellValue = cell.innerHTML.trim()
	const currentPlayer = player(getBoard())

    if (cellValue === "") {
		cell.innerHTML = currentPlayer

		const board = getBoard()

		if (terminal(board) === false) {
			setTimeout(() => {
				const aI_player = currentPlayer === X ? O : X
				const aIAction = minimax(board)
				const aICell = getById(aIAction.join(""))
				aICell.innerHTML = aI_player
                
                const tictactoeWinner = winner(getBoard())

                if (tictactoeWinner !== null) {
                    setTimeout(() => {
                        showWinner(tictactoeWinner)
                    }, 500)
                }
                
			}, 200)
		} else {
            const tictactoeWinner = winner(getBoard())

            if (tictactoeWinner !== null) {
                setTimeout(() => {
                    showWinner(tictactoeWinner)
                }, 500)
            }
        }
	}
}
