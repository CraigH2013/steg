const program = require("commander");
const path = require("path");
const fs = require("fs");
const process = require("process");

const { uncompressFileData, parse, Bit, BitMap, Assignment } = require("./lib");

program
  .version("0.1.0")
  .option("-f, --file <file>", "MXL file to use for hiding/showing messages")
  .option("-m, --message <message>", "The message to hide in the file")
  .option(
    "-i, --case-insensitive",
    "Treat upper/lower case letters as the same characters"
  )
  .option("-l --location <hash>", "Location hash")
  .option("-s, --signature <hash>", "Signature hash")
  .parse(process.argv);

let run = true;

if (!program.file) {
  console.log("Error: --file flag required");
  run = false;
}

if (!program.message) {
  if (!program.signature) {
    console.log("Error: --signature flag is required if --message is not set");
    run = false;
  }
  if (!program.location) {
    console.log("Error: --location flag is required if --message is not set");
    run = false;
  }
} else {
  if (program.signature) {
    console.log("Warn: --signature flag given even though --message was set");
  }
  if (program.location) {
    console.log("Warn: --location flag given even though --message was set");
  }
}

async function runProgram(fileData) {
  // uncompress the .mxl file into normal xml
  const data = await uncompressFileData(fileData);

  // get the notes data by parsing the xml data
  const notes = await parse(data);

  // convert the notes data into a series of bits
  const bits = notes.map(n => new Bit(n));

  // create a bitmap from the notes data
  const bitMap = new BitMap(bits);

  if (program.message) {
    // generate a new assignment and produce hash values
    const assignment = new Assignment(
      bitMap,
      program.message,
      program.caseInsensitive
    );
    assignment.assign();
    const locHash = assignment.getLocationHash();
    const sigHash = assignment.getSignatureHash();

    console.log();
    console.log("Location Hash: ", locHash);
    console.log("Signature Hash: ", sigHash);
  } else {
    const assignment = new Assignment(bitMap);
    assignment.assign(program.signature, program.location);
    const message = assignment.interpret();

    console.log();
    console.log("Message: ", message);
  }
}

if (!run) {
  console.log();
  console.log("Invalid arguments given. Use --help option");
} else {
  const filePath = path.resolve(program.file);
  const compressedData = fs.readFileSync(filePath);
  runProgram(compressedData);
}
