import Ball, { points as score } from './ball.js'
import InputHandler from './input.js'
import Paddle from './paddle.js'

const game = document.getElementById('game')
const gameWindowHeight = game.getAttribute('height')
const gameWindowWidth = game.getAttribute('width')
const framesNmbr = document.getElementById('fps')
const timer = document.getElementById('timer')
const infoText = Array.from(document.getElementsByClassName('infoText'))
const pauseText = Array.from(document.getElementsByClassName('pauseText'))
const winText = Array.from(document.getElementsByClassName('winText'))
const loseText = Array.from(document.getElementsByClassName('loseText'))
const infoBoard = document.getElementById('infoBoard')

let gameOverBool = false
let ballSpeed = 0.4
let attempts = 3
let timeCounter = 0
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
    document.getElementById('score').innerHTML = 'score: ' + score
    document.getElementById('attempts').innerHTML = 'attempts: ' + attempts
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
    framesNmbr.innerHTML = 'fps: ' + fps
    timeCounter +=secondsPassed
    timer.innerHTML = 'time : ' + Math.round(timeCounter)
    return lastTime
}

const winCase = () => {
    const withAttemt = 4 - attempts
    winText[1].innerHTML = `you scored ${score} points, in ${state.attempts[withAttemt]} attempt`
    infoBoard.style.display = 'inline'
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
    infoBoard.style.display = 'inline'
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
    infoText.forEach(el => el.style.display = 'none')
    pauseText.forEach(el => {
        el.style.display = 'none'
    })
    window.requestAnimationFrame(gameLoop)
    state.controlKeys.s = true
    state.controlKeys.p = true
}

const pauseGamePressed = () => {
    infoBoard.style.display = 'inline'
    pauseText.forEach(text => text.style.display = 'inline')
    cancelAnimationFrame(rafID)
    state.controlKeys.s = false
}

const restartGame = () => {
    document.location.reload()
}

const resetGameConditions = () => {
    timeCounter = 0
    attempts = 3
    ball.reset(gameOverBool = true, ballSpeed)
    paddle.reset()
    bricks.forEach(brick => brick.style.display = 'inline')
    infoBoard.style.display = 'none'
    loseText.forEach(el => el.style.display = 'none')
    winText.forEach(el => el.style.display = 'none')
    state.controlKeys.y = false
    state.controlKeys.n = false
    state.controlKeys.p = false
    state.controlKeys.r = false
    state.controlKeys.s = false
}