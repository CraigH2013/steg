"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSZip = require("jszip");
const xmldom_1 = require("xmldom");
/**
 * Retreive the container data from a compressed .mxl data file
 *
 * @param zip jszip instance being used to decompress data
 * @param data data to retrieve container from
 */
function getContainer(zip, data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield zip.loadAsync(data);
        return zip.file("META-INF/container.xml").async("text");
    });
}
/**
 * Get the root file of a .mxl file
 *
 * @param zip jszip instance being used to decompress data
 * @param container container object in compressed data file
 */
function getRootFile(zip, container) {
    return __awaiter(this, void 0, void 0, function* () {
        const parser = new xmldom_1.DOMParser();
        const doc = parser.parseFromString(container, "text/xml");
        const rootFile = doc
            .getElementsByTagName("rootfile")[0]
            .getAttribute("full-path");
        return zip.file(rootFile).async("text");
    });
}
/**
 * Uncompress the .mxl file
 * @param data the data to uncompress
 */
function uncompressFileData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const zip = new JSZip();
        const container = yield getContainer(zip, data);
        const rootFile = yield getRootFile(zip, container);
        return rootFile;
    });
}
exports.uncompressFileData = uncompressFileData;
