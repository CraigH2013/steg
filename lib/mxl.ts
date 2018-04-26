import * as JSZip from "jszip";
import { DOMParser } from "xmldom";

/**
 * Retreive the container data from a compressed .mxl data file
 *
 * @param zip jszip instance being used to decompress data
 * @param data data to retrieve container from
 */
async function getContainer(zip: JSZip, data: Buffer) {
  await zip.loadAsync(data);
  return zip.file("META-INF/container.xml").async("text");
}

/**
 * Get the root file of a .mxl file
 *
 * @param zip jszip instance being used to decompress data
 * @param container container object in compressed data file
 */
async function getRootFile(zip: JSZip, container: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(container, "text/xml");
  const rootFile = doc
    .getElementsByTagName("rootfile")[0]
    .getAttribute("full-path");
  return zip.file(rootFile).async("text");
}

/**
 * Uncompress the .mxl file
 * @param data the data to uncompress
 */
export async function uncompressFileData(data: Buffer) {
  const zip = new JSZip();

  const container = await getContainer(zip, data);
  const rootFile = await getRootFile(zip, container);

  return rootFile;
}
