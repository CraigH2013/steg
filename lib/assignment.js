"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leftPad = require("left-pad");
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Represents an assignment of characters to bits
 */
class Assignment {
    /**
     * Creates a new assignment
     * If no message is given then it will be assumed that the assignment should
     * come from previously created hashes
     *
     * @param bitMap Holds all of the bits from the mxl file
     * @param message The message to hide in the mxl file
     * @param lower should lowercase the message first
     */
    constructor(bitMap, message, lower = true) {
        this.bitMap = bitMap;
        this.message = message;
        this.lower = lower;
        this.messageStats = {};
        // create basic stats about the message like how many times each character
        // shows up
        if (message) {
            this.buildMessageStats();
        }
        this.assignmentPool = {};
        this.bitLocations = [];
    }
    /**
     * Get the character assigned to the bit at a given location
     *
     * @param location the locations to get the character at
     */
    getChar(location) {
        const signature = this.bitMap.atLocation(location).signature;
        const ascii = this.reverseLookup[signature];
        return String.fromCharCode(ascii);
    }
    /**
     * Get the message from the bitmap
     * Make sure to have first run the assign mehtod
     */
    interpret() {
        const message = [];
        const locations = this.bitLocations;
        if (locations.length === 0) {
            throw new Error("Locations were not assigned");
        }
        locations.forEach(loc => {
            message.push(this.getChar(loc));
        });
        return message.join("");
    }
    /**
     * Create basic stats from a messagelike how many times a
     * character shows up
     */
    buildMessageStats() {
        if (this.lower) {
            this.message = this.message.toLowerCase();
        }
        this.message.split("").forEach(char => {
            const charCode = char.charCodeAt(0);
            if (this.messageStats[charCode]) {
                this.messageStats[charCode].count += 1;
            }
            else {
                this.messageStats[charCode] = {
                    count: 1,
                    char
                };
            }
        });
    }
    /**
     * Determine the ascii to bit spotlight assignment from the signature hash
     *
     * @param signatureHash the signature hash previously created from an assignment
     */
    parseSignatureHash(signatureHash) {
        const newPool = {};
        const newReverse = {};
        signatureHash.split("-").forEach(assignment => {
            const [asciiInHex, signature] = assignment.split(":");
            const ascii = parseInt(asciiInHex, 16);
            newPool[ascii] = this.bitMap.bitLookup[signature];
            newReverse[signature] = ascii;
        });
        this.reverseLookup = newReverse;
        return newPool;
    }
    /**
     * Create the assignment pool
     *
     * @param signatureHash the signature hash previously created from an assignment
     */
    buildAssignmentPool(signatureHash) {
        if (signatureHash) {
            this.assignmentPool = this.parseSignatureHash(signatureHash);
        }
        else {
            this.assignmentPool = {};
            this.reverseLookup = {};
            const assigned = [];
            Object.keys(this.messageStats)
                .sort((a, b) => {
                return this.messageStats[b].count - this.messageStats[a].count;
            })
                .forEach(charCode => {
                const minCount = this.messageStats[charCode].count;
                const available = this.bitMap.withCountGtEq(minCount, assigned);
                const select = random(0, available.length - 1);
                const spotlight = available[select];
                this.assignmentPool[+charCode] = spotlight;
                this.reverseLookup[spotlight.signature] = +charCode;
                assigned.push(spotlight.signature);
            });
        }
    }
    /**
     * Assign locations for the message given or from a location hash
     *
     * @param locationHash the previously created hash of locations
     */
    assignLocations(locationHash) {
        if (locationHash) {
            this.bitLocations = locationHash.split("-").map(loc => parseInt(loc, 16));
        }
        else {
            this.message.split("").forEach(char => {
                const charCode = char.charCodeAt(0);
                const locations = this.assignmentPool[charCode].locations;
                const select = random(0, locations.length - 1);
                this.bitLocations.push(locations[select]);
            });
        }
    }
    /**
     * Assign characters to bits and encoded locations
     *
     * @param signatureHash the signature hash previously created from an assignment
     * @param locationHash the previously created hash of locations
     */
    assign(signatureHash, locationHash) {
        if (!this.message) {
            if (!signatureHash || !locationHash) {
                throw new Error(`Assignment was not initialized with a message therefore
          \`signatureHash\` and \`locationHash\` must both be given`);
            }
        }
        this.buildAssignmentPool(signatureHash);
        this.assignLocations(locationHash);
    }
    /**
     * Generate a hash from the encoded locations
     */
    getLocationHash() {
        return this.bitLocations
            .map(loc => {
            return loc.toString(16);
        })
            .join("-");
    }
    /**
     * Generate a hash from the ascci to bits mapping
     */
    getSignatureHash() {
        return Object.keys(this.assignmentPool)
            .map(ascii => {
            const spotlight = this.assignmentPool[ascii];
            return `${leftPad((+ascii).toString(16), 2, "0")}:${spotlight.signature}`;
        })
            .join("-");
    }
}
exports.Assignment = Assignment;
