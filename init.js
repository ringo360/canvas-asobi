/**
 * Sleep function
 * @param {number} ms 
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// canvas init
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.textAlign = "center";

//Balls
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = defineDx();
let dy = -1.5;
const ballRadius = 10;

//Paddle
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleSpeed = 4;

//Bricks
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];

//Key press detection
let rightPressed = false;
let leftPressed = false;

//Info
let score = 0;
let time = 0;

function defineDx() {
    const i = getRandomInteger(1, 2);
    if (i === 1) {
        return 1.5;
    }
    if (i === 2) {
        return -1.5;
    } else throw new Error(`Invalid Int: ${i}`);
}

//etc
let currColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
