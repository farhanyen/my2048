function randomInt(max) {
   return Math.floor(Math.random()*max) 
}

function Grid(size, cells) {
    this.size = size
    if (this.size == null) 
        this.size = 4

    this.dirs = ['u', 'd', 'l', 'r']
    this.cells = cells
    if (this.cells == null) {
        this.resetCells()
    }
}

Grid.prototype.resetCells = function() {
    this.cells = this.empty()
    this.addStartTiles()
}

Grid.prototype.addRandomTile = function() {
    emptyCells = []
    for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
            let pos = {r:r, c:c}
            if (this.cellValue(pos) == 0) {
                emptyCells.push(pos)
            }
        }
    }

    let idx = randomInt(emptyCells.length)
    let targetPos = emptyCells[idx]
    this.setCellValue(targetPos, Math.random() < 0.9 ? 2:4)
}

Grid.prototype.addStartTiles = function() {
    for (let i = 0; i < 2; i++) {
        this.addRandomTile()
    }
}

Grid.prototype.empty = function() {
    cells = []
    for (r = 0; r < this.size; r++) {
        cells[r] = []
        for (c = 0; c < this.size; c++) {
            cells[r][c] = 0
        }
    }
    return cells
}

Grid.prototype.targetCellValue = function(cells, pos) {
    if (this.OOB(pos)) {
        console.log("Err OOB:", pos)
        return
    }
    return cells[pos.r][pos.c]
}

Grid.prototype.cellValue = function(pos) {
    return this.targetCellValue(this.cells, pos)
}


Grid.prototype.setTargetCellValue = function(cells, pos, val) {
    if (this.OOB(pos)) {
        console.log("Err OOB:", pos)
        return
    }
    cells[pos.r][pos.c] = val
}

Grid.prototype.setCellValue = function(pos, val) {
    this.setTargetCellValue(this.cells, pos, val)
}

Grid.prototype.stepPos = function(oldPos, dir) {
    let v = this.getVector(dir)
    let newPos = { r: oldPos.r + v.r, c: oldPos.c + v.c}
    return newPos
}

Grid.prototype.cellStep = function(oldPos, dir) {
    let newPos = this.stepPos(oldPos, dir)

    if (this.OOB(newPos)) {
        // console.log("OOB:", newPos)
        return false
    }

    if (this.cellValue(newPos) == 0) {
        this.setCellValue(newPos, this.cellValue(oldPos))
        this.setCellValue(oldPos, 0)
        return true
    }

    if (this.cellValue(newPos) == this.cellValue(oldPos) && !this.lastMerged) { 
        this.setCellValue(newPos, this.cellValue(newPos)*2)
        this.setCellValue(oldPos, 0)
        this.mergeMove = true
        return false
    }

    return false
}

Grid.prototype.moveCell = function(startPos, dir) {
    let pos = startPos
    this.mergeMove = false
    while(this.cellStep(pos, dir)) {
        pos = this.stepPos(pos, dir)
    }
    this.lastMerged = this.mergeMove
}

Grid.prototype.moveBlock = function(b, dir) {
    this.lastMerged = false
    switch(dir) {
        case 'u': {
            let c = b
            for(let r = 0; r < this.size; r++) {
                this.moveCell({r:r, c:c}, dir)
            }
            break;
        }
        case 'd': {
            let c = b
            for(let r = this.size-1; r >= 0; r--) {
                this.moveCell({r:r, c:c}, dir)
            }
            break;
        }
        case 'l': {
            let r = b
            for(let c = 0; c < this.size; c++) {
                this.moveCell({r:r, c:c}, dir)
            }
            break;
        }
        case 'r': {
            let r = b
            for(let c = this.size-1; c >= 0; c--) {
                this.moveCell({r:r, c:c}, dir)
            }
            break;
        }
    }
}

Grid.prototype.moveGrid = function(dir) {
    for (let b = 0; b < this.size; b++) {
        this.moveBlock(b, dir)
    }
}

Grid.prototype.executeMove = function (dir) {
    let cellsDeepCopy = deepCopy(this.cells)
    this.moveGrid(dir)

    if (!this.equals(cellsDeepCopy)) {
        this.addRandomTile()
    }
}

Grid.prototype.availableMoves = function() {
    availableMoves = []
    let cellsDeepCopy = deepCopy(this.cells)
    for (let dir of this.dirs) {
        this.moveGrid(dir)

        if (!this.equals(cellsDeepCopy)) {
            availableMoves.push(dir)
            this.cells = deepCopy(cellsDeepCopy)
        }
    }
    return availableMoves
}

Grid.prototype.getVector = function(dir) {
    let map = {
        'u': { r: -1, c: 0},
        'd': { r: 1, c: 0},
        'l': { r: 0, c: -1},
        'r': { r: 0, c: 1}
    }
    return map[dir]
}

Grid.prototype.OOB = function(pos) {
    return pos.r < 0 || pos.c < 0 || pos.r >= this.size || pos.c >= this.size
}

Grid.prototype.equals = function (cells) {
    for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
            if (this.cells[r][c] != cells[r][c]) {
                return false
            }
        }
    }
    return true
}

Grid.prototype.printCells = function() {
    console.log("[ " + this.cells.map(x => x.join(", ")).join(" ]\n[ ") + " ]")
}

function deepCopy(cells) {
    return JSON.parse(JSON.stringify(cells))
}

// Tests

function testMoveCell() {
    let grid = new Grid(
        4, [[2, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0]]
    )

    grid.lastMerged = false
    let dir = 'u'
    grid.moveCell({r:0, c:0}, dir)
    let expected = [[2, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0]]
    console.assert(grid.equals(expected), `dir: ${dir} expected: ${expected} actual: ${grid.cells}`)

    dir = 'u'
    grid.moveCell({r:1, c:0}, dir)
    expected = [[4, 0, 0, 0], [0, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0]]
    console.assert(grid.equals(expected), `dir: ${dir} expected: ${expected} actual: ${grid.cells}`)

    dir = 'u'
    grid.moveCell({r:2, c:0}, dir)
    expected = [[4, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0], [2, 0, 0, 0]]
    console.assert(grid.equals(expected), `dir: ${dir} expected: ${expected} actual: ${grid.cells}`)

    dir = 'u'
    grid.moveCell({r:3, c:0}, dir)
    expected = [[4, 0, 0, 0], [4, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    console.assert(grid.equals(expected), `dir: ${dir} expected: ${expected} actual: ${grid.cells}`)

    console.log("testMoveCell success")
}

function testMoveBlock() {
    let grid = new Grid(
        4, [[2, 0, 0, 0], [2, 0, 0, 0], [4, 0, 0, 0], [4, 0, 0, 0]]
    )
    
    let dir = 'u'
    grid.moveBlock(0, dir)
    let expected = [[4, 0, 0, 0], [8, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    console.assert(grid.equals(expected), `dir: ${dir} expected: ${expected} actual: ${grid.cells}`)
    console.log("testMoveBlock success")
}


function testMoveGrid() {
    let grid = new Grid(
        4, [[2, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0]]
    )
    cellsDeepCopy = deepCopy(grid.cells)
    let dir = 'u'
    grid.moveGrid(dir)
    
    let expected = [[4, 0, 0, 0], [4, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    console.assert(grid.equals(expected), `failed dir: ${dir} expected: ${expected} actual: ${grid.cells}`)

    grid.cells = deepCopy(cellsDeepCopy)
    dir = 'd'
    grid.moveGrid(dir)

    expected = [[0, 0, 0, 0], [0, 0, 0, 0], [4, 0, 0, 0], [4, 0, 0, 0]]
    console.assert(grid.equals(expected), `failed dir: ${dir} expected: ${expected} actual: ${grid.cells}`)

    grid.cells = deepCopy(cellsDeepCopy)
    dir = 'l'
    grid.moveGrid(dir)

    expected = [[2, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0]]
    console.assert(grid.equals(expected), `failed dir: ${dir} expected: ${expected} actual: ${grid.cells}`)

    grid.cells = deepCopy(cellsDeepCopy)
    dir = 'r'
    grid.moveGrid(dir)

    expected = [[0, 0, 0, 2], [0, 0, 0, 2], [0, 0, 0, 2], [0, 0, 0, 2]]
    console.assert(grid.equals(expected), `failed dir: ${dir} expected: ${expected} actual: ${grid.cells}`)

    console.log("testmoveGrid success")
}

function testPrintCells() {
    let grid = new Grid(
        4, [[16, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0], [2, 0, 0, 0]]
    )
    grid.printCells()
}

// testMoveCell()
// testMoveBlock()
// testMoveGrid()
// testPrintCells()

