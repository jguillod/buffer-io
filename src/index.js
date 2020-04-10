const BufferIOReader = require("./buffer-reader"),
    BufferIOWriter = require("./buffer-writer"),
    types = BufferIOReader.types; // require("./buffer-common").types;

module.exports = {
    BufferIOReader,
    BufferIOWriter,
    types
};