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

    reset (gameOverCondition = false, bSpeed) {
        if (gameOverCondition) {
            points = 0
            this.ballSpeed = bSpeed
        } else {
            this.handlePoints()
        }

        this.cx = 640
        this.cy = 650
        this.direction = { cy:0 }
        while   (
            Math.abs(this.direction.cy) <= 0.4 || 
            Math.abs(this.direction.cy) >= 0.7
        ){
            const heading = randomNumberBetween(0, 2 * Math.PI)
            this.direction = { cy: Math.cos(heading), cx: Math.sin(heading)}
        }
    }
    update(delta, paddleObj, bricks) {
        const ballObj = this.ballObj()
        const ballTop       = ballObj.y
        const ballBottom    = ballObj.y + ballObj.height
        const ballLeft      = ballObj.x
        const ballRight     = ballObj.x + ballObj.width

        // part for checking boundaries
        if (ballObj.x <= 0 || ballObj.x + ballObj.width >= this.gameWidth) {
          this.direction.cx *= -1
        }
        if (ballObj.y <= 0) {
            this.direction.cy *= -1
        }
        // part for checking paddle
        if (this.checkPaddle(ballObj, paddleObj)) {
            if(ballObj.y + ballObj.height + 50 > paddleObj.y){ 
                if(ballObj.x + ballObj.width - paddleObj.x < 20) {     // ball on the left side of paddle
                    this.cx -= 20
                    this.direction.cx *= -1 
                    this.direction.cy *= -1
                } else if(paddleObj.x + paddleObj.width - ballObj.x <= 20) { // ball on the right side of paddle 
                    this.cx += 20
                    this.direction.cx *= -1
                    this.direction.cy *= -1 
                } 
            }
            this.direction.cy *= -1
        }
        for (let i = 0 ; i < bricks.length; i++) {
            let brickObj = bricks[i].getBBox()
            const brickTop      = brickObj.y
            const brickBottom   = brickObj.y + brickObj.height
            const brickLeft     = brickObj.x
            const brickRight    = brickObj.x + brickObj.width

            if(
                ballBottom < brickTop || 
                ballLeft > brickRight || 
                ballTop > brickBottom || 
                ballRight < brickLeft) {
                    continue
                }
                bricks[i].style.display = 'none'
                this.ballSpeed += 0.01
                points += 10       
                       

                // bottom
                if(Math.abs(ballTop - brickBottom) <= 10 && this.direction.cy < 0 && 
                    ((ballRight - brickLeft >= Math.abs(brickBottom - ballTop)) 
                    || (brickRight - ballLeft >= brickBottom - ballTop)))
                { this.direction.cy *= -1
                    // top
                } else if (Math.abs(brickTop - ballBottom) <=10 && this.direction.cy > 0 && 
                    ((ballRight - brickLeft >= ballBottom - brickTop) 
                    || (brickRight - ballLeft > ballBottom - brickTop))){
                    this.direction.cy *= -1 
                // left 
                } else if (ballRight >= brickLeft && this.direction.cx > 0 && 
                    ((brickBottom - ballTop > Math.abs(ballRight - brickLeft)) 
                    || (ballBottom - brickTop > ballRight - brickLeft))){
                    this.direction.cx *= -1
                // right
                } else this.direction.cx *= -1
        }
        this.cx += this.direction.cx * delta * this.ballSpeed
        this.cy += this.direction.cy * delta * this.ballSpeed
    }
    checkPaddle (ballObj, paddleObj) {
        return (
            ballObj.x                       <= paddleObj.x + paddleObj.width  && // BALL LEFT   rect1.left <= rect2.right
            ballObj.x + ballObj.width       >= paddleObj.x &&                    // BALL RIGHT   rect1.right >= rect2.left
            ballObj.y                       <= paddleObj.y + paddleObj.height && // BALL TOP    rect1.top <= rect2.bottom
            ballObj.y + ballObj.height      >= paddleObj.y                       // BALL BOTTOM rect1.bottom >= rect2.top
        )
    }
    handlePoints() {
        if (points > 0) points -= 30
        if (points < 0) points = 0
    }
}

function randomNumberBetween(min, max){
    return Math.random() * (max - min) + min
}