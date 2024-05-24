const { Grid} = require('./grid');

function GameManager() {
    this.grid = new Grid()
    this.inputManager = new KeyboardInputManager()
    this.inputManager.on("move", this.move.bind(this))
    this.inputManager.on("restart", this.restart.bind(this))
    
    this.gameOver = false
    console.log('game launched')
    this.grid.printCells()
}

GameManager.prototype.move = function(dir) {
    if (this.gameOver) {
        console.log("Game is over")
        return
    }

    this.grid.executeMove(dir)
    this.grid.printCells()
    if (!this.grid.isMoveAvailable()) {
        console.log("game over")
        this.gameOver = true
    }
}

GameManager.prototype.restart = function() {
    this.grid.resetCells()
}

let gm = new GameManager()