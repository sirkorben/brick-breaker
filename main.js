import Ball, { points as score} from './pkg/ball.js'
import InputHandler from './pkg/input.js'
import Paddle from './pkg/paddle.js'

const game = document.getElementById('game')
const gameWindowHeight = game.getAttribute('height')
const gameWindowWidth = game.getAttribute('width')
const framesNmbr = document.getElementById('FPS')
const timer = document.getElementById('timer')
const infoText = Array.from(document.getElementsByClassName('infoText'))
const pauseText = Array.from(document.getElementsByClassName('pauseText'))
const winText = Array.from(document.getElementsByClassName('winText'))
const loseText = Array.from(document.getElementsByClassName('loseText'))
const infoBoard = document.getElementById('infoBoard')
const pauseBoard = document.getElementById('pauseBoard')
const loseBoard = document.getElementById('loseBoard')
const winBoard = document.getElementById('winBoard')

let gameOverBool = false
let ballSpeed = 0.4
let attempts = 3
let timerSeconds = 0
let timerMinutes = 0
let lastTime, secondsPassed, fps, rafID, avarageDelta
let state = {
    pressedKeys: {
      left: false,
      right: false,
    },
    controlKeys : {
        r: false,   // restart
        s: false,   // start
        p: false,   // pause
        y: false,   // yes
        n: false,    // no
    },
    attempts : {
        1: 'one',
        2: 'second',
        3: 'third'

    }
}

const ball = new Ball(document.getElementById('ball'), ballSpeed, gameWindowHeight, gameWindowWidth)
const paddle = new Paddle(document.getElementById('platform'), gameWindowWidth)
const bricks = Array.from(document.getElementsByClassName('brick'))

new InputHandler(state)

const gameLoop = (timestamp) => {
    document.getElementById('score').innerHTML = ': '+score
    document.getElementById('lives').innerHTML = ': '+attempts
   
    if (lastTime != null){
        // reassigning lastTime if game was paused
        lastTime = showFps(timestamp, lastTime)
        const delta = timestamp - lastTime
        avarageDelta = delta
        paddle.update(delta, state)
        ball.update(delta, paddle.paddleObj(), bricks)
    }
    if (ballDown()) {
        handleBallDown()
        if (attempts === 0) {
            gameOver()
            return
        }
    } 
    if (bricks.every((item) => item.style.display === "none")) {
        winCase()
    } else {
        lastTime = timestamp
        rafID = window.requestAnimationFrame(gameLoop)
    }
}

const showFps = (timestamp, lastTime) => {
    if (timestamp - lastTime > 5 * avarageDelta) {
        lastTime = timestamp - avarageDelta
    }
    secondsPassed = (timestamp - lastTime) / 1000
    fps = Math.round(1 / secondsPassed)
    framesNmbr.innerHTML = ': ' + fps + ' fps'
    timerHandler(secondsPassed)
    return lastTime
}

const timerHandler = (secondsPassed) => {
    timerSeconds +=secondsPassed
    let secondToPrint
    let minuteToPrint
    if (Math.round(timerSeconds) != 0 && Math.round(timerSeconds) % 60 === 0) {
        timerMinutes++
        timerSeconds = 0
    }
    if (Math.round(timerSeconds) <= 9 ) {
        secondToPrint = '0' + Math.round(timerSeconds)
    } else {
        secondToPrint = Math.round(timerSeconds)
    }
    if (timerMinutes <= 9) {
        minuteToPrint = '0' + timerMinutes
    } else {
        minuteToPrint = timerMinutes
    }
        timer.innerHTML = ': ' + minuteToPrint +':' + secondToPrint
}

const winCase = () => {
    winText[1].innerHTML = `Your score: ${score}`
    winBoard.style.display = 'inline'
    winText.forEach(el => el.style.display = 'inline')
    state.controlKeys.p = false
    state.controlKeys.y = true
    state.controlKeys.n = true
}

const ballDown = () => {
    return ball.cy-ball.r > gameWindowHeight
}

const handleBallDown = () => {
    attempts--
    ball.reset()
    paddle.reset()
}

const gameOver = () => {
    cancelAnimationFrame(rafID)
    loseBoard.style.display = 'inline'
    loseText.forEach(el => el.style.display = 'inline')
    state.controlKeys.p = false
    state.controlKeys.y = true
    state.controlKeys.n = true
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 's' :
            if(!state.controlKeys.s) {
                startGamePressed()
            }
            break
        case 'p':
            if(state.controlKeys.p) {
                pauseGamePressed()
            }
            break
        case 'r':
            restartGame()
            break
        case 'y':
            if (state.controlKeys.y) {
                resetGameConditions()
                window.requestAnimationFrame(gameLoop)
                state.controlKeys.s = true
                state.controlKeys.p = true
            }
            break
        case 'n':
            if (state.controlKeys.n) {
                resetGameConditions()
            }
            break
    }
})

const startGamePressed = () => {
    infoBoard.style.display = 'none'
    pauseBoard.style.display = 'none'
    loseBoard.style.display = 'none'
    winBoard.style.display = 'none'
    infoText.forEach(el => el.style.display = 'none')
    pauseText.forEach(el => {
        el.style.display = 'none'
    })
    window.requestAnimationFrame(gameLoop)
    state.controlKeys.s = true
    state.controlKeys.p = true
}

const pauseGamePressed = () => {
    pauseBoard.style.display = 'inline'
    pauseText.forEach(text => text.style.display = 'inline')
    cancelAnimationFrame(rafID)
    state.controlKeys.s = false
}

const restartGame = () => {
    document.location.reload()
}

const resetGameConditions = () => {
    timerSeconds = 0
    timerMinutes = 0
    attempts = 3
    ball.reset(gameOverBool = true, ballSpeed)
    paddle.reset()
    bricks.forEach(brick => brick.style.display = 'inline')
    infoBoard.style.display = 'none'
    loseBoard.style.display = 'none'
    winBoard.style.display = 'none'
    loseText.forEach(el => el.style.display = 'none')
    winText.forEach(el => el.style.display = 'none')
    state.controlKeys.y = false
    state.controlKeys.n = false
    state.controlKeys.p = false
    state.controlKeys.r = false
    state.controlKeys.s = false
}