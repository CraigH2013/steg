import * as xml2js from "xml2js";
import { NoteUnion } from "./note";
import { Alter, Step, Pitch } from "./pitch";
import * as fs from "fs";

/**
 * Convert XML data to JSON for easier manipulation and parsing
 *
 * @param xml xml data to convert
 */
function xmlToJson(xml: string) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Get the altered value from the pitch
 *
 * @param pitch the pitch value of the note
 */
function getAlter(pitch) {
  const alter = pitch.alter && +pitch.alter[0];

  if (alter === undefined || alter === null) {
    return Alter.NATURAL;
  }

  if (alter === 0) {
    return Alter.NATURAL;
  } else if (alter > 0) {
    return Alter.SHARP;
  } else {
    return Alter.FLAT;
  }
}

/**
 * Get the ENUM of the step data
 *
 * @param step the step data of the note
 */
function getStep(step: string) {
  switch (step.toUpperCase()) {
    case "A":
      return Step.A;
    case "B":
      return Step.B;
    case "C":
      return Step.C;
    case "D":
      return Step.D;
    case "E":
      return Step.E;
    case "F":
      return Step.F;
    case "G":
      return Step.G;
  }
}

/**
 * Format the note data as a pitched value
 *
 * @param note the note data
 * @param divisions the measures division value
 * @param duration the duration of the note
 */
function getPitchedNote(note, divisions: number, duration: number): NoteUnion {
  const pitch = note.pitch[0];
  const chord = note.chord !== undefined ? true : false;
  const step = getStep(pitch.step[0]);
  const alter = getAlter(pitch);
  const octave = +pitch.octave[0];

  return {
    divisions,
    duration,
    chord,
    rest: false,
    pitch: {
      step,
      alter,
      octave
    }
  };
}

/**
 * Get the note as a rested value
 *
 * @param divisions the measures divsions
 * @param duration the duratoin of the note
 */
function getRestedNote(divisions: number, duration: number): NoteUnion {
  return {
    chord: false,
    pitch: {
      step: Step.REST,
      alter: Alter.REST,
      octave: 0
    },
    rest: true,
    divisions,
    duration
  };
}

/**
 * Parse the note data into a structured format
 *
 * @param note the note data to parse
 * @param divisions the divisions of the measure
 */
function parseNote(note, divisions: number): NoteUnion {
  const duration = +note.duration[0];

  if (note.rest) {
    return getRestedNote(divisions, duration);
  }

  return getPitchedNote(note, divisions, duration);
}

/**
 * Notes to parse into structured format
 *
 * @param notes notes to parse
 * @param divisions the divisons of the measure
 */
function parseNotes(notes, divisions: number) {
  return notes.map(note => parseNote(note, divisions));
}

/**
 * Get the divisions from the measure
 *
 * @param measure the measure to parse
 */
function getDivisions(measure) {
  const attrs = measure.attributes && measure.attributes[0];
  if (attrs) {
    const divisions = attrs.divisions;
    return divisions ? divisions[0] : null;
  }
  return null;
}

/**
 * Get all the notes in a set of measures
 *
 * @param measures measurtes to extract notes from
 */
function getNotes(measures) {
  let notes: NoteUnion[] = [];

  let divisions = null;
  for (let i = 0; i < measures.length; i++) {
    const measure = measures[i];
    divisions = getDivisions(measure) || divisions;

    if (divisions === null) {
      throw new Error(
        "A divisions value could not be found on the first measure"
      );
    }

    notes = notes.concat(parseNotes(measure.note, +divisions));
  }

  return notes;
}

/**
 * Get all the measures in a score. This will get measures from each part.
 *
 * @param score The score to get measures from
 */
function getMeasures(score) {
  const parts = score.part;
  return parts.reduce((all, part) => all.concat(part.measure || []), []);
}

/**
 * Parse a .mxl file into structured data
 *
 * @param data XML sheet music data to parse
 */
export async function parse(data: string) {
  const json = await xmlToJson(data);

  fs.writeFile("./data.json", JSON.stringify(json, null, 2), err => {
    if (err) throw err;
  });

  const score = json["score-partwise"];

  if (!score) {
    throw new Error("Cannot find `score-partwise` element");
  }

  const measures = getMeasures(score);
  const notes = getNotes(measures);

  return notes;
}
