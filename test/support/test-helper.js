const {CleverBufferWriter} = require('../../');

exports.writeToStupidBuffer = (values, numberOfBytesPerWord, writeFunction) => {
  const buf = Buffer.alloc(values.length*numberOfBytesPerWord);

  let offset = 0;
  values.forEach((val) => {
    writeFunction(buf, val, offset);
    offset += numberOfBytesPerWord;
  });
  return buf;
};

exports.writeToCleverBuffer = (values, numberOfBytesPerWord, bigEndian, writeFunction) => {
  const cleverBufferWriter = new CleverBufferWriter(Buffer.alloc(values.length*numberOfBytesPerWord), {bigEndian});

  values.forEach((val) => {
    writeFunction(cleverBufferWriter, val);
  });

  return cleverBufferWriter.getBuffer();
};
