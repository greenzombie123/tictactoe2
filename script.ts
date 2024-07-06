type Mark = "X" | "O" | " "
type PlayerType = "human" | "computer"

enum Position {
    topleft = 'topleft',
    topcenter = 'topcenter',
    topright = 'topright',
    centerleft = 'centerleft',
    center = 'center',
    centerright = 'centerright',
    bottomleft = 'bottomleft',
    bottomcenter = 'bottomcenter',
    bottomright = 'bottomright',
}

interface Player {
    name: string,
    getMark: () => Mark,
    playerTurn: boolean,
    togglePlayerTurn: () => void,
    playerType: PlayerType,

}

interface GameBoard {
    setMark: (position: Position, mark: Mark) => void,
    isPositionMarked: (position: Position) => boolean
    getMark: (position: Position) => Mark
    showBoard: () => void
    resetBoard: () => void
    anySpacesLeft: () => boolean
}

interface Game {
    setGame: (playerName1: string, playerName2: string, opponentType: PlayerType) => void
    makePlay: (position: Position) => void
    getMark: (position: Position) => Mark
}

interface checkWinner {
    (mark: Mark): Player | null
}

//* Game Logic

function GameBoard(): GameBoard {
    const board: Map<Position, Mark> = new Map()
    board.set(Position.topleft, ' ')
    board.set(Position.topcenter, ' ')
    board.set(Position.topright, ' ')
    board.set(Position.centerleft, ' ')
    board.set(Position.center, ' ')
    board.set(Position.centerright, ' ')
    board.set(Position.bottomleft, ' ')
    board.set(Position.bottomcenter, ' ')
    board.set(Position.bottomright, ' ')

    const setMark = (position: Position, mark: Mark) => {
        board.set(position, mark)
    }
    const isPositionMarked = (position: Position) => {
        return board.get(position) !== ' '
    }

    const getMark = (position: Position) => {
        return board.get(position)!
    }

    const showBoard = () => {
        console.log(board.get(Position.topleft), board.get(Position.topcenter), board.get(Position.topright))
        console.log(board.get(Position.centerleft), board.get(Position.center), board.get(Position.centerright))
        console.log(board.get(Position.bottomleft), board.get(Position.bottomcenter), board.get(Position.bottomright))
    }

    const resetBoard = () => {
        const makeTileEmpty = (_, key) => board.set(key, " ")
        board.forEach(makeTileEmpty)
        showBoard()
    }

    const anySpacesLeft = () => {
        let isThereSpace = false

        board.forEach((space) => {
            if (space === ' ') {
                isThereSpace = true
            }
        })
        return isThereSpace
    }

    return { setMark, isPositionMarked, getMark, showBoard, resetBoard, anySpacesLeft }
}

let game = ((): Game => {
    let playerOne: Player
    let playerTwo: Player
    let gameBoard: GameBoard = GameBoard()

    const setGame = (name1: string, name2: string, opponentType: PlayerType,) => {
        playerOne = createPlayer(name1, "O", "human")
        if (opponentType === "computer") playerTwo = createPlayer("computer", "X", "computer")
        else playerTwo = createPlayer(name2, "X", "human")
        console.log(`${playerOne.name + " " + playerOne.playerType} vs ${playerTwo.name + " " + playerTwo.playerType}`)
        gameBoard.showBoard()
        decideFirstPlayer()
        if (playerTwo.playerTurn && playerTwo.playerType === "computer") {
            let position = makeComputerPlay()
            makePlay(position)
        }
    }

    const decideFirstPlayer = () => {
        const randomNum = Math.floor(Math.random() * 2)
        if (randomNum === 1) {
            playerOne.playerTurn = true
            playerTwo.playerTurn = false
        }
        else {
            playerOne.playerTurn = false
            playerTwo.playerTurn = true
        }
        console.log(`Player One goes ${playerOne.playerTurn ? "first" : "second"}`)
    }

    const getCurrentPlayer = () => playerOne.playerTurn ? playerOne : playerTwo

    const makeComputerPlay = (): Position => {
        const positions = [
            Position.topleft,
            Position.topcenter,
            Position.topright,
            Position.centerleft,
            Position.center,
            Position.centerright,
            Position.bottomleft,
            Position.bottomcenter,
            Position.bottomright
        ]

        while (true) {
            let randomNum = Math.floor(Math.random() * 10)
            if (!gameBoard.isPositionMarked(positions[randomNum])) {
                return positions[randomNum]
            }
        }

    }
    const checkWinner: checkWinner = (mark: Mark) => {
        let currentMark = mark
        if (
            gameBoard.getMark(Position.topleft) === currentMark && gameBoard.getMark(Position.topcenter) === currentMark && gameBoard.getMark(Position.topright) === currentMark ||
            gameBoard.getMark(Position.topleft) === currentMark && gameBoard.getMark(Position.center) === currentMark && gameBoard.getMark(Position.bottomright) === currentMark ||
            gameBoard.getMark(Position.topleft) === currentMark && gameBoard.getMark(Position.centerleft) === currentMark && gameBoard.getMark(Position.bottomleft) === currentMark ||
            gameBoard.getMark(Position.centerleft) === currentMark && gameBoard.getMark(Position.center) === currentMark && gameBoard.getMark(Position.centerright) === currentMark ||
            gameBoard.getMark(Position.topcenter) === currentMark && gameBoard.getMark(Position.center) === currentMark && gameBoard.getMark(Position.bottomcenter) === currentMark ||
            gameBoard.getMark(Position.topright) === currentMark && gameBoard.getMark(Position.centerright) === currentMark && gameBoard.getMark(Position.bottomright) === currentMark ||
            gameBoard.getMark(Position.bottomleft) === currentMark && gameBoard.getMark(Position.bottomcenter) === currentMark && gameBoard.getMark(Position.bottomright) === currentMark ||
            gameBoard.getMark(Position.bottomleft) === currentMark && gameBoard.getMark(Position.center) === currentMark && gameBoard.getMark(Position.topright) === currentMark
        ) {
            return mark === "O" ? playerOne : playerTwo
        }
        return null
    }

    const changeTurns = () => {
        if (playerOne.playerTurn) {
            playerOne.playerTurn = false
            playerTwo.playerTurn = true
        }
        else {
            playerOne.playerTurn = true
            playerTwo.playerTurn = false
        }
    }
    const makePlay = (position: Position) => {
        if (!gameBoard.isPositionMarked(position)) {
            const currentPlayer = getCurrentPlayer()
            const mark = currentPlayer.getMark()
            gameBoard.setMark(position, mark)
            gameBoard.showBoard()
            const isWinner = checkWinner(currentPlayer.getMark())
            if (isWinner) {
                makeAnnounce(isWinner)
                startNewGame()
                return
            }
            if (!gameBoard.anySpacesLeft()) {
                console.log("TIE!")
                startNewGame()
                return
            }
            changeTurns()
            if (playerTwo.playerTurn && playerTwo.playerType === "computer") {
                let position = makeComputerPlay()
                makePlay(position)
            }
        }
    }

    const makeAnnounce = (winner: Player) => {
        console.log(`${winner.name} is the winner!`)
    }

    const startNewGame = () => {
        gameBoard.resetBoard()
        decideFirstPlayer()
        if (playerTwo.playerTurn && playerTwo.playerType === "computer") {
            let position = makeComputerPlay()
            makePlay(position)
        }
    }

    const getMark = (position: Position) => {
        return gameBoard.getMark(position)
    }

    return { setGame, makePlay, getMark }
})()

const createPlayer = (playerName: string, playerMark: Mark, type: PlayerType): Player => {
    const mark: Mark = playerMark
    const name: string = playerName
    const playerType: PlayerType = type
    let playerTurn: boolean = false

    const getMark = () => mark
    const togglePlayerTurn = () => {
        if (playerTurn) playerTurn = true
        else playerTurn = false
    }
    return { name, playerType, getMark, togglePlayerTurn, playerTurn }
}

/* Front End */
interface TicTacToe {
    initialize: () => void
}

interface Cells {
    makePlay: (postion: Position) => (position: Position) => void
    renderBoard: () => void
}

function Cells(): Cells {
    const cells = (Array.from(document.querySelectorAll(".cell")) as HTMLElement[])
    cells.forEach(cell => {
        cell.addEventListener("click", makePlay(cell.dataset.position as Position))
    })

    const renderBoard = () => {
        cells.forEach(cell => {
            const mark = game.getMark(cell.dataset.position as Position)
            cell.textContent = mark
        })
    }
    const makePlay = (position: Position) => {
        return () => {
            game.makePlay(position)
        }
    }

    return { makePlay, renderBoard }
}

function configureButtons() {
    let buttonDiv = document.querySelector(".buttons") as HTMLElement
    let buttons = (Array.from(document.querySelectorAll(".buttons button")) as HTMLElement[])
    const getOpponentType = (opponentType: PlayerType) =>
        () => {
            closeButtons()
            configureInputs(opponentType)
        }

    buttons[0].addEventListener("click", getOpponentType("human"))
    buttons[1].addEventListener("click", getOpponentType("computer"))

    // const renderButtons = () => buttonDiv.style.display = "block"
    const closeButtons = () => buttonDiv.style.display = "none"
}

function configureInputs(playerType: PlayerType) {
    let inputDiv = document.querySelector(".inputs") as HTMLElement
    let inputs = (Array.from(document.querySelectorAll("input")) as HTMLInputElement[])
    let button = document.querySelector("button") as HTMLElement

    inputDiv.style.display = "flex"

    if (playerType === "computer") {
        inputs[1].disabled = true
        inputs[1].value = "Computer"
    }

    const startGame = () => {
        let playerOneName = inputs[0].value || "Player One"
        if (playerType === "computer") {
            configureNames(playerOneName, "Computer")
            game.setGame(playerOneName, "", playerType)
        } else {
            let playerTwo = playerType === "human" && inputs[1].value === "" ? "Player Two" : inputs[1].value
            configureNames(playerOneName, playerTwo)
            game.setGame(playerOneName, playerTwo, playerType)
        }
        hideInputs()
    }

    button.addEventListener("click", startGame)

    const hideInputs = () => inputDiv.style.display = "none"
}

function configureNames(player1Name: string, player2Name: string) {
    const nameContainer = document.querySelector(".names") as HTMLElement
    nameContainer.style.display = "flex"
    const names = Array.from(document.querySelectorAll(".names span")) as HTMLElement[]
    names[0].textContent = player1Name
    names[1].textContent = player2Name
}

const tictactoe: TicTacToe = (() => {
    const initialize = () => {
        configureButtons()
    }

    return { initialize }
})()

tictactoe.initialize()
