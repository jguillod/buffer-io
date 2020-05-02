const expect = require('chai').expect;

const {
  BufferIOWriter,
  BufferIOReader
} = require('../src');

const SEPSILON = 0.001;
const EPSILON = 0.0001;

describe('ieee754 – BufferIOReader#ieee754 and BufferIOReader#ieee754', () => {

  it('read float', function () {
    var val = 42.42;
    var buf = Buffer.alloc(4);
    var reader = new BufferIOReader(buf);

    buf.writeFloatLE(val, 0);
    var num = reader.ieee754({
      offset: 0,
      isLE: true,
      mLen: 23,
      nBytes: 4
    });

    expect(Math.abs(num - val) < EPSILON, `${num} - ${JSON.stringify(val)} > ±${EPSILON}`).to.be.true;
  });

  it('write float', function () {
    var val = 42.42;
    var buf = Buffer.alloc(4);
    var writer = new BufferIOWriter(buf);
    const options = {
      offset: 0,
      isLE: true,
      mLen: 23,
      nBytes: 4
    };
    writer.ieee754(val, options);
    var num = buf.readFloatLE(0);

    expect(Math.abs(num - val) < EPSILON, `${num} - ${val} > ±${EPSILON} (a)`).to.be.true;
    
    reader = new BufferIOReader(writer.getBuffer(), {
      bigEndian: false
    });
    num = reader.ieee754(options);
    expect(Math.abs(num - val) < EPSILON, `${num} - ${val} > ±${EPSILON} (b)`).to.be.true;
  });

  it('read double', function () {
    var value = 12345.123456789;
    var buf = Buffer.alloc(8);
    var reader = new BufferIOReader(buf);

    buf.writeDoubleLE(value, 0);
    var num = reader.ieee754({
      offset: 0,
      isLE: true,
      mLen: 52,
      nBytes: 8
    });

    expect(Math.abs(num - value) < EPSILON, `${num} - ${value} > ±${EPSILON}`).to.be.true;
  });

  it('write double', function () {
    var value = 12345.123456789;
    var buf = Buffer.alloc(8);
    var writer = new BufferIOWriter(buf);

    writer.ieee754(value, {
      offset: 0,
      isLE: true,
      mLen: 52,
      nBytes: 8
    });
    var num = buf.readDoubleLE(0);

    expect(Math.abs(num - value) < EPSILON, `${num} - ${value} > ±${EPSILON}`).to.be.true;
  });

  it('SFloat12_16 write and read', function () {
    const val = 2.3242,
      writer = new BufferIOWriter(Buffer.alloc(2), {
        bigEndian: true
      }),
      reader = new BufferIOReader(writer.getBuffer(), {
        bigEndian: true
      });
    writer.SFloat12_16BE(val);
    var num = reader.SFloat12_16BE();
    // console.log('∆ =>', Math.abs(num - val) < SEPSILON, Math.abs(num - val), num, val);
    // console.log('writer.buffer', writer.buffer);
    // console.log('reader.buffer', reader.buffer);

    expect(Math.abs(num - val) < SEPSILON, `${num} - ${val} > ±${SEPSILON}`).to.be.true;
    expect(Number(reader.offset)).to.equal(2);
    expect(Number(writer.offset)).to.equal(2);
    num = reader.SFloat12_16(0);
    expect(Math.abs(num - val) < SEPSILON, `${num} - ${val} > ±${SEPSILON}`).to.be.true;
  });

  it('SFloat12_16LE write and read', function () {
    const val = 2.45,
      writer = new BufferIOWriter(Buffer.alloc(5), {
        offset: 1,
        bigEndian: false
      }),
      reader = new BufferIOReader(writer.getBuffer());
    writer.SFloat12_16(val);
    var num = reader.SFloat12_16LE(1);
    // console.log('∆ =>', Math.abs(num - val) < SEPSILON, Math.abs(num - val), num, val);
    expect(Boolean(Math.abs(num - val) < SEPSILON), `${num} - ${val} > ±${SEPSILON}`).to.be.true;
    expect(Number(reader.offset)).to.equal(0);
    expect(Number(writer.offset)).to.equal(3);
    reader.offset = 1;
    num = reader.SFloat12_16LE();
    expect(Boolean(Math.abs(num - val) < SEPSILON), `${num} - ${val} > ±${SEPSILON}`).to.be.true;
    expect(Number(reader.offset)).to.equal(3);
  });

  it('Float24_32 write and read', function () {
    const val = 126.422234,
      offset = 2, // offset 2 is arbitrary
      writer = new BufferIOWriter(Buffer.alloc(30)),
      reader = new BufferIOReader(writer.getBuffer());
    writer.Float24_32BE(val, offset);
    var num = reader.Float24_32BE(offset);
    // console.log('∆ =>', Math.abs(num - val) < EPSILON, Math.abs(num - val), num, val);
    // console.log('writer.buffer', writer.buffer);
    // console.log('reader.buffer', reader.buffer);
    expect(Boolean(Math.abs(num - val) < EPSILON), `${num} - ${val} > ±${EPSILON}`).to.be.true;
    expect(Number(reader.offset)).to.equal(0);
    expect(Number(writer.offset)).to.equal(0);
    num = reader.Float24_32BE(offset);
    expect(Boolean(Math.abs(num - val) < EPSILON), `${num} - ${val} > ±${EPSILON}`).to.be.true;
  });

  it('Float24_32BE write and read', function () {
    const val = 2.45,
      offset = 1, // offset 2 is arbitrary
      writer = new BufferIOWriter(Buffer.alloc(5), {
        offset,
        bigEndian: true
      }),
      reader = new BufferIOReader(writer.getBuffer(), {
        bigEndian: true
      });
    writer.Float24_32BE(val);
    var num = reader.Float24_32(offset);
    // console.log('∆ =>', Math.abs(num - val) < EPSILON, Math.abs(num - val), num, val);
    expect(Boolean(Math.abs(num - val) < EPSILON), `${num} - ${val} > ±${EPSILON}`).to.be.true;
    expect(Number(reader.offset)).to.equal(0);
    expect(Number(writer.offset)).to.equal(4 + offset);
    reader.offset = offset;
    num = reader.Float24_32();
    expect(Boolean(Math.abs(num - val) < EPSILON), `${num} - ${val} > ±${EPSILON}`).to.be.true;
    expect(Number(reader.offset)).to.equal(4 + offset);
  });

});