const {
  BufferIOWriter
} = require('../..');

module.exports = {

  // NodeJS standard Buffer
  writeToLegacyBuffer: (values, numberOfBytesPerWord, writeFunction) => {
    const buf = Buffer.alloc(values.length * numberOfBytesPerWord);

    let offset = 0;
    values.forEach((val) => {
      writeFunction(buf, val, offset);
      offset += numberOfBytesPerWord;
    });
    return buf;
  },

  writeToBufferIO: (values, numberOfBytesPerWord, bigEndian, writeFunction) => {
    const BufferWriter = new BufferIOWriter(Buffer.alloc(values.length * numberOfBytesPerWord), {
      bigEndian
    });

    values.forEach((val) => {
      writeFunction(BufferWriter, val);
    });

    return BufferWriter.getBuffer();
  }
};