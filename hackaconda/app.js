var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var playersCreated = 0;

var player1 = {
    id:1,
    x: 0,
    y: 0,
    moveUp : function() {
        --this.y;
    },
    moveDown: function() {
        ++this.y;
    },
    moveRight: function() {
        ++this.x;
    },
    moveLeft:function(){
        --this.x;
    }

};

var player2 = {
    id:2,
    x: 0,
    y: 0,
    moveUp : function() {
        --this.y;
    },
    moveDown: function() {
        ++this.y;
    },
    moveRight: function() {
        ++this.x;
    },
    moveLeft:function(){
        --this.x;
    }

};

app.get('/', function (req, res) {
    res.sendfile('index.html');
});
app.get('/playerId', function (req, res) {
    res.send("" + ++playersCreated);
});

io.on('connection', function (socket) {
    console.log('a user connected with id :' + playersCreated);
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('movePlayer1Up', function (direction) {
        player1.moveUp();
    });
    socket.on('movePlayer1Down', function (direction) {
        player1.moveDown();
    });
    socket.on('movePlayer1Left', function (direction) {
        player1.moveLeft();
    });
    socket.on('movePlayer1Right', function (direction) {
        player1.moveRight();
    });
    socket.on('movePlayer2Up', function (direction) {
        player2.moveUp();
    });
    socket.on('movePlayer2Down', function (direction) {
        player2.moveDown();
    });
    socket.on('movePlayer2Left', function (direction) {
        player2.moveLeft();
    });
    socket.on('movePlayer2Right', function (direction) {
        player2.moveRight();
    });
    setInterval(emitPlayerPositions, 20);
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

function emitPlayerPositions() {
    io.emit('update position', {player1: player1, player2:player2});
}