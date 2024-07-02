type Mark = "X" | "O"
type PlayerType = "human" | "computer"
type Winner = "playerOne" | "playerTwo" | null

enum Stage {
    "opponentSelection", "setUp", "play"
}

enum Position {
    'topleft',
    'topcenter',
    'topright',
    'centerleft',
    'center',
    'centerright',
    'bottomleft',
    'bottomcenter',
    'bottomright',
}

interface ScoreBoard {
    showScore: (player1: Player, player2: Player) => void
    makeAnnoucement: (message: string) => void
}

interface Player {
    increaseScore: () => void,
    getScore: () => number,
    name: string,
    getMark: () => Mark,
    playerTurn: boolean,
    togglePlayerTurn: () => void,
    readonly playerType: PlayerType,

}

interface Computer extends Player {
    choosePosition: (gameBoard: GameBoard) => string
}

interface GameBoard {
    // board: Map<string, string>,
    setMark: (position: Position, mark: Mark) => void,
    isPositionMarked: (position: Position) => boolean
}

interface Game {
    playerOne: Player | null
    playerTwo: Player | null
    gameBoard: GameBoard
    checkWinner: (gameboard: GameBoard) => Winner
    decideWinner: (winner: Winner) => void,
    changeTurns: (player1: Player, player2: Player) => void,
    makePlay: (position: Position) => void, //* Can only be called if stage is 'play'
    startGame: () => void,
    isComputerTurn: (player2: Player) => boolean,
    reset: () => void
}

interface PlayerInfo {
    opponent: PlayerType,
    playerOneName: string,
    playerTwoName: string,
}

interface GameConfig {
    // setStage: (newStage: Stage) => void,
    getStage: () => Stage,
    // setGame: (newPlayerInfo: PlayerInfo, game:Game) => void, //* Creates players
    setPlayerInfo: (playerInfo: PlayerInfo) => void //* Can only be called if stage is 'config'
}

//* Game Logic

let gameboard = ((): GameBoard => {
    const board = new Map()
    board.set('topleft', '')
    board.set('topcenter', '')
    board.set('topright', '')
    board.set('centerleft', '')
    board.set('center', '')
    board.set('centerright', '')
    board.set('bottomleft', '')
    board.set('bottomcenter', '')
    board.set('bottomright', '')

    const setMark = (position: Position, mark: Mark) => {
        board.set(position, mark)
    }
    const isPositionMarked = (position: Position) => {
        return board.get(position) !== ''
    }

    return { setMark, isPositionMarked }
})()

let game = ((board: GameBoard): Game => {
    let playerOne: Player | null = null
    let playerTwo: Player | null | Computer = null
    let gameBoard = board
    const checkWinner = (gameboard: GameBoard) => ("playerOne" as Winner)
    const decideWinner = (winner: Winner) => 'void'
    const changeTurns = (player1: Player, player2: Player) => 'void'
    const makePlay = (position: Position) => 'void' //* Can only be called if stage is 'play'
    const startGame = () => { }
    const isComputerTurn = (player2: Player) => true
    const reset = () => {}

   
    return { playerOne, playerTwo, gameBoard, checkWinner, decideWinner, changeTurns, makePlay, startGame, isComputerTurn, reset }
})(gameboard)

const gameConfig = ((): GameConfig => {
    let stage: Stage = Stage.opponentSelection
    let playerOne: Player
    let playerTwo: Player | Computer
    const setStage = (newStage: Stage) => { stage = newStage }
    const getStage = () => stage
    const setPlayerInfo = (playerInfo: PlayerInfo) => {
        if (stage === Stage.opponentSelection) {
            setGame(playerInfo, game)
        }
    }
    const setGame = (newPlayerInfo: PlayerInfo, game:Game) => {
        const { opponent, playerOneName, playerTwoName } = newPlayerInfo
        playerOne = createPlayer(playerOneName, "O", "human")
        if (opponent === "computer") playerTwo = createComputer()
        else playerTwo = createPlayer(playerTwoName, "X", "human")
        const randomNum = Math.floor(Math.random() * 2)
        if (randomNum === 0) playerOne.playerTurn = true
        else playerTwo.playerTurn = true

        game.playerOne = {...playerOne}
        game.playerTwo = {...playerTwo}

    }
    return { getStage, setPlayerInfo }
})()

const createPlayer = (playerName: string, playerMark: Mark, type: PlayerType): Player => {
    let score: number = 0
    const mark: Mark = playerMark
    const name: string = playerName
    const playerType: PlayerType | null = type
    let playerTurn: boolean = false

    const increaseScore = () => { ++score }
    const getScore = () => score
    const getMark = () => mark
    const togglePlayerTurn = () => {
        if (playerTurn) playerTurn = true
        else playerTurn = false
    }
    return { name, playerType, increaseScore, getScore, getMark, togglePlayerTurn, playerTurn }
}

const createComputer = (): Computer => {
    const player = createPlayer("Computer", "X", "computer")

    const choosePosition = (gameBoard: GameBoard) => {
        const positions = ['topleft',
            'topcenter',
            'topright',
            'centerleft',
            'center',
            'centerright',
            'bottomleft',
            'bottomcenter',
            'bottomright'
        ]

        while (true) {
            let randomNum = positions[Math.floor(Math.random() * 10)]
            if (!gameBoard.isPositionMarked(positions[randomNum])) {
                return positions[randomNum]
            }
        }

    }

    return { ...player, choosePosition }
}

gameConfig.setPlayerInfo({playerOneName:"Jeu", playerTwoName:"Kel", opponent:"computer"})