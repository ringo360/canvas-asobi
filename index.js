for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

async function changeColor() {
    currColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
}

let rainbow = `hsl(${Math.random() * 360}, 80%, 60%)`;
async function RandomColor() {
    setInterval(async () => {
        rainbow = `hsl(${Math.random() * 360}, 80%, 60%)`;
        // console.log(rainbow)
    }, 250);
}

async function BonusItem() {
    const n = getRandomInteger(1, 5);
    console.log(n)
    if (n === 1) {
        return getRandomItem();
    } else return;
}

async function getRandomItem() {
    const n = getRandomInteger(1, 2);
    if (n === 1) {
        callNotification(`Paddle width changed!`);
        paddleWidth = getRandomInteger(45, 125);
    }
    if (n === 2) {
        callNotification(`Ball and Paddle speed decreased!`);
        speedDown();
    }
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
    drawStr();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (Math.round(y + dy) > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            console.log(`Height: ${canvas.height} Radius: ${ballRadius} y: ${y} dy: ${dy} H-B: ${canvas.height - ballRadius} y+dy: ${Math.round(y + dy)}`)
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

let notifystr = "";
let notifycount = 0;
function drawStr() {
    //info
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(
        `Score: ${score} | You playing for ${time} seconds`,
        canvas.width / 2,
        20,
    );
    //notification
    ctx.font = "16px Arial";
    ctx.fillStyle = rainbow;
    // ctx.fillStyle = "#0095DD";
    ctx.fillText(notifystr, canvas.width / 2, canvas.height / 2);
}

async function callNotification(str, time = 3) {
    console.log("Calling");
    notifystr = str;
    notifycount++;
    console.log(`increased: ${notifycount}`);
    await sleep(time * 1000);
    notifycount--;
    console.log(`decreased: ${notifycount}`);
    if (notifycount === 0) {
        notifystr = "";
    }
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

const params = new URLSearchParams(window.location.search)

if (params.get('cheat') === 'true') {
    console.log('Cheat Enabled!')
    paddleX = 0
    clearInterval(Timer)
    time = Infinity;
    setInterval(async () => {
        paddleWidth = 1024
        dx = 0;
        dy = 0;
    },10)
    document.getElementById('myCanvas').addEventListener("mousemove", function(e){
        x = e.offsetX
        y = e.offsetY
        console.log(x, y)
    })
}

const interval = setInterval(draw, 10);
