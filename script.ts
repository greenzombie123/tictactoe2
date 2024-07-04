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

function Player(name: string, playerType: PlayerType, mark: Mark): Player {
    const getMark = () => mark
    let playerTurn = false
    const togglePlayerTurn = () => { playerTurn ? playerTurn = false : playerTurn = true }
    return { name, getMark, togglePlayerTurn, playerTurn, playerType }
}

let game = ((): Game => {
    let playerOne: Player
    let playerTwo: Player
    let gameBoard: GameBoard

    const setGame = (name1: string, name2: string, opponentType: PlayerType,) => {
        playerOne = createPlayer(name1, "O", "human")
        if (opponentType === "computer") playerTwo = createPlayer("computer", "X", "computer")
        else playerTwo = createPlayer(name2, "X", "human")
        gameBoard = GameBoard()
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
        else{
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

    return { setGame, makePlay }
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

