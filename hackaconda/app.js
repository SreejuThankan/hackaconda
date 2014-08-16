var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var playersCreated = 0;

function Player(id,x,y){
    this.id=id;
    this.x=x;
    this.y=y;
    this.moveUp=function () {
        --this.y;
    };
    this.moveDown=function () {
        ++this.y;
    };
    this.moveRight=function () {
        ++this.x;
    };
    this.moveLeft=function () {
        --this.x;
    }
}

var players = {player1 : new Player(1,50,0),
 player2: new Player(2,0,0)
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