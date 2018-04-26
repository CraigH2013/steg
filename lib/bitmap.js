"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents all of the bits in the sheet of music and methods for
 * extracting data from it
 */
class BitMap {
    /**
     * Create a new Bit map from an array of bits
     *
     * @param bits the bits from the sheet music
     */
    constructor(bits) {
        this.bits = bits;
        this.size = bits.length;
        this.bitLookup = {};
        // fill the bit lookup object
        bits.forEach((bit, index) => {
            const sig = bit.getSignature();
            const lookup = this.bitLookup[sig];
            if (lookup) {
                lookup.locations.push(index);
                lookup.count += 1;
            }
            else {
                this.bitLookup[sig] = {
                    bit,
                    signature: sig,
                    count: 1,
                    locations: [index]
                };
            }
        });
    }
    /**
     * Get a bit at a specific location
     *
     * @param location the location to search
     */
    atLocation(location) {
        const sig = this.bits[location].getSignature();
        return this.bitLookup[sig];
    }
    /**
     * Query the bit map for bits that occur a number of times
     *
     * @param count number of times a bit shows up
     * @param exclude bits to exclude in the query
     */
    withCount(count, exclude = []) {
        const bits = [];
        Object.keys(this.bitLookup).forEach(sig => {
            const okay = exclude.filter(s => s === sig).length === 0;
            const bit = this.bitLookup[sig];
            if (bit.count === count && okay) {
                bits.push(bit);
            }
        });
        return bits;
    }
    /**
     * Query the bit map for bits that occur a number of times
     * or greater.
     *
     * @param count min number of times a bit shows up
     * @param exclude bits to exclude in the query
     */
    withCountGtEq(count, exclude = []) {
        const bits = [];
        Object.keys(this.bitLookup).forEach(sig => {
            const okay = exclude.filter(s => s === sig).length === 0;
            const bit = this.bitLookup[sig];
            if (bit.count >= count && okay) {
                bits.push(bit);
            }
        });
        return bits;
    }
}
exports.BitMap = BitMap;
