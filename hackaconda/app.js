
var http = require('http')
var socketio = require('socket.io');
var fs = require('fs');
var url = require('url');


var server = http.createServer(function(req, res){
    var requestedPathName = url.parse(req.url).pathname;
    if(requestedPathName=="/"){
        fs.createReadStream('./index.html').pipe(res);
    }else if(requestedPathName=="/playerId"){
        res.writeHead(200);
        res.write("" + ++playersCreated);
        res.end();
    }
}).listen(3000);


var io = socketio(server);

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



function emitPlayerPositions() {
    io.emit('update position', players);
}