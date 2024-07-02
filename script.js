var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Stage;
(function (Stage) {
    Stage[Stage["opponentSelection"] = 0] = "opponentSelection";
    Stage[Stage["setUp"] = 1] = "setUp";
    Stage[Stage["play"] = 2] = "play";
})(Stage || (Stage = {}));
var Position;
(function (Position) {
    Position[Position["topleft"] = 0] = "topleft";
    Position[Position["topcenter"] = 1] = "topcenter";
    Position[Position["topright"] = 2] = "topright";
    Position[Position["centerleft"] = 3] = "centerleft";
    Position[Position["center"] = 4] = "center";
    Position[Position["centerright"] = 5] = "centerright";
    Position[Position["bottomleft"] = 6] = "bottomleft";
    Position[Position["bottomcenter"] = 7] = "bottomcenter";
    Position[Position["bottomright"] = 8] = "bottomright";
})(Position || (Position = {}));
//* Game Logic
var gameboard = (function () {
    var board = new Map();
    board.set('topleft', '');
    board.set('topcenter', '');
    board.set('topright', '');
    board.set('centerleft', '');
    board.set('center', '');
    board.set('centerright', '');
    board.set('bottomleft', '');
    board.set('bottomcenter', '');
    board.set('bottomright', '');
    var setMark = function (position, mark) {
        board.set(position, mark);
    };
    var isPositionMarked = function (position) {
        return board.get(position) !== '';
    };
    return { setMark: setMark, isPositionMarked: isPositionMarked };
})();
var game = (function (board) {
    var playerOne = null;
    var playerTwo = null;
    var gameBoard = board;
    var checkWinner = function (gameboard) { return "playerOne"; };
    var decideWinner = function (winner) { return 'void'; };
    var changeTurns = function (player1, player2) { return 'void'; };
    var makePlay = function (position) { return 'void'; }; //* Can only be called if stage is 'play'
    var startGame = function () { };
    var isComputerTurn = function (player2) { return true; };
    var reset = function () { };
    return { playerOne: playerOne, playerTwo: playerTwo, gameBoard: gameBoard, checkWinner: checkWinner, decideWinner: decideWinner, changeTurns: changeTurns, makePlay: makePlay, startGame: startGame, isComputerTurn: isComputerTurn, reset: reset };
})(gameboard);
var gameConfig = (function () {
    var stage = Stage.opponentSelection;
    var playerOne;
    var playerTwo;
    var setStage = function (newStage) { stage = newStage; };
    var getStage = function () { return stage; };
    var setPlayerInfo = function (playerInfo) {
        if (stage === Stage.opponentSelection) {
            setGame(playerInfo, game);
        }
    };
    var setGame = function (newPlayerInfo, game) {
        var opponent = newPlayerInfo.opponent, playerOneName = newPlayerInfo.playerOneName, playerTwoName = newPlayerInfo.playerTwoName;
        playerOne = createPlayer(playerOneName, "O", "human");
        if (opponent === "computer")
            playerTwo = createComputer();
        else
            playerTwo = createPlayer(playerTwoName, "X", "human");
        var randomNum = Math.floor(Math.random() * 2);
        if (randomNum === 0)
            playerOne.playerTurn = true;
        else
            playerTwo.playerTurn = true;
        game.playerOne = __assign({}, playerOne);
        game.playerTwo = __assign({}, playerTwo);
    };
    return { getStage: getStage, setPlayerInfo: setPlayerInfo };
})();
var createPlayer = function (playerName, playerMark, type) {
    var score = 0;
    var mark = playerMark;
    var name = playerName;
    var playerType = type;
    var playerTurn = false;
    var increaseScore = function () { ++score; };
    var getScore = function () { return score; };
    var getMark = function () { return mark; };
    var togglePlayerTurn = function () {
        if (playerTurn)
            playerTurn = true;
        else
            playerTurn = false;
    };
    return { name: name, playerType: playerType, increaseScore: increaseScore, getScore: getScore, getMark: getMark, togglePlayerTurn: togglePlayerTurn, playerTurn: playerTurn };
};
var createComputer = function () {
    var player = createPlayer("Computer", "X", "computer");
    var choosePosition = function (gameBoard) {
        var positions = ['topleft',
            'topcenter',
            'topright',
            'centerleft',
            'center',
            'centerright',
            'bottomleft',
            'bottomcenter',
            'bottomright'
        ];
        while (true) {
            var randomNum = positions[Math.floor(Math.random() * 10)];
            if (!gameBoard.isPositionMarked(positions[randomNum])) {
                return positions[randomNum];
            }
        }
    };
    return __assign(__assign({}, player), { choosePosition: choosePosition });
};
gameConfig.setPlayerInfo({ playerOneName: "Jeu", playerTwoName: "Kel", opponent: "computer" });
