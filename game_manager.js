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
    console.log(this.grid.availableMoves())
    if (!this.grid.availableMoves().length) {
        console.log("game over")
        this.gameOver = true
        this.gameResult = loss
    }
}

GameManager.prototype.restart = function() {
    this.grid.resetCells()
}

let gm = new GameManager()