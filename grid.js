function Grid(cells = null) {
    this.dirs = ['u', 'd', 'l', 'r']
    this.cells = cells
    if (this.cells == null) {
        this.resetCells()
    }
}

Grid.prototype.resetCells = function() {
    this.cells = Array(4).fill(0).map(() => Array(4).fill(0))
    this.addRandomTile()
    this.addRandomTile()
}

Grid.prototype.addRandomTile = function() {
    let emptyCells = []
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (this.cells[r][c] == 0) {
                emptyCells.push({r, c})
            }
        }
    }

    if (emptyCells.length > 0) {
        let {r, c} = emptyCells[Math.floor(Math.random()*emptyCells.length)]
        this.cells[r][c] = Math.random() < 0.9 ? 2 : 4
    }
}

Grid.prototype.slideLine = function(l) {
    let arr = l.filter(x => x != 0)
    let newLine = []
    for (let i = 0; i < arr.length; i++) {
        if (i < arr.length-1 && arr[i] == arr[i+1]) {
            newLine.push(arr[i]*2)
            i++
        } else {
            newLine.push(arr[i])
        }
    }

    while (newLine.length < 4) {
        newLine.push(0)
    }
    return newLine
}

Grid.prototype.slideGrid = function (dir) {
    let cells = this.cells.map(row => row.slice())
    switch(dir)  {
        case "l":
            for (let i = 0; i < 4; i++) {
                cells[i] = this.slideLine(cells[i])
            }
            break;
        case "r":
            for (let i = 0; i < 4; i++) {
                cells[i] = this.slideLine(cells[i].reverse()).reverse()
            }
            break;
        case "u":
            for (let c = 0; c < 4; c++) {
                let col = []
                for (let r = 0; r < 4; r++) {
                    col.push(cells[r][c])
                }
                col = this.slideLine(col)
                for (let r = 0; r < 4; r++) {
                    cells[r][c] = col[r]
                }
            }
            break;
        case "d":
            for (let c = 0; c < 4; c++) {
                let col = []
                for (let r = 0; r < 4; r++) {
                    col.push(cells[r][c])
                }
                col = this.slideLine(col.reverse()).reverse()
                for (let r = 0; r < 4; r++) {
                    cells[r][c] = col[r]
                }
            }
            break;
    }
    return cells
}


Grid.prototype.executeMove = function (dir) {
    let cells = this.slideGrid(dir)

    if (!arr2DEquals(cells, this.cells)) {
        this.cells = cells
        this.addRandomTile()
    }
}

Grid.prototype.isMoveAvailable = function () {
    for (let dir of this.dirs) {
        let newCells = this.slideGrid(dir)
        if (!arr2DEquals(newCells, this.cells)) {
            return true
        }
    }
    return false
}

Grid.prototype.has2048 = function () {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (this.cells[r][c] == 2048) {
                return true
            }
        }
    }

    return false
}

Grid.prototype.printCells = function() {
    console.log(stringify2DArray(this.cells))
}

function arrEquals(arr1, arr2) {
    if (arr1.length != arr2.length) {
        return false
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            return false
        }
    }
    return true
}
function arr2DEquals(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (!arrEquals(arr1[i], arr2[i])) {
            return false;
        }
    }
    return true;
}
function stringify2DArray(array) {
    return "\n" + array.map(row => row.join(' ')).join('\n') + "\n";
}

module.exports = {
    Grid,
    arrEquals,
    arr2DEquals,
    stringify2DArray
};