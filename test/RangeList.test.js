const RangeList = require('../RangeList')

const rl = new RangeList()

describe('RangeList add test.', () => {
    const mocksForAdd = [
        [[1, 5], [[1, 5]]],
        [[10, 20], [[1, 5], [10, 20]]],
        [[20, 20], [[1, 5], [10, 20]]],
        [[20, 21], [[1, 5], [10, 21]]],
        [[2, 4], [[1, 5], [10, 21]]],
        [[3, 8], [[1, 8], [10, 21]]]
    ]
    for (const mock of mocksForAdd) {
        const [input, expected] = mock;
        test(`RangeList.add(${input}) should be [${expected.join('], [')}]`, () => {
            const values = rl.add(input).values();
            expect(values).toEqual(expect.arrayContaining(expected));
        })
    }
})

describe('RangeList remove test.', () => {
    const mocksForRemove = [
        [[10, 10], [[1, 8], [10, 21]]],
        [[10, 11], [[1, 8], [11, 21]]],
        [[15, 17], [[1, 8], [11, 15], [17, 21]]],
        [[3, 19], [[1, 3], [19, 21]]]
    ]
    for (const mock of mocksForRemove) {
        const [input, expected] = mock;
        test(`RangeList.remove(${input}) should be [${expected.join('], [')}]`, () => {
            const values = rl.remove(input).values();
            expect(values).toEqual(expect.arrayContaining(expected));
        })
    }
})

describe('Test more for RangeList add', () => {
    const mocksForAdd = [
        [[19, 19], [[1, 3], [19, 21]]],
        [[10, 19], [[1, 3], [10, 21]]],
        [[-10, 0], [[-10, 0], [1, 3], [10, 21]]],
        [[3, 10], [[-10, 0], [1, 21]]],
        [[1, 5], [[-10, 0], [1, 21]]],
        [[43, 22], [[-10, 0], [1, 21], [22, 43]]],
        [['abc', NaN], Error],
        ['abc', Error]
    ]
    for (const mock of mocksForAdd) {
        const [input, expected] = mock;
        if (typeof expected === 'function') {
            test(`RangeList.add(${input}) should throw Error`, () => {
                expect(() => { rl.add(input) }).toThrow();
            })
        } else {
            test(`RangeList.add(${input}) should be [${expected.join('], [')}]`, () => {
                const values = rl.add(input).values();
                expect(values).toEqual(expect.arrayContaining(expected));
            })
        }
    }
})

