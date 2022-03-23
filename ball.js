let points = 0
export {points}

export default class Ball {
    constructor(ballElem, ballSpeed, gameHeight, gameWidth) {
        this.ballElem = ballElem
        this.ballSpeed = ballSpeed
        this.gameHeight = gameHeight
        this.gameWidth = gameWidth
        this.reset()
    }
    get cx(){
        return parseFloat(this.ballElem.getAttribute('cx'))
    }
    set cx(value){
        this.ballElem.setAttribute('cx', value)
    }
    get cy(){
        return parseFloat(this.ballElem.getAttribute('cy'))
    }
    set cy(value){
        this.ballElem.setAttribute('cy', value)
    }
    get r() {
        return parseFloat(this.ballElem.getAttribute('r'))
    }
    ballObj() {
        return this.ballElem.getBBox()
    }

    reset () {
        this.handlePoints()
        this.cx = 640
        this.cy = 320
        this.direction = { cy:0 }
        while   (
            Math.abs(this.direction.cy) <= 0.4 || 
            Math.abs(this.direction.cy) >= 0.7
        ){
            const heading = randomNumberBetween(0, 2 * Math.PI)
            this.direction = { cy: Math.cos(heading), cx: Math.sin(heading)}
        }
        if (this.direction.cy < 0) this.direction.cy *= -1 // sending first ball down
    }
    update(delta, paddleObj, bricks) {
        if (delta > 200) delta = 16   // done for opportunity to pause game ?????
        this.cx += this.direction.cx * delta * this.ballSpeed
        this.cy += this.direction.cy * delta * this.ballSpeed
        const ballObj = this.ballObj()
        // part for checking boundaries
        if (this.cx - this.r < 0 || this.cx + this.r > this.gameWidth) {
          this.direction.cx *= -1
        }
        if (this.cy - this.r < 0) {
            this.direction.cy *= -1
        }
        // part for checking paddle
        if (this.checkPaddle(ballObj, paddleObj)) {
            this.direction.cy *= -1
        }
        // part for checking collisions with bricks
        if (bricks.length === 0) {
            alert("YOU WIN, CONGRATULATIONS!")

        } else {
            for (let i = 0 ; i < bricks.length; i++) {
                let brickObj = bricks[i].getBBox()
                if (this.checkBricks(ballObj, brickObj)) {
                    this.direction.cy *= -1
                    bricks[i].style.display = 'none'
                    this.ballSpeed += 0.01
                    points += 10
                }
            }
        }

    }
    checkPaddle (ballObj, paddleObj) {
        return ballObj.y + ballObj.height > paddleObj.y && 
        ballObj.y < paddleObj.y && 
        ballObj.x + this.r > paddleObj.x && 
        ballObj.x + this.r < paddleObj.x + paddleObj.width
    }

    checkBricks(ballObj, brickObj) {
            if (this.direction.cy < 0) {
                // ball going up
                return ballObj.y + ballObj.height > brickObj.y && 
                ballObj.y < brickObj.y + brickObj.height &&  
                ballObj.x > brickObj.x && 
                ballObj.x + ballObj.width < brickObj.x + brickObj.width
            }
            if (this.direction.cy > 0) {
                // ball going down
                return ballObj.y+ballObj.height > brickObj.y && 
                ballObj.y < brickObj.y + brickObj.height && 
                ballObj.x > brickObj.x && 
                ballObj.x + ballObj.width < brickObj.x + brickObj.width
            }
    }
    handlePoints() {
        if (points > 0) points -= 50
        if (points < 0) points = 0
    }
}

function randomNumberBetween(min, max){
    return Math.random() * (max - min) + min
}
