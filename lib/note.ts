import { Pitch } from "./pitch";

/**
 * Basic data expected in a note
 */
export interface Note {
  /**
   * The duration of the note
   */
  duration: number;

  /**
   * How many divisions per duration
   */
  divisions: number;
}

/**
 * A rest note
 */
export interface Rested extends Note {
  rest: boolean;
}

/**
 * A note with a pitch
 */
export interface Pitched extends Note {
  /**
   * The pitch of the note
   */
  pitch: Pitch;

  /**
   * Whether or not the note is apart of a chord
   */
  chord: boolean;
}

/**
 * All possible values for the note
 */
export interface NoteUnion extends Rested, Pitched {}

/**
 * A note that can be represented in numeric form
 */
export abstract class NoteSignature implements NoteUnion {
  pitch: Pitch;
  chord: boolean;
  rest: boolean;
  duration: number;
  divisions: number;

  public abstract getSignature(): string;
}
