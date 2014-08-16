var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var playersCreated = 0;

var players =
{
     player1 : {
        id: 1,
        x : 50,
        y : 0,
        moveUp: function () {
            --this.y;
        },
        moveDown: function () {
            ++this.y;
        },
        moveRight: function () {
            ++this.x;
        },
        moveLeft: function () {
            --this.x;
        }

    },
 player2: {
        id: 2,
        x: 0,
        y: 0,
        moveUp: function () {
            --this.y;
        },
        moveDown: function () {
            ++this.y;
        },
        moveRight: function () {
            ++this.x;
        },
        moveLeft: function () {
            --this.x;
        }

    }
};
app.get('/', function (req, res) {
    res.sendfile('index.html');
});
app.get('/playerId', function (req, res) {
    res.send("" + ++playersCreated);
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('movePlayer', function (player) {
        players["player" + player.id][player.direction]();
    });
    setInterval(emitPlayerPositions, 20);
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

function emitPlayerPositions() {
    io.emit('update position', players);
}