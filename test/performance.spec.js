/* jshint "bigint": true */

const _ = require('lodash'),
  expect = require('chai').expect,
  Table = require('cli-table'),
  {
    BufferIOReader
  } = require('..');

// const BIG_BUFFER = Buffer.from([
//     0x45,0x58,0x50,0x45,0x43,0x54,0x45,0x44,0x20,0x52,0x45,0x54,0x55,0x52,0x4e,0x21,
//     0x52,0x45,0x54,0x55,0x52,0x4e,0x20,0x4f,0x46,0x20,0x24,0x32,0x2e,0x30,0x30,0x21,
//     0x45,0x58,0x50,0x45,0x43,0x54,0x45,0x44,0x20,0x52,0x45,0x54,0x55,0x52,0x4e,0x21,
//     0x52,0x45,0x54,0x55,0x52,0x4e,0x20,0x4f,0x46,0x20,0x24,0x32,0x2e,0x30,0x30,0x21,
//     0x45,0x58,0x50,0x45,0x43,0x54,0x45,0x44,0x20,0x52,0x45,0x54,0x55,0x52,0x4e,0x21,
//     0x52,0x45,0x54,0x55,0x52,0x4e,0x20,0x4f,0x46,0x20,0x24,0x32,0x2e,0x30,0x30,0x21
// ]);

describe('Performance', () => {

  const table = new Table({
    head: ['Operation', 'time (ms)'],
    colWidths: [30, 20]
  });

  const run = (name, op, count) => {
    const start = new Date();
    for (let n = 0, end1 = count, asc = 0 <= end1; asc ? n <= end1 : n >= end1; asc ? n++ : n--) {
      op();
    }
    const end = new Date();
    return table.push([`${name} * ${count}`, end - start]);
  };

  it('prints some performance figures', () => {
    run('Read UInt8', readUint8, 50000);
    run('Read BigUInt64', readString, 50000);
    run('Read String', readString, 50000);
    console.log('');
    console.log(table.toString());
  });
});


var readUint8 = () => {
  const buf = Buffer.from([0x52, 0x45, 0x54, 0x55, 0x52, 0x4e, 0x20, 0x4f, 0x46]);
  const bufferIO = new BufferIOReader(buf);
  _.range(0, (buf.length - 1), true).map((i) =>
    expect(bufferIO.UInt8()).to.equal(buf.readUInt8(i)));
  // assert.equal(bufferIO.UInt8(), buf.readUInt8(i)));
};

var readBigUInt64 = () => {
  const buf = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]);
  const bufferIO = new BufferIOReader(buf);
  expect(bufferIO.BigUInt64()).to.equal(18446744073709551615n);
  // assert.equal(bufferIO.BigUInt64(), 18446744073709551615n);
};

var readString = () => {
  const buf = Buffer.from([0x48, 0x45, 0x4C, 0x4C, 0x4F]);
  const bufferIO = new BufferIOReader(buf);
  expect(bufferIO.AsString({
    length: 5
  })).to.equal('HELLO');
};