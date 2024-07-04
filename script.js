var Position;
(function (Position) {
    Position["topleft"] = "topleft";
    Position["topcenter"] = "topcenter";
    Position["topright"] = "topright";
    Position["centerleft"] = "centerleft";
    Position["center"] = "center";
    Position["centerright"] = "centerright";
    Position["bottomleft"] = "bottomleft";
    Position["bottomcenter"] = "bottomcenter";
    Position["bottomright"] = "bottomright";
})(Position || (Position = {}));
//* Game Logic
function GameBoard() {
    var board = new Map();
    board.set(Position.topleft, ' ');
    board.set(Position.topcenter, ' ');
    board.set(Position.topright, ' ');
    board.set(Position.centerleft, ' ');
    board.set(Position.center, ' ');
    board.set(Position.centerright, ' ');
    board.set(Position.bottomleft, ' ');
    board.set(Position.bottomcenter, ' ');
    board.set(Position.bottomright, ' ');
    var setMark = function (position, mark) {
        board.set(position, mark);
    };
    var isPositionMarked = function (position) {
        return board.get(position) !== ' ';
    };
    var getMark = function (position) {
        return board.get(position);
    };
    var showBoard = function () {
        console.log(board.get(Position.topleft), board.get(Position.topcenter), board.get(Position.topright));
        console.log(board.get(Position.centerleft), board.get(Position.center), board.get(Position.centerright));
        console.log(board.get(Position.bottomleft), board.get(Position.bottomcenter), board.get(Position.bottomright));
    };
    var resetBoard = function () {
        var makeTileEmpty = function (_, key) { return board.set(key, " "); };
        board.forEach(makeTileEmpty);
        showBoard();
    };
    var anySpacesLeft = function () {
        var isThereSpace = false;
        board.forEach(function (space) {
            if (space === ' ') {
                isThereSpace = true;
            }
        });
        return isThereSpace;
    };
    return { setMark: setMark, isPositionMarked: isPositionMarked, getMark: getMark, showBoard: showBoard, resetBoard: resetBoard, anySpacesLeft: anySpacesLeft };
}
function Player(name, playerType, mark) {
    var getMark = function () { return mark; };
    var playerTurn = false;
    var togglePlayerTurn = function () { playerTurn ? playerTurn = false : playerTurn = true; };
    return { name: name, getMark: getMark, togglePlayerTurn: togglePlayerTurn, playerTurn: playerTurn, playerType: playerType };
}
var game = (function () {
    var playerOne;
    var playerTwo;
    var gameBoard;
    var setGame = function (name1, name2, opponentType) {
        playerOne = createPlayer(name1, "O", "human");
        if (opponentType === "computer")
            playerTwo = createPlayer("computer", "X", "computer");
        else
            playerTwo = createPlayer(name2, "X", "human");
        gameBoard = GameBoard();
        console.log("".concat(playerOne.name + " " + playerOne.playerType, " vs ").concat(playerTwo.name + " " + playerTwo.playerType));
        gameBoard.showBoard();
        decideFirstPlayer();
        if (playerTwo.playerTurn && playerTwo.playerType === "computer") {
            var position = makeComputerPlay();
            makePlay(position);
        }
    };
    var decideFirstPlayer = function () {
        var randomNum = Math.floor(Math.random() * 2);
        if (randomNum === 1) {
            playerOne.playerTurn = true;
            playerTwo.playerTurn = false;
        }
        else {
            playerOne.playerTurn = false;
            playerTwo.playerTurn = true;
        }
        console.log("Player One goes ".concat(playerOne.playerTurn ? "first" : "second"));
    };
    var getCurrentPlayer = function () { return playerOne.playerTurn ? playerOne : playerTwo; };
    var makeComputerPlay = function () {
        var positions = [
            Position.topleft,
            Position.topcenter,
            Position.topright,
            Position.centerleft,
            Position.center,
            Position.centerright,
            Position.bottomleft,
            Position.bottomcenter,
            Position.bottomright
        ];
        while (true) {
            var randomNum = Math.floor(Math.random() * 10);
            if (!gameBoard.isPositionMarked(positions[randomNum])) {
                return positions[randomNum];
            }
        }
    };
    var checkWinner = function (mark) {
        var currentMark = mark;
        if (gameBoard.getMark(Position.topleft) === currentMark && gameBoard.getMark(Position.topcenter) === currentMark && gameBoard.getMark(Position.topright) === currentMark ||
            gameBoard.getMark(Position.topleft) === currentMark && gameBoard.getMark(Position.center) === currentMark && gameBoard.getMark(Position.bottomright) === currentMark ||
            gameBoard.getMark(Position.topleft) === currentMark && gameBoard.getMark(Position.centerleft) === currentMark && gameBoard.getMark(Position.bottomleft) === currentMark ||
            gameBoard.getMark(Position.centerleft) === currentMark && gameBoard.getMark(Position.center) === currentMark && gameBoard.getMark(Position.centerright) === currentMark ||
            gameBoard.getMark(Position.topcenter) === currentMark && gameBoard.getMark(Position.center) === currentMark && gameBoard.getMark(Position.bottomcenter) === currentMark ||
            gameBoard.getMark(Position.topright) === currentMark && gameBoard.getMark(Position.centerright) === currentMark && gameBoard.getMark(Position.bottomright) === currentMark ||
            gameBoard.getMark(Position.bottomleft) === currentMark && gameBoard.getMark(Position.bottomcenter) === currentMark && gameBoard.getMark(Position.bottomright) === currentMark ||
            gameBoard.getMark(Position.bottomleft) === currentMark && gameBoard.getMark(Position.center) === currentMark && gameBoard.getMark(Position.topright) === currentMark) {
            return mark === "O" ? playerOne : playerTwo;
        }
        return null;
    };
    var changeTurns = function () {
        if (playerOne.playerTurn) {
            playerOne.playerTurn = false;
            playerTwo.playerTurn = true;
        }
        else {
            playerOne.playerTurn = true;
            playerTwo.playerTurn = false;
        }
    };
    var makePlay = function (position) {
        if (!gameBoard.isPositionMarked(position)) {
            var currentPlayer = getCurrentPlayer();
            var mark = currentPlayer.getMark();
            gameBoard.setMark(position, mark);
            gameBoard.showBoard();
            var isWinner = checkWinner(currentPlayer.getMark());
            if (isWinner) {
                makeAnnounce(isWinner);
                startNewGame();
                return;
            }
            if (!gameBoard.anySpacesLeft()) {
                console.log("TIE!");
                startNewGame();
                return;
            }
            changeTurns();
            if (playerTwo.playerTurn && playerTwo.playerType === "computer") {
                var position_1 = makeComputerPlay();
                makePlay(position_1);
            }
        }
    };
    var makeAnnounce = function (winner) {
        console.log("".concat(winner.name, " is the winner!"));
    };
    var startNewGame = function () {
        gameBoard.resetBoard();
        decideFirstPlayer();
        if (playerTwo.playerTurn && playerTwo.playerType === "computer") {
            var position = makeComputerPlay();
            makePlay(position);
        }
    };
    return { setGame: setGame, makePlay: makePlay };
})();
var createPlayer = function (playerName, playerMark, type) {
    var mark = playerMark;
    var name = playerName;
    var playerType = type;
    var playerTurn = false;
    var getMark = function () { return mark; };
    var togglePlayerTurn = function () {
        if (playerTurn)
            playerTurn = true;
        else
            playerTurn = false;
    };
    return { name: name, playerType: playerType, getMark: getMark, togglePlayerTurn: togglePlayerTurn, playerTurn: playerTurn };
};
