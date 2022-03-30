class Paddle {
    constructor(paddleElem, gameWindowWidth) {
        this.paddleElem = paddleElem
        this.gameWindowWidth = gameWindowWidth
        this.paddleWidth = parseFloat(this.paddleElem.getAttribute('width'))
        this.reset()
    }
    get x() {
        return parseFloat(this.paddleElem.getAttribute('x'))
    }
    get y() {
        return parseFloat(this.paddleElem.getAttribute('y'))
    }
    set x(value) {
        this.paddleElem.setAttribute('x', value)
    }
    reset() {
        this.x = 540
    }
    paddleObj() {
        return this.paddleElem.getBBox()
    }
    update(delta, state) {
        if (state.pressedKeys.left) {
            this.moveLeft(delta)
        }
        if (state.pressedKeys.right) {
            this.moveRight(delta)
        }
    }
    moveLeft(delta){
        this.x -= delta
        if (this.x <= 0) {
        this.x = 5
        }
    }
    moveRight(delta){
        this.x += delta
        if (this.x>= this.gameWindowWidth - this.paddleWidth ) {
            this.x = this.gameWindowWidth - 5 - this.paddleWidth
        }
    }
}

export default Paddle