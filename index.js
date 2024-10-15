const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.textAlign = "center";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = defineDx();
let dy = -1.5;
const ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleSpeed = 4;

let rightPressed = false;
let leftPressed = false;

let score = 0;
let time = 0;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

let rainbow = `hsl(${Math.random() * 360}, 80%, 60%)`;
async function RandomColor() {
    setInterval(async () => {
        rainbow = `hsl(${Math.random() * 360}, 80%, 60%)`;
        // console.log(rainbow)
    }, 100);
}

async function BonusItem() {
    const n = getRandomInteger(1, 5);
    if (n === 1) {
        return getRandomItem();
    } else return getRandomItem();
}

async function getRandomItem() {
    const n = getRandomInteger(1, 2);
    if (n === 1) {
        callNotification(`Paddle width changed!`);
        paddleWidth = getRandomInteger(60, 85);
    }
    if (n === 2) {
        callNotification(`Ball and Paddle speed decreased!`);
        speedDown();
    }
}

function defineDx() {
    const i = getRandomInteger(1, 2);
    if (i === 1) {
        return 1.5;
    }
    if (i === 2) {
        return -1.5;
    } else throw new Error(`Invalid Int: ${i}`);
}

function getRandomInteger(minValue, maxValue) {
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}

let currColor = `hsl(${Math.random() * 360}, 80%, 60%)`;

async function changeColor() {
    currColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
}
async function speedUp() {
    if (dx < 0) {
        dx = dx - 0.1;
    } else {
        dx = dx + 0.1;
    }
    if (dy < 0) {
        dy = dy - 0.1;
    } else {
        dy = dy + 0.1;
    }
    paddleSpeed = paddleSpeed + 0.1;
}
async function speedDown() {
    if (dx < 0) {
        dx = dx + 0.1;
    } else {
        dx = dx - 0.1;
    }
    if (dy < 0) {
        dy = dy + 0.1;
    } else {
        dy = dy - 0.1;
    }
    paddleSpeed = paddleSpeed - 0.1;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    //ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 60%)`;
    ctx.fillStyle = currColor;
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    //ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 60%)`;
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawInfo();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(Timer);
            clearInterval(interval); // Needed for Chrome to end game
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }

    x += dx;
    y += dy;
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX =
                    c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY =
                    r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                //ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 60%)`;
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    BonusItem();
                    score++;
                    speedUp();
                    changeColor();
                    if (score === brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                        clearInterval(Timer);
                        clearInterval(interval); // Needed for Chrome to end game
                    }
                }
            }
        }
    }
}

function drawInfo() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(
        `Score: ${score} | You playing for ${time} seconds`,
        canvas.width / 2,
        20,
    );
}

async function drawNotification(str) {
    //
}

async function callNotification(str, time = 3) {
    console.log("Calling");
    const interval = setInterval(async () => {
        // console.log('Called...')
        ctx.font = "16px Arial";
        ctx.fillStyle = rainbow;
        ctx.fillText(str, canvas.width / 2, canvas.height / 2);
    }, 1);
    await sleep(time * 1000);
    clearInterval(interval);
}
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

RandomColor();

const Timer = setInterval(async () => {
    time++;
}, 1000);

const interval = setInterval(draw, 10);
