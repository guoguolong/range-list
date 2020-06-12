const data = Symbol('data')
const MODE_REPLACE = 'MODE_REPLACE'
const MODE_INSERT = 'MODE_INSERT'

/**
* Check whether range include valid numbers and return normalized array.
* @param {Array<number>} range - Array of two integers.
* @returns {Array<number>} - Array of two normalized integers.
* @throws {Error} - Will throw an error if range didn't include valid numbers.
*/
function normalizeRange(range) {
    let hasError = false;
    if (!Array.isArray(range) || range.length < 2) hasError = true;
    if (!hasError) {
        let [begin, end] = range
        if (typeof begin === 'number' && !isNaN(begin)) {
            if (typeof end === 'number' && !isNaN(end)) {
                if (begin > end) {
                    [begin, end] = [end, begin]
                }
                return [begin, end];
            }
        }
        hasError = true;
    }
    if (hasError) {
        throw new Error('Please input two valid numbers.')
    }
}

module.exports = class RangeList {
    constructor() {
        this[data] = []
    }
    /**
    * Adds a range to the list
    * @param {Array<number>} range - Array of two integers that specify
   beginning and end of range.
    */
    add(range) {
        let [begin, end] = normalizeRange(range)
        let beginPosToErased = false, endPosToErased = false
        let mode = MODE_INSERT

        for (let key in this[data]) {
            const [dBegin, dEnd] = this[data][key]
            const expandedRanges = [begin, end, dBegin, dEnd]
            beginPosToErased = (beginPosToErased === false) ? key : beginPosToErased
            if (begin <= dEnd && end >= dBegin) { // intersection of the range and the current item
                mode = MODE_REPLACE
                endPosToErased = key;
                [begin, end] = [Math.min(...expandedRanges), Math.max(...expandedRanges)]
            } else if (end < (dBegin)) { // should be inserted on the left of the current item
                endPosToErased = endPosToErased || key
                break
            } else {  // should be inserted on the right of the current item, continue next loop
                beginPosToErased = false
            }
        }

        if (!beginPosToErased) {
            beginPosToErased = endPosToErased = this[data].length
        }

        let lengthToErased = endPosToErased - beginPosToErased
        lengthToErased = (mode === MODE_REPLACE) ? ++lengthToErased : lengthToErased

        this[data].splice(beginPosToErased, lengthToErased, [begin, end])
        return this;
    }

    /**
     * Removes a range from the list
     * @param {Array<number>} range - Array of two integers that specify
    beginning and end of range.
     */
    remove(range) {
        let [begin, end] = range
        let beginPosToErased = false, endPosToErased = false
        if (begin == end) return this

        const toCreatedItems = []
        for (let key in this[data]) {
            const [dBegin, dEnd] = this[data][key]
            if (end <= dBegin) break
            if (begin >= dEnd) continue

            beginPosToErased = (beginPosToErased === false) ? key : beginPosToErased
            endPosToErased = key

            if (end >= dEnd) {
                if (begin > dBegin && begin < dEnd) {  // across dEnd
                    toCreatedItems.push([dBegin, begin])
                }
            } else if (end > dBegin && end < dEnd) {
                if (begin > dBegin) { // between dBegin and dEnd.
                    toCreatedItems.push([dBegin, begin])
                    toCreatedItems.push([end, dEnd])
                } else { // across dBegin
                    toCreatedItems.push([end, dEnd])
                }
            }
        }
        if (beginPosToErased) {
            this[data].splice(beginPosToErased, endPosToErased - beginPosToErased + 1, ...toCreatedItems)
        }
        return this;
    }
    /**
    * Prints out the list of ranges in the range list
    */
    print() {
        console.log(this[data].map(ele => {
            return `[${ele.join(', ')})`
        }))
    }

    /**
    * @returns {Array<Array<number>} - return values of RangeList instantce
    */
    values() {
        return this[data]
    }
}