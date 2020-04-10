/* jshint "bigint": true */

const _ = require('lodash');
const expect = require('chai').expect;
const {
    BufferIOWriter
} = require('..');

const {
    writeToLegacyBuffer,
    writeToBufferIO
} = require('./support/test-helper');
const specHelper = require('./spec-helper');

const FUNCTION_NAMES = ['AsString', 'Bytes', 'UTF8', 'BigInt64', 'BigInt64BE', 'BigInt64LE', 'BigUInt64', 'BigUInt64BE', 'BigUInt64LE', 'Bytes', 'Double', 'DoubleBE', 'DoubleLE', 'Float', 'Float32', 'Float32BE', 'Float32LE', 'FloatBE', 'FloatLE', 'Int', 'Int16', 'Int16BE', 'Int16LE', 'Int32', 'Int32BE', 'Int32LE', 'Int8', 'IntBE', 'IntLE', 'SFloat', 'SFloatBE', 'SFloatLE', 'UInt', 'UInt16', 'UInt16BE', 'UInt16LE', 'UInt32', 'UInt32BE', 'UInt32LE', 'UInt8', 'UIntBE', 'UIntLE'];

describe('BufferIOWriter', () => {
    const powed = v => Math.pow(2, v) - 1;

    // generates a unsigned range, e.g [0, 1, 3, 7, 15, 31, 63, 127, 255]
    const unsignedValues = count => _.map(_.range(0, count + 1, 1), powed);

    // generates a signed range, e.g [-127, -63, -31, -15, -7, -3, -1, 0, 1, 3, 7, 15, 31, 63, 127]
    const signedValues = (count) => {
        const values = _.map(_.range(0, count, 1), powed);
        // flip the signs, reverse it, remove the extra '0', and concat the orig values
        return _.concat(_.map(values, v => v * -1).reverse().slice(0, -1), values);
    };

    it('should alias all functions with a lowercase name', () => {
        const numberOfBytesPerWord = 1;
        const values = unsignedValues(8 * numberOfBytesPerWord);
        const writer = writeToBufferIO(values, numberOfBytesPerWord, false, (writer, value) => writer.UInt8(value));
        FUNCTION_NAMES.forEach(name => {
            expect((writer[name] === writer[name.toLowerCase()])).to.be.true;
        });
    });


    it('should write Uint8', () => {
        const numberOfBytesPerWord = 1;
        const values = unsignedValues(8 * numberOfBytesPerWord);
        const buf = writeToLegacyBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt8(value, offset, true));
        const bufferIO = writeToBufferIO(values, numberOfBytesPerWord, false, (writer, value) => writer.UInt8(value));

        expect(buf).to.eql(bufferIO);
    });

    it('should write int8', () => {
        const numberOfBytesPerWord = 1;
        const values = signedValues(8 * numberOfBytesPerWord);
        const buf = writeToLegacyBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt8(value, offset, true));
        const bufferIO = writeToBufferIO(values, numberOfBytesPerWord, false, (writer, value) => writer.Int8(value));

        expect(buf).to.eql(bufferIO);
    });

    it('should write Uint16 Little Endian', () => {
        const numberOfBytesPerWord = 2;
        const values = unsignedValues(8 * numberOfBytesPerWord);
        const buf = writeToLegacyBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt16LE(value, offset, true));
        const bufferIO = writeToBufferIO(values, numberOfBytesPerWord, false, (writer, value) => writer.UInt16(value));

        expect(buf).to.eql(bufferIO);
    });

    it('should write int16 Little Endian', () => {
        const numberOfBytesPerWord = 2;
        const values = signedValues(8 * numberOfBytesPerWord);
        const buf = writeToLegacyBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt16LE(value, offset, true));
        const bufferIO = writeToBufferIO(values, numberOfBytesPerWord, false, (writer, value) => writer.Int16(value));

        expect(buf).to.eql(bufferIO);
    });

    it('should write Uint16 Big Endian', () => {
        const numberOfBytesPerWord = 2;
        const values = unsignedValues(8 * numberOfBytesPerWord);
        const buf = writeToLegacyBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt16BE(value, offset, true));
        const bufferIO = writeToBufferIO(values, numberOfBytesPerWord, true, (writer, value) => writer.UInt16(value));

        expect(buf).to.eql(bufferIO);
    });

    it('should write int16 Big Endian', () => {
        const numberOfBytesPerWord = 2;
        const values = signedValues(8 * numberOfBytesPerWord);
        const buf = writeToLegacyBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt16BE(value, offset, true));
        const bufferIO = writeToBufferIO(values, numberOfBytesPerWord, true, (writer, value) => writer.Int16(value));

        expect(buf).to.eql(bufferIO);
    });

    it('should write Uint32 Little Endian', () => {
        const numberOfBytesPerWord = 4;
        const values = unsignedValues(8 * numberOfBytesPerWord);
        const buf = writeToLegacyBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt32LE(value, offset, true));
        const bufferIO = writeToBufferIO(values, numberOfBytesPerWord, false, (writer, value) => writer.UInt32(value));

        expect(buf).to.eql(bufferIO);
    });

    it('should write int32 Little Endian', () => {
        const numberOfBytesPerWord = 4;
        const values = signedValues(8 * numberOfBytesPerWord);
        const buf = writeToLegacyBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt32LE(value, offset, true));
        const bufferIO = writeToBufferIO(values, numberOfBytesPerWord, false, (writer, value) => writer.Int32(value));

        expect(buf).to.eql(bufferIO);
    });

    it('should write Uint32 Big Endian', () => {
        const numberOfBytesPerWord = 4;
        const values = unsignedValues(8 * numberOfBytesPerWord);
        const buf = writeToLegacyBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt32BE(value, offset, true));
        const bufferIO = writeToBufferIO(values, numberOfBytesPerWord, true, (writer, value) => writer.UInt32(value));

        expect(buf).to.eql(bufferIO);
    });

    it('should write int32 Big Endian', () => {
        const numberOfBytesPerWord = 4;
        const values = signedValues(8 * numberOfBytesPerWord);
        const buf = writeToLegacyBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt32BE(value, offset, true));
        const bufferIO = writeToBufferIO(values, numberOfBytesPerWord, true, (writer, value) => writer.Int32(value));

        expect(buf).to.eql(bufferIO);
    });

    it('should write bytes', () => {
        const buf = Buffer.alloc(11);
        buf.fill(0);
        const writer = new BufferIOWriter(buf);
        writer.Bytes([0x20, 0x6d, 0x65, 0x20, 0x57, 0x6f, 0x72, 0x72, 0x79, 0x21]);
        writer.Bytes([0x20]);
        writer.Bytes([0x57, 0x68, 0x61, 0x74], {
            offset: 2
        });

        expect(writer.getBuffer()).to.eql(Buffer.from([0x20, 0x6d, 0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20]));
    });

    it('should skip bytes', () => {
        const buf = Buffer.alloc(4);
        buf.fill(0);
        const writer = new BufferIOWriter(buf);
        writer.UInt8(0x10);
        writer.skip(2);
        writer.UInt8(0x20);

        expect(writer.getBuffer()).to.eql(Buffer.from([0x10, 0x00, 0x00, 0x20]));
    });

    it('should skip to set offset', () => {
        const buf = Buffer.alloc(4);
        buf.fill(0);
        const writer = new BufferIOWriter(buf);
        writer.UInt8(0x10);
        writer.skipTo(2);
        writer.UInt8(0x20);

        expect(writer.getBuffer()).to.eql(Buffer.from([0x10, 0x00, 0x20, 0x00]));
    });

    it('should write string', () => {
        const buf = Buffer.alloc(32);
        buf.fill(0);
        const writer = new BufferIOWriter(buf);
        writer.AsString('EXPECTED RETURN!');
        let len = writer.AsString('RETURN OF $2.00!').length;
        expect(len).to.eql(32);
        expect(writer.offset).to.eql(32);
        expect(writer.getBuffer()).to.eql(Buffer.from([
            0x45, 0x58, 0x50, 0x45, 0x43, 0x54, 0x45, 0x44, 0x20, 0x52, 0x45, 0x54, 0x55, 0x52, 0x4e, 0x21,
            0x52, 0x45, 0x54, 0x55, 0x52, 0x4e, 0x20, 0x4f, 0x46, 0x20, 0x24, 0x32, 0x2e, 0x30, 0x30, 0x21
        ]));
    });

    it('should write string in multi-byte encodings', () => {
        const buf = Buffer.alloc(10);
        buf.fill(0);
        const writer = new BufferIOWriter(buf);
        const len = writer.AsString('héllo', {
            encoding: 'utf-8'
        }).length;
        expect(len).to.eql(10);
        expect(writer.trim().length).to.eql(6);
        expect(writer.offset).to.eql(6);
        expect(writer.trim()).to.eql(Buffer.from([
            0x68, 0xc3, 0xa9, 0x6c, 0x6c, 0x6f
        ]));
        expect(writer.getBuffer()).to.eql(Buffer.from([
            0x68, 0xc3, 0xa9, 0x6c, 0x6c, 0x6f, 0x00, 0x00, 0x00, 0x00
        ]));
    });

    // because of buffer.write(value, offset, length, encoding)
    it('takes the encoding param into account, even if length is not specified', () => {
        const buf = Buffer.alloc(10);
        buf.fill(0);
        const writer = new BufferIOWriter(buf);
        const len = writer.AsString('héllo', {
            encoding: 'utf16le'
        }).length;
        expect(len).to.eql(10);
    });

    it('should write partial strings using length (number of bytes)', () => {
        const buf = Buffer.alloc(10);
        buf.fill(0);
        const writer = new BufferIOWriter(buf);
        const len = writer.AsString('HELLOWORLD', {
            length: 5
        }).length;
        //Only writes hello
        expect(len).to.eql(10);
        expect(writer.trim().length).to.eql(5);
        expect(writer.offset).to.eql(5);
        expect(writer.trim()).to.eql(Buffer.from([
            0x48, 0x45, 0x4C, 0x4C, 0x4F
        ]));
        expect(writer.getBuffer()).to.eql(Buffer.from([
            0x48, 0x45, 0x4C, 0x4C, 0x4F, 0x00, 0x00, 0x00, 0x00, 0x00
        ]));
    });

    it('should write partial multi-byte strings using length (number of bytes)', () => {
        const buf = Buffer.alloc(10);
        buf.fill(0);
        const writer = new BufferIOWriter(buf);
        const len = writer.AsString('héllo', {
            length: 4
        }).length;
        // Only writes hél
        expect(len).to.eql(10);
        expect(writer.trim().length).to.eql(4);
        expect(writer.offset).to.eql(4);
        expect(writer.trim()).to.eql(Buffer.from([
            0x68, 0xc3, 0xa9, 0x6c
        ]));
        expect(writer.getBuffer()).to.eql(Buffer.from([
            0x68, 0xc3, 0xa9, 0x6c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]));
    });

    it('does not write partially encoded characters', () => {
        const buf = Buffer.alloc(10);
        // buf.fill(0);
        const writer = new BufferIOWriter(buf);
        const len = writer.AsString('éè', {
            length: 3
        }).length;
        // Only writes é
        expect(len).to.eql(10);
        expect(writer.trim().length).to.eql(2);
        expect(writer.offset).to.eql(2);
        expect(writer.trim()).to.eql(Buffer.from([
            0xc3, 0xa9
        ]));
        expect(writer.getBuffer()).to.eql(Buffer.from([
            0xc3, 0xa9, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]));
    });

    it('should write string at a specified offset', () => {
        const buf = Buffer.alloc(10);
        buf.fill(0);
        const writer = new BufferIOWriter(buf);
        writer.AsString('HELLO', {
            offset: 5
        });

        //Writes hello starting at offset 5
        expect(writer.offset).to.eql(0);
        expect(writer.getBuffer()).to.eql(Buffer.from([
            0x00, 0x00, 0x00, 0x00, 0x00, 0x48, 0x45, 0x4C, 0x4C, 0x4F
        ]));
    });

    it('should be able to writeUInt8 at a specific offset', () => {
        const buf = Buffer.alloc(5);
        buf.fill(0);
        const writer = new BufferIOWriter(buf);
        writer.UInt8(1);
        writer.UInt8(2);
        writer.UInt8(3);
        writer.UInt8(4);
        writer.UInt8(5);
        writer.UInt8(6, 1);

        //Writes 6 at position 1
        expect(writer.getBuffer()).to.eql(Buffer.from([
            0x01, 0x06, 0x03, 0x04, 0x05
        ]));
        //Does not increment the offset
        expect(writer.offset).to.eql(5);
    });

    it('should be able to writeUInt16 at a specific offset', () => {
        const buf = Buffer.alloc(10);
        buf.fill(0);
        const writer = new BufferIOWriter(buf);
        writer.UInt16(1);
        writer.UInt16(2);
        writer.UInt16(3);
        writer.UInt16(4);
        writer.UInt16(5);
        writer.UInt16(6, 2);

        //Writes 6 at position 2
        expect(writer.getBuffer()).to.eql(Buffer.from([
            0x01, 0x00, 0x06, 0x00, 0x03, 0x00, 0x04, 0x00, 0x05, 0x00
        ]));
        //Does not increment the offset
        expect(writer.offset).to.eql(10);
    });

    it('should write BigUInt64 little endian MAX', () => {
        const buf = Buffer.alloc(8);
        buf.fill(0);
        const bufferIO = new BufferIOWriter(buf);
        bufferIO.BigUInt64(18446744073709551615n);
        expect(bufferIO.getBuffer()).to.eql(Buffer.from([
            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
        ]));
    });

    it('should write BigUInt64 big endian MAX', () => {
        const buf = Buffer.alloc(8);
        buf.fill(0);
        const bufferIO = new BufferIOWriter(buf, {
            bigEndian: true
        });
        bufferIO.BigUInt64(18446744073709551615n);
        expect(bufferIO.getBuffer()).to.eql(Buffer.from([
            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
        ]));
    });

    it('should write BigUInt64 little endian', () => {
        const buf = Buffer.alloc(8);
        buf.fill(0);
        const bufferIO = new BufferIOWriter(buf);
        bufferIO.BigUInt64(4294967366n);
        expect(bufferIO.getBuffer()).to.eql(Buffer.from([
            0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00
        ]));
    });

    it('should write BigUInt64 big endian', () => {
        const buf = Buffer.alloc(8);
        buf.fill(0);
        const bufferIO = new BufferIOWriter(buf, {
            bigEndian: true
        });
        bufferIO.BigUInt64(4294967366n);
        expect(bufferIO.getBuffer()).to.eql(Buffer.from([
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x46
        ]));
    });

    it('should write int64 little endian', () => {
        const buf = Buffer.alloc(8);
        buf.fill(0);
        const bufferIO = new BufferIOWriter(buf);
        bufferIO.BigInt64(-1n);
        expect(bufferIO.getBuffer()).to.eql(Buffer.from([
            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
        ]));
    });

    it('should write int64 big endian', () => {
        const buf = Buffer.alloc(8);
        buf.fill(0);
        const bufferIO = new BufferIOWriter(buf, {
            bigEndian: true
        });
        bufferIO.BigInt64(-1n);
        expect(bufferIO.getBuffer()).to.eql(Buffer.from([
            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
        ]));
    });

    it('should write BigUInt64 at specified offset, currentOffset should not increment', () => {
        const buf = Buffer.alloc(10);
        buf.fill(0);
        const bufferIO = new BufferIOWriter(buf);
        bufferIO.BigUInt64(18446744073709551615n, 2);
        expect(bufferIO.getBuffer()).to.eql(Buffer.from([
            0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
        ]));
        expect(bufferIO.offset).to.eql(0);
    });

    it('should write BigUInt64 at current offset, currentOffset should increment', () => {
        const buf = Buffer.alloc(10);
        buf.fill(0);
        const bufferIO = new BufferIOWriter(buf);
        bufferIO.skip(1);
        bufferIO.BigUInt64(18446744073709551615n);
        expect(bufferIO.getBuffer()).to.eql(Buffer.from([
            0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00
        ]));
        expect(bufferIO.offset).to.eql(9);
    });

    describe('leading zeros are handling correctly', () => specHelper.cartesianProduct({
        size: [1, 2, 4, 8],
        unsigned: [false, true],
        bigEndian: [false, true]
    }).map((testCase) => (({
        size,
        unsigned,
        bigEndian
    }) => it(`should correctly handle leading zero for ${JSON.stringify(testCase)}`, () => {
        let f;
        const buf1 = Buffer.alloc(size);
        const buf2 = Buffer.alloc(size);

        const bufferIO1 = new BufferIOWriter(buf1, {
            bigEndian
        });
        const bufferIO2 = new BufferIOWriter(buf2, {
            bigEndian
        });

        if (unsigned) {
            f = `writeUInt${size * 8}`;
            bufferIO1[f]("123");
            bufferIO2[f]("00123");
        } else {
            f = `writeInt${size * 8}`;
            bufferIO1[f]("-123");
            bufferIO2[f]("-00123");
        }

        expect(buf1).to.eql(buf2);
    }))));

    describe('check we handle numbers and strings identically', () => specHelper.cartesianProduct({
        size: [1, 2, 4, 8],
        unsigned: [false, true],
        bigEndian: [false, true]
    }).map((testCase) => (({
        size,
        unsigned,
        bigEndian
    }) => it(`should correctly handle numbers and strings for ${JSON.stringify(testCase)}`, () => {
        let f;
        const buf1 = Buffer.alloc(size);
        const buf2 = Buffer.alloc(size);

        const bufferIO1 = new BufferIOWriter(buf1, {
            bigEndian
        });
        const bufferIO2 = new BufferIOWriter(buf2, {
            bigEndian
        });

        if (unsigned) {
            f = `writeUInt${size * 8}`;
            bufferIO1[f]("123");
            bufferIO2[f](123);
        } else {
            f = `writeInt${size * 8}`;
            bufferIO1[f]("-123");
            bufferIO2[f](-123);
        }

        expect(buf1).to.eql(buf2);
    }))));

    describe('check only throwing exception for writing negative unsigned integers', () => specHelper.cartesianProduct({
        size: [1, 2, 4, 8],
        bigEndian: [false, true]
    }).map((testCase) => ({
        size,
        bigEndian
    }) => {
        it(`should throw  ${JSON.stringify(testCase)}`, () => {
            let error;
            const bufferIO = new BufferIOWriter((Buffer.alloc(size)), {
                bigEndian
            });

            try {
                bufferIO[`writeUInt${size * 8}`]("-1");
            } catch (error1) {
                error = error1;
                expect(error.toString()).to.match(/TypeError|RangeError/);
            }
            try {
                bufferIO[`writeUInt${size * 8}`](-1);
            } catch (error2) {
                error = error2;
                expect(error.toString()).to.match(/TypeError|RangeError/);
            }
        });


    }));
});