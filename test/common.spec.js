const should = require('should');
const CleverBufferReader = require(`${SRC}/clever-buffer-reader`);

describe('CleverBufferCommon', () => {
  const buf = Buffer.from([ 0xa1,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,0xa8,0xa9 ]);

  it('can slice from the current offset until the end', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.UInt8().should.eql(0xa1);
    cleverBuffer.UInt8().should.eql(0xa2);
    cleverBuffer.slice().toString('hex').should.eql('a3a4a5a6a7a8a9');
  });

  it('can slice from a given index (after the offset) until the end', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.UInt8().should.eql(0xa1);
    cleverBuffer.UInt8().should.eql(0xa2);
    cleverBuffer.slice(2).toString('hex').should.eql('a5a6a7a8a9');
  });

  it('can slice from between two indexes (after the offset)', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.UInt8().should.eql(0xa1);
    cleverBuffer.UInt8().should.eql(0xa2);
    cleverBuffer.slice(2, 5).toString('hex').should.eql('a5a6a7');
  });

  it('cannot slice past the end', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.UInt8().should.eql(0xa1);
    cleverBuffer.UInt8().should.eql(0xa2);
    cleverBuffer.slice(2, 20).toString('hex').should.eql('a5a6a7a8a9');
  });
});
