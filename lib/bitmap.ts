import { Bit } from "./bit";

/**
 * Information relating to the Bit data of each note
 */
export interface BitSpotlight {
  bit: Bit;
  signature: string;
  count: number;
  locations: number[];
}

/**
 * Lookup for bits from signatures
 */
export interface BitLookup {
  [sig: string]: BitSpotlight;
}

/**
 * Represents all of the bits in the sheet of music and methods for
 * extracting data from it
 */
export class BitMap {
  /**
   * Lookup of all the bits in the map
   */
  readonly bitLookup: BitLookup;

  /**
   * Number of bits in the map
   */
  readonly size: number;

  /**
   * Create a new Bit map from an array of bits
   *
   * @param bits the bits from the sheet music
   */
  constructor(private bits: Bit[]) {
    this.size = bits.length;

    this.bitLookup = {};

    // fill the bit lookup object
    bits.forEach((bit, index) => {
      const sig = bit.getSignature();
      const lookup = this.bitLookup[sig];

      if (lookup) {
        lookup.locations.push(index);
        lookup.count += 1;
      } else {
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
  public atLocation(location: number) {
    const sig = this.bits[location].getSignature();
    return this.bitLookup[sig];
  }

  /**
   * Query the bit map for bits that occur a number of times
   *
   * @param count number of times a bit shows up
   * @param exclude bits to exclude in the query
   */
  public withCount(count: number, exclude = []): BitSpotlight[] {
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
  public withCountGtEq(count: number, exclude = []): BitSpotlight[] {
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
