const clientPath = `${__dirname}/client`;
const IMG_FOLDER = __dirname + '/assets/imgs/';
const IMG_EXT = '.png';
const port = process.env.PORT || 9000;

const Deck = require(__dirname + '/assets/Deck');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const ip = require('ip');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);

let player1 = null;
let player2 = null;

io.on('connection', onConnection);

function onConnection(sock){
    if (player1 == null) {
        player1 = sock;
    } else if (player2 == null) {
        player2 = sock;
    }

    log();

    sock.on('disconnect', () => {
        if (sock == player1) player1 = null;
        else if (sock == player2) player2 = null;

        log();
    });

    sock.on('client_connect', () => {
        sendAllImages(sock);
    });

    sock.on('client_event', () => {
        let deck = new Deck();
        let cards = [];
        for (let i = 0; i < 6; i++) {
            cards.push(deck.next());
        }
        sock.emit('server_response', cards);
    });
}

async function sendAllImages(socket){
    let srcs = fs.readdirSync(IMG_FOLDER);
    for (let i = 0; i < srcs.length; i++){
        let obj = {};
        obj[path.basename(srcs[i], IMG_EXT)] = fs.readFileSync(IMG_FOLDER + srcs[i]);
        socket.emit('client_connect_res', obj);
        console.log('sent: ' + srcs[i])
        await sleep(Math.random() * 75);
    }
}

function sleep(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function log() {
    console.log('====================');

    if (player1 == null) console.log('Player 1: Not Connected!');
    else console.log('Player 1: Connected!');

    if (player2 == null) console.log('Player 2: Not Connected!');
    else console.log('Player 2: Connected!');
}

server.on('error', (e) => {
    console.error('reeee: ' + e.message);
});

server.listen(port, () => {
    console.log(`Server running on ${ip.address()}:${port}`);
});

function addSocket(s) {
    if (getIndexOf(connectedSockets, s) < 0) connectedSockets.push(s);
}

function removeSocket(s) {
    let i = getIndexOf(connectedSockets, s);
    if (i > 0) connectedSockets.splice(i, 1);
}

function getIndexOf(arr, elem) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == elem) return i;
    }

    return -1;
}
