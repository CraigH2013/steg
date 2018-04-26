/**
 * The letter value of a note
 */
export enum Step {
  REST,
  A,
  B,
  C,
  D,
  E,
  F,
  G
}

/**
 * The altered value of a note
 */
export enum Alter {
  REST,
  NATURAL,
  FLAT,
  SHARP
}

/**
 * Complete pitch of the note
 */
export interface Pitch {
  step: Step;
  alter: Alter;
  octave: number;
}
