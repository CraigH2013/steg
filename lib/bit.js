"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const note_1 = require("./note");
const leftPad = require("left-pad");
/**
 * Represents a codable note in the sheet music
 */
class Bit extends note_1.NoteSignature {
    /**
     * Create a new Bit from note data
     *
     * @param note a note in the sheet music
     */
    constructor(note) {
        super();
        this.rest = note.rest;
        this.chord = note.chord;
        this.divisions = note.divisions;
        this.duration = note.duration;
        this.pitch = note.pitch;
    }
    /**
     * Get the binary representation of the note's pitch data
     */
    getPitchMask() {
        const { octave, step, alter } = this.pitch;
        const octaveMask = leftPad(octave.toString(2), 4, "0");
        const stepMask = leftPad(step.toString(2), 3, "0");
        const alterMask = leftPad(alter.toString(2), 2, "0");
        return octaveMask + stepMask + alterMask;
    }
    /**
     * Get the binary representation of the note's length data
     */
    getLengthMask() {
        const length = Math.round(this.duration / this.divisions);
        if (length > 7) {
            throw new Error("Not enought bits available for length");
        }
        return leftPad(length.toString(2), 3, "0");
    }
    /**
     * Get the entire binary representation of the note
     */
    getMask() {
        const pitchMask = this.getPitchMask();
        const lengthMask = this.getLengthMask();
        const chordMask = this.chord ? "1" : "0";
        return pitchMask + lengthMask + chordMask;
    }
    /**
     * Create a hash from the binary rperesentation of the note data
     */
    getSignature() {
        return leftPad(parseInt(this.getMask(), 2).toString(16), 4, "0");
    }
    /**
     * Create a bit from a signature instead of note data
     *
     * @param sig the signature to create from
     */
    static fromSignature(sig) {
        // entire mask
        const mask = leftPad(parseInt(sig, 16).toString(2), 13, "0");
        // pitch section 111111111
        const pitchMask = mask.substr(0, 9);
        // octave section 111100000
        const octaveMask = pitchMask.substr(0, 4);
        // step section 000011100
        const stepMask = pitchMask.substr(4, 3);
        // alter section 000000011
        const alterMask = pitchMask.substr(7, 2);
        // parse values from their masks
        const octave = parseInt(octaveMask, 2);
        const step = parseInt(stepMask, 2);
        const alter = parseInt(alterMask, 2);
        // get the remaining data of the data
        const rest = parseInt(pitchMask, 2) === 0 ? true : false;
        const length = parseInt(mask.substr(9, 3), 2);
        const chord = +mask[mask.length - 1] === 0 ? false : true;
        // construct the bit
        return new Bit({
            duration: length,
            divisions: 1,
            chord: chord,
            pitch: {
                octave,
                step,
                alter
            },
            rest
        });
    }
}
exports.Bit = Bit;
