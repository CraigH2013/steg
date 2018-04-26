import * as fs from "fs";
import * as path from "path";
import { uncompressFileData } from "../mxl";
import { Step, Alter } from "../pitch";
import { parse } from "../parser";
import { Bit } from "../bit";
import { BitMap } from "../bitmap";
import { Assignment } from "../assignment";

it("works", async () => {
  const fileName = "Disney_Medley.mxl";
  const filePath = path.resolve(__dirname, "../..", "data", fileName);

  const compressedData = fs.readFileSync(filePath);
  const data = await uncompressFileData(compressedData);

  const notes = await parse(data);

  const bits = notes.map(n => new Bit(n));

  const bitMap = new BitMap(bits);

  const assignment = new Assignment(bitMap, "test message");

  assignment.assign();

  const locHash = assignment.getLocationHash();
  const sigHash = assignment.getSignatureHash();

  const testAssign = new Assignment(bitMap);

  testAssign.assign(sigHash, locHash);

  console.log(testAssign.interpret());
});
