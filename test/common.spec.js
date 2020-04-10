const expect = require('chai').expect;
const {
  BufferIOReader
} = require('..'); // `${SRC}/buffer-reader`);

describe('BufferIOCommon', () => {
  const buf = Buffer.from([0xa1, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9]);

  it('can slice from the current offset until the end', () => {
    const bufferIO = new BufferIOReader(buf);
    expect(bufferIO.UInt8()).to.eql(0xa1);
    expect(bufferIO.UInt8()).to.eql(0xa2);
    expect(bufferIO.slice().toString('hex')).to.eql('a3a4a5a6a7a8a9');
  });

  it('can slice from a given index (after the offset) until the end', () => {
    const bufferIO = new BufferIOReader(buf);
    expect(bufferIO.UInt8()).to.eql(0xa1);
    expect(bufferIO.UInt8()).to.eql(0xa2);
    expect(bufferIO.slice(2).toString('hex')).to.eql('a5a6a7a8a9');
  });

  it('can slice from between two indexes (after the offset)', () => {
    const bufferIO = new BufferIOReader(buf);
    expect(bufferIO.UInt8()).to.eql(0xa1);
    expect(bufferIO.UInt8()).to.eql(0xa2);
    expect(bufferIO.slice(2, 5).toString('hex')).to.eql('a5a6a7');
  });

  it('cannot slice past the end', () => {
    const bufferIO = new BufferIOReader(buf);
    expect(bufferIO.UInt8()).to.eql(0xa1);
    expect(bufferIO.UInt8()).to.eql(0xa2);
    expect(bufferIO.slice(2, 20).toString('hex')).to.eql('a5a6a7a8a9');
  });

  it('#eof should detect end of buffer correctly', () => {
    const reader = new BufferIOReader(buf);
    expect(reader.UInt8()).to.eql(0xa1);
    expect(reader.eob()).to.be.false;
    reader.offset = reader.length;
    expect(reader.eob()).to.be.true;
  });

  it('#length returns the correct buffer length', () => {
    const reader = new BufferIOReader(buf);
    expect(reader.length).to.equal(buf.length);
  });

  it('#isRangeError detect if bytes with size at offset fits', () => {
    const reader = new BufferIOReader(buf);
    expect(reader.isRangeError(reader.length, 0)).to.be.false;
    expect(reader.isRangeError(reader.length-5, reader.length-5)).to.be.false;
    expect(reader.isRangeError(reader.length+1, reader.length)).to.be.true;
    expect(reader.isRangeError(1, reader.length)).to.be.true;
  });
});