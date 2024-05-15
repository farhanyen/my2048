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
    emptyCells = []
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


// Tests

function testSlideLine() {
    let grid = new Grid()

    let line = grid.slideLine([2,2,2,2])
    let expected = [4,4,0,0]
    console.assert(arrEquals(line,expected), `line:${line} expected:${expected}`)

    line = grid.slideLine([2,0,4,4])
    expected = [2,8,0,0]
    console.assert(arrEquals(line,expected), `line:${line} expected:${expected}`)

    line = grid.slideLine([2,0,0,2])
    expected = [4,0,0,0]
    console.assert(arrEquals(line,expected), `line:${line} expected:${expected}`)

    line = grid.slideLine([2,4,2,0])
    expected = [2,4,2,0]
    console.assert(arrEquals(line,expected), `line:${line} expected:${expected}`)

    line = grid.slideLine([0,0,0,2])
    expected = [2,0,0,0]
    console.assert(arrEquals(line,expected), `line:${line} expected:${expected}`)
}


function testSlideGrid() {
    let grid, cells, expected;

    grid = new Grid([
        [2, 2, 0, 2],
        [2, 2, 2, 2],
        [4, 0, 0, 4],
        [8, 8, 8, 8]
    ]);

    // Test case 1: Slide left
    cells = grid.slideGrid('l');
    expected = [
        [4, 2, 0, 0],
        [4, 4, 0, 0],
        [8, 0, 0, 0],
        [16, 16, 0, 0]
    ];
    console.assert(arr2DEquals(cells, expected), `Test case 1 failed. cells:${JSON.stringify(cells)} expected:${JSON.stringify(expected)}`);

    // Test case 2: Slide right
    cells = grid.slideGrid('r');
    expected = [
        [0, 0, 2, 4],
        [0, 0, 4, 4],
        [0, 0, 0, 8],
        [0, 0, 16, 16]
    ];
    console.assert(arr2DEquals(cells, expected), `Test case 2 failed. cells:${JSON.stringify(cells)} expected:${JSON.stringify(expected)}`);

    // Test case 3: Slide up
    cells = grid.slideGrid('u');
    expected = [
        [4, 4, 2, 4],
        [4, 8, 8, 4],
        [8, 0, 0, 8],
        [0, 0, 0, 0]
    ];
    console.assert(arr2DEquals(cells, expected), `Test case 3 failed. cells:${JSON.stringify(cells)} expected:${JSON.stringify(expected)}`);

    // Test case 4: Slide down
    cells = grid.slideGrid('d');
    expected = [
        [0, 0, 0, 0],
        [4, 0, 0, 4],
        [4, 4, 2, 4],
        [8, 8, 8, 8]
    ];
    console.assert(arr2DEquals(cells, expected), `Test case 4 failed. cells:${JSON.stringify(cells)} expected:${JSON.stringify(expected)}`);
}

function testIsMoveAvailable() {
    let grid, res;

    grid = new Grid([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2]
    ]);

    // Test case 1: Slide left
    res = grid.isMoveAvailable()
    console.assert(res == false, `Test case failed. cells:${stringify2DArray(grid.cells)} res: ${res}`);

}

testSlideLine()
testSlideGrid()
testIsMoveAvailable()




