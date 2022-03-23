import Ball, { points as score } from './ball.js'
import InputHandler from './input.js'
import Paddle from './paddle.js'

let ballSpeed = 0.3
let attempts = 3
let lastTime, secondsPassed, fps, rafID
let state = {
    pressedKeys: {
      left: false,
      right: false,
    },
    controlKeys : {
        r: false,  // restart
        s: false,   // start
        p: false    // pause
    }
}

/*
to do:
- handle win case
- handle loose game case(all 3 attempts gone)
- find the way to reduce ball speed after reseting game
- score like separate svg
*/


const game = document.getElementById('game')
const gameWindowHeight = game.getAttribute('height')
const gameWindowWidth = game.getAttribute('width')
const ball = new Ball(document.getElementById('ball'), ballSpeed, gameWindowHeight, gameWindowWidth)
const paddle = new Paddle(document.getElementById('platform'), gameWindowWidth)
const bricks = Array.from(document.getElementsByClassName('brick'))
const framesNmbr = document.getElementById('fps')

const infoText = Array.from(document.getElementsByClassName('infoText'))
const pauseText = Array.from(document.getElementsByClassName('pauseText'))
const infoBoard = document.getElementById('infoBoard')


new InputHandler(state)

const gameLoop = (timestamp) => {
    document.getElementById('score').innerHTML = 'score: ' + score
    document.getElementById('attempts').innerHTML = 'attempts: ' + attempts
    if (lastTime != null){
        showFps(timestamp)
        const delta = timestamp - lastTime
        paddle.update(delta, state)
        ball.update(delta, paddle.paddleObj(), bricks)
        if (isLose()) handleLose() 
    }
    lastTime = timestamp
    rafID = window.requestAnimationFrame(gameLoop)
    if (attempts === 0) gameOver()

}

const isLose = () => {
    return ball.cy-ball.r > gameWindowHeight
}

const handleLose = () => {
    attempts--
    document.getElementById('attempts').innerHTML = 'attempts: ' + attempts
    ball.reset()
    paddle.reset()
}

const gameOver = () => {
    ball.reset()
    paddle.reset()
    cancelAnimationFrame(rafID)
    ballSpeed = 0.3
}

const showFps = (timestamp) => {
    secondsPassed = (timestamp - lastTime) / 1000
    fps = Math.round(1 / secondsPassed)
    framesNmbr.innerHTML = ''
    framesNmbr.append('fps: ' + fps)
}

const resetGame = () => {
    cancelAnimationFrame(rafID)
    infoBoard.style.display = 'inline'
    infoText.forEach(el =>{
        el.style.display = 'inline'
    })
    ballSpeed = 0.3
    attempts = 3
    ball.reset()
    paddle.reset()
    bricks.forEach(brick => {
        brick.style.display = 'inline'
    })
    pauseText.forEach(el => {
        el.style.display = 'none'
    })
    state.controlKeys.p = false
    state.controlKeys.r = false
    state.controlKeys.s = false
}


document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 's' :
            if(!state.controlKeys.s) {
                infoBoard.style.display = 'none'
                infoText.forEach(el =>{
                    el.style.display = 'none'
                })
                pauseText.forEach(el => {
                    el.style.display = 'none'
                })
                window.requestAnimationFrame(gameLoop)
                state.controlKeys.s = true
                state.controlKeys.p = true
            }
        break
        case 'p':
            if(state.controlKeys.p) {
                infoBoard.style.display = 'inline'
                pauseText.forEach(text => {
                    text.style.display = 'inline'
                })
                document.getElementById
                cancelAnimationFrame(rafID)
                state.controlKeys.s = false
            }
        break
        case 'r':
            resetGame()
        break
    }
})