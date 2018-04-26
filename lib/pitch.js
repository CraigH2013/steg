"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The letter value of a note
 */
var Step;
(function (Step) {
    Step[Step["REST"] = 0] = "REST";
    Step[Step["A"] = 1] = "A";
    Step[Step["B"] = 2] = "B";
    Step[Step["C"] = 3] = "C";
    Step[Step["D"] = 4] = "D";
    Step[Step["E"] = 5] = "E";
    Step[Step["F"] = 6] = "F";
    Step[Step["G"] = 7] = "G";
})(Step = exports.Step || (exports.Step = {}));
/**
 * The altered value of a note
 */
var Alter;
(function (Alter) {
    Alter[Alter["REST"] = 0] = "REST";
    Alter[Alter["NATURAL"] = 1] = "NATURAL";
    Alter[Alter["FLAT"] = 2] = "FLAT";
    Alter[Alter["SHARP"] = 3] = "SHARP";
})(Alter = exports.Alter || (exports.Alter = {}));
