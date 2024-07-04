type Mark = "X" | "O" | " "
type PlayerType = "human" | "computer"
type Winner = "playerOne" | "playerTwo" | null

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
}

interface Game {
    setGame: (playerName1: string, playerName2: string, opponentType: PlayerType) => void
    // getCurrentPlayer: (player1: Player, player2: Player | Computer) => Player | Computer
    // checkWinner: (gameboard: GameBoard) => Winner
    // decideWinner: (winner: Winner) => void,
    // changeTurns: (player1: Player, player2: Player) => void,
    makePlay: (position: Position) => void, //* Can only be called if stage is 'play'
    // startGame: () => void,
    // isComputerTurn: (player2: Player) => boolean,
    // reset: () => void
}


//* Game Logic

function GameBoard(): GameBoard {
    const board = new Map()
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
        return board.get(position)
    }

    const showBoard = () => {
        console.log(board.get(Position.topleft), board.get(Position.topcenter), board.get(Position.topright))
        console.log(board.get(Position.centerleft), board.get(Position.center), board.get(Position.centerright))
        console.log(board.get(Position.bottomleft), board.get(Position.bottomcenter), board.get(Position.bottomright))
    }

    return { setMark, isPositionMarked, getMark, showBoard }
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
        randomNum === 1 ? playerOne.playerTurn = true : playerTwo.playerTurn = true
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
            let randomNum = positions[Math.floor(Math.random() * 10)]
            if (!gameBoard.isPositionMarked(positions[randomNum])) {
                return positions[randomNum]
            }
        }

    }
    const checkWinner = (gameboard: GameBoard) => {

    }
    const decideWinner = (winner: Winner) => 'void'

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
            changeTurns()
        }
    }

    const reset = () => { }

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

const choosePosition = (gameBoard: GameBoard) => {
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
        let randomNum = positions[Math.floor(Math.random() * 10)]
        if (!gameBoard.isPositionMarked(positions[randomNum])) {
            return positions[randomNum]
        }
    }

}