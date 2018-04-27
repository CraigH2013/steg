# steg
Hide text in sheet music

The idea of this project is to use steganography to conceal messages within sheet music files. I chose to use the [MusicXML](https://www.musicxml.com) data format for sheet music files.

Lots of sheet music in this format can be found at [Musescore](https://musescore.com)

## Install

Clone the repo and run `npm install`

## Usage

The tool is a node cli app so you run it using `node steg.js [options]`

**hide message**

Hiding the message `Hello World` in [Disney Medley Sheet Music](https://musescore.com/user/2716556/scores/5069648)

```text
$ node steg.js --file data/Disney_Medley.mxl --message "Hello World"

  Location Hash:  19a-37-19f-90b-55e-8e6-59e-5b6-51c-19f-a3f
  Signature Hash:  20:0790-64:0662-65:0af4-68:0910-6c:0454-6f:0890-72:0935-77:0893
```

**show message**

Showing the hidden message in the [Disney Medley Sheet Music](https://musescore.com/user/2716556/scores/5069648)

```text
$ node steg.js --file data/Disney_Medley.mxl --location 19a-37-19f-90b-55e-8e6-59e-5b6-51c-19f-a3f --signature 20:0790-64:0662-65:0af4-68:0910-6c:0454-6f:0890-72:0935-77:0893

  Message:  hello world
```
**help**

```text
$ node steg.js --help

  Usage: steg [options]

  Options:

    -V, --version            output the version number
    -f, --file <file>        MXL file to use for hiding/showing messages
    -m, --message <message>  The message to hide in the file
    -i, --case-insensitive   Treat upper/lower case letters as the same characters
    -l --location <hash>     Location hash
    -s, --signature <hash>   Signature hash
    -h, --help               output usage information
```
