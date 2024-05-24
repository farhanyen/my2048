const { Grid, arrEquals, arr2DEquals, stringify2DArray } = require('./grid');

expect.extend({
    toMatchGrid(received, expected) {
        const pass = arr2DEquals(received, expected);
        if (pass) {
            return {
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${stringify2DArray(received)} to equal ${stringify2DArray(expected)}`,
                pass: false,
            };
        }
    },
    toMatchLine(received, expected) {
        const pass = arrEquals(received, expected);
        if (pass) {
            return {
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to equal ${expected}`,
                pass: false,
            };
        }
    }
});

describe('Grid', () => {
    let grid;

    describe('slideLine', () => {
        beforeAll(() => {
            grid = new Grid();
        });

        it('merges tiles correctly', () => {
            expect(grid.slideLine([2, 2, 2, 2])).toMatchLine([4, 4, 0, 0]);
            expect(grid.slideLine([2, 0, 4, 4])).toMatchLine([2, 8, 0, 0]);
            expect(grid.slideLine([2, 0, 0, 2])).toMatchLine([4, 0, 0, 0]);
            expect(grid.slideLine([2, 4, 2, 0])).toMatchLine([2, 4, 2, 0]);
            expect(grid.slideLine([0, 0, 0, 2])).toMatchLine([2, 0, 0, 0]);
        });
    });

    describe('slideGrid', () => {
        beforeAll(() => {
            grid = new Grid([
                [2, 2, 0, 2],
                [2, 2, 2, 2],
                [4, 0, 0, 4],
                [8, 8, 8, 8]
            ]);
        });

        it('handles movement to the left correctly', () => {
            expect(grid.slideGrid('l')).toMatchGrid([
                [4, 2, 0, 0],
                [4, 4, 0, 0],
                [8, 0, 0, 0],
                [16, 16, 0, 0]
            ]);
        });

        it('handles movement to the right correctly', () => {
            expect(grid.slideGrid('r')).toMatchGrid([
                [0, 0, 2, 4],
                [0, 0, 4, 4],
                [0, 0, 0, 8],
                [0, 0, 16, 16]
            ]);
        });

        it('handles movement upwards correctly', () => {
            expect(grid.slideGrid('u')).toMatchGrid([
                [4, 4, 2, 4],
                [4, 8, 8, 4],
                [8, 0, 0, 8],
                [0, 0, 0, 0]
            ]);
        });

        it('handles movement downwards correctly', () => {
            expect(grid.slideGrid('d')).toMatchGrid([
                [0, 0, 0, 0],
                [4, 0, 0, 4],
                [4, 4, 2, 4],
                [8, 8, 8, 8]
            ]);
        });
    });
});
