const sock = io();
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const CARD_AMOUNT = 53;

let isGame = false;
let cards = [];

canvas.addEventListener('click', () => {
    sock.emit('canvas_click_req');
});

sock.on('canvas_click_res', (response) => {
    console.log(response);
});

sock.on('client_connect_res', (imgRes) => {
    let key = Object.keys(imgRes)[0];
    let val = Object.values(imgRes)[0];

    let data = new Uint8Array(val);
    let blob = new Blob([ data ], { type: 'image/png' });
    let url = URL.createObjectURL(blob);

    let img = new Image();
    img.id = key;
    img.src = url;
    img.onload = (e) => {
        cards.push(new Card(e.target.id, e.target));
        drawLoading(cards.length, CARD_AMOUNT);

        if (cards.length == CARD_AMOUNT) {
            isGame = true;
            draw();
        }
    };
    img.onerror = (e) => {
        console.log(e);
    };
});

function loadingBarSection() {
    let width = canvas.width * 0.8;
    let height = canvas.height * 0.25;
    return { x: (canvas.width - width) * 0.5, y: (canvas.height - height) * 0.5, w: width, h: height };
}
function loadingTextSection() {
    let yPos = (loadingBarSection().y + loadingBarSection().h) + canvas.height / 10;
    return { x: canvas.width * 0.5, y: yPos };
}

function currentPlayerSection() {
    return { x: 0, y: canvas.height * 0.75, w: canvas.width, h: canvas.height * 0.25 };
}
function otherPlayerSection() {
    return { x: 0, y: 0, w: canvas.width, h: canvas.height * 0.25 };
}
function deckSection() {
    return { x: canvas.width * 0.75, y: canvas.height * 0.25, w: canvas.width * 0.25, h: canvas.height * 0.5 };
}
function tableSection() {
    return { x: 0, y: canvas.height * 0.25, w: canvas.width * 0.75, h: canvas.height * 0.5 };
}

function imageSize() {
    if (canvas.width < canvas.height) {
        return canvas.width / 4;
    } else {
        return canvas.height / 4;
    }
}

function prepWindow() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.parentElement.clientWidth - 1;
    canvas.height = canvas.parentElement.clientHeight - 1;
}

function border({ x, y, w, h }, color, wid = 1) {
    context.strokeStyle = color;
    context.lineWidth = wid;
    context.strokeRect(x, y, w, h);
}

function drawLoading(done, total) {
    prepWindow();
    let barSec = loadingBarSection();
    let txtSec = loadingTextSection();

    context.fillStyle = 'red';
    context.fillRect(barSec.x, barSec.y, barSec.w, barSec.h);
    context.fillStyle = 'green';
    context.fillRect(barSec.x, barSec.y, barSec.w * (done / total), barSec.h);

    context.fillStyle = 'black';
    context.font = canvas.width / 20 + 'px sans-serif';
    context.textAlign = 'center';
    context.fillText(`Loaded: ${done} / ${total} Images`, txtSec.x, txtSec.y);
}

function draw() {
    prepWindow();

    let size = imageSize();
    cards.forEach((card) => {
        context.drawImage(card.getImg(), card.getX(), card.getY(), size, size);
    });

    drawOtherPlayerHand(otherPlayerSection());
    drawTableCards(tableSection());
    drawDeck(deckSection());
    drawCurrentPlayerHand(currentPlayerSection());

    function drawOtherPlayerHand({ x, y, w, h }) {
        border({ x, y, w, h }, 'red', 5);
    }

    function drawTableCards({ x, y, w, h }) {
        border({ x, y, w, h }, 'green', 5);
    }

    function drawDeck({ x, y, w, h }) {
        border({ x, y, w, h }, 'blue', 5);
    }

    function drawCurrentPlayerHand({ x, y, w, h }) {
        border({ x, y, w, h }, 'purple', 5);
    }
}

window.onresize = () => {
    if (isGame) draw();
};
window.onload = () => {
    sock.emit('client_connect');
};
