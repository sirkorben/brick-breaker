class InputHandler {
    constructor(state) {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'd' :
                    state.pressedKeys.right = true
                break
                case 'a':
                    state.pressedKeys.left = true

            }
        })
        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'd' :
                    state.pressedKeys.right = false
                break
                case 'a' :
                    state.pressedKeys.left = false
            }
        })
    }
}

export default InputHandler