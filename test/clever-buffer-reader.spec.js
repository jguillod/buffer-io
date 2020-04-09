const _ = require('lodash');
const should = require('should');

const {CleverBufferReader} = require('../');

const EPSILON = 0.00001;

const FUNCTION_NAMES = ['AsString', 'Bytes', 'UTF8', 'BigInt64', 'BigInt64BE', 'BigInt64LE', 'BigUInt64', 'BigUInt64BE', 'BigUInt64LE', 'Bytes', 'Double', 'DoubleBE', 'DoubleLE', 'Float', 'Float32', 'Float32BE', 'Float32LE', 'FloatBE', 'FloatLE', 'Int', 'Int16', 'Int16BE', 'Int16LE', 'Int32', 'Int32BE', 'Int32LE', 'Int8', 'IntBE', 'IntLE', 'SFloat', 'SFloatBE', 'SFloatLE', 'UInt', 'UInt16', 'UInt16BE', 'UInt16LE', 'UInt32', 'UInt32BE', 'UInt32LE', 'UInt8', 'UIntBE', 'UIntLE'];

describe('CleverBufferReader', () => {

	// let testCase;
	let buf = Buffer.from([
		0x45, 0x58, 0x50, 0x45, 0x43, 0x54, 0x45, 0x44, 0x20, 0x52, 0x45, 0x54, 0x55, 0x52, 0x4e, 0x21,
		0x52, 0x45, 0x54, 0x55, 0x52, 0x4e, 0x20, 0x4f, 0x46, 0x20, 0x24, 0x32, 0x2e, 0x30, 0x30, 0x21
	]);

	it('should alias all functions with a lowercase name', () => {
		const reader = new CleverBufferReader(buf);
		FUNCTION_NAMES.forEach(name => {
			(reader[name] === reader[name.toLowerCase()]).should.be.true;
		});
	});

	it('should get Uint8', () => {
		const reader = new CleverBufferReader(buf);
		_.range(0, (buf.size - 1), true).map((i) => reader.UInt8().should.eql(buf.readUInt8(i, true)));
	});

	it('should get int8', () => {
		const reader = new CleverBufferReader(Buffer.from(_.range(0, Math.pow(2, 8), false)));
		_.range(0, (buf.size - 1), true).map((i) => reader.Int8().should.eql(buf.readInt8(i, true)));
	});

	it('should get Uint16 Little Endian', () => {
		const reader = new CleverBufferReader(buf);
		_.range(0, ((buf.size / 2) - 1), true).map((i) => reader.UInt16().should.eql(buf.readUInt16LE(i, true)));
	});

	it('should get Uint16 Big Endian', () => {
		const reader = new CleverBufferReader(buf, {
			bigEndian: true
		});
		_.range(0, ((buf.size / 2) - 1), true).map((i) => reader.UInt16().should.eql(buf.readUInt16BE(i, true)));
	});

	it('should get int16 Little Endian', () => {
		const reader = new CleverBufferReader(Buffer.from(_.range(0, Math.pow(2, 16), false)));
		_.range(0, ((buf.size / 2) - 1), true).map((i) => reader.Int16().should.eql(buf.readInt16LE(i, true)));
	});

	it('should get int16 Big Endian', () => {
		const reader = new CleverBufferReader((Buffer.from(_.range(0, Math.pow(2, 16), false))), {
			bigEndian: true
		});
		_.range(0, ((buf.size / 2) - 1), true).map((i) => reader.Int16().should.eql(buf.readInt16BE(i, true)));
	});

	it('should get Uint32 Little Endian', () => {
		const reader = new CleverBufferReader(buf);
		_.range(0, ((buf.size / 4) - 1), true).map((i) => reader.UInt32().should.eql(buf.readUInt32LE(i, true)));
	});

	it('should get Uint32 Big Endian', () => {
		const reader = new CleverBufferReader(buf, {
			bigEndian: true
		});
		_.range(0, ((buf.size / 4) - 1), true).map((i) => reader.UInt32().should.eql(buf.readUInt32BE(i, true)));
	});

	it('should get int32 Little Endian', () => {
		const mybuf = Buffer.from([0x88, 0x88, 0xA0, 0xFF]);
		const reader = new CleverBufferReader(mybuf);
		reader.Int32().should.eql((reader.getBuffer().readInt32LE(0, true)));
	});

	it('should get int32 Big Endian', () => {
		const mybuf = Buffer.from([0x88, 0x88, 0xA0, 0xFF]);
		const reader = new CleverBufferReader(mybuf, {
			bigEndian: true
		});
		reader.Int32().should.eql((reader.getBuffer().readInt32BE(0, true)));
	});

	it('should get BigUInt64 little endian MAX', () => {
		const reader = new CleverBufferReader(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
		reader.BigUInt64().should.eql(18446744073709551615n);
	});

	it('should get BigUInt64 big endian MAX', () => {
		const reader = new CleverBufferReader((Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])), {
			bigEndian: true
		});
		reader.BigUInt64().should.eql(18446744073709551615n);
	});

	it('should get BigUInt64 little endian', () => {
		const reader = new CleverBufferReader(Buffer.from([0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]));
		reader.BigUInt64().should.eql(4294967366n);
	});

	it('should get BigUInt64 big endian', () => {
		const reader = new CleverBufferReader((Buffer.from([0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x46])), {
			bigEndian: true
		});
		reader.BigUInt64().should.eql(4294967366n);
	});

	it('should get int64 little endian', () => {
		const reader = new CleverBufferReader(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
		reader.BigInt64().should.eql(-1n);
	});

	it('should get int64 big endian', () => {
		const reader = new CleverBufferReader(Buffer.from(([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), {
			bigEndian: true
		}));
		reader.BigInt64().should.eql(-1n);
	});

	it('should get String', () => {
		const reader = new CleverBufferReader(buf);
		reader.AsString({
			length: 16
		}).should.eql('EXPECTED RETURN!');
		reader.AsString({
			length: 16
		}).should.eql('RETURN OF $2.00!');
	});

	it('should get UTF-8 String', () => {
		const reader = new CleverBufferReader(buf);
		reader.UTF8({
			length: 16,
			encoding: 'utf8'
		}).should.eql('EXPECTED RETURN!');
		reader.UTF8({
			length: 16
		}).should.eql('RETURN OF $2.00!');
	});

	it('should return empty String when length is 0', () => {
		const reader = new CleverBufferReader(buf);
		reader.AsString().should.eql('');
	});

	it('buffer should not be modified', () => {
		const reader = new CleverBufferReader(buf);
		reader.UInt8().should.eql(buf.readUInt8(0, true));
		reader.UInt8().should.eql(buf.readUInt8(1, true));
		reader.getBuffer().should.eql(buf);
	});

	it('internal offset should be incremented', () => {
		const reader = new CleverBufferReader(buf);
		reader.UInt8().should.eql(buf.readUInt8(0, true));
		reader.UInt8().should.eql(buf.readUInt8(1, true));
		reader.offset.should.eql(2);
	});

	it('should skip bytes', () => {
		const reader = new CleverBufferReader(buf);
		const returnVal = reader.skip(4);
		(typeof returnVal).should.eql('undefined'); // Skipping shouldn't return a value
		reader.offset.should.eql(4);
	});

	it('should skip to set offset', () => {
		const reader = new CleverBufferReader(buf);
		reader.skip(4);
		reader.offset.should.eql(4);
		reader.skipTo(6);
		reader.offset.should.eql(6);
	});

	it('should be able to readUInt8 at a specific offset', () => {
		const reader = new CleverBufferReader(Buffer.from([
			0x01, 0x02, 0x03, 0x04, 0x05
		]));
		reader.UInt8(3).should.eql(4);
		reader.offset.should.eql(0);
	}); //should not increment currentOffset

	it('should be able to readUInt16 at a specific offset', () => {
		const reader = new CleverBufferReader(Buffer.from([
			0x01, 0x02, 0x03, 0x00, 0x05
		]));
		reader.UInt16(2).should.eql(3);
		reader.offset.should.eql(0);
	}); //should not increment currentOffset

	it('should get BigUInt64 at a specific offset', () => {
		const reader = new CleverBufferReader(Buffer.from([0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
		reader.BigUInt64(2).should.eql(18446744073709551615n);
		reader.offset.should.eql(0);
	}); //should not increment currentOffset

	it('should get string of specified length at a specified offset', () => {
		const reader = new CleverBufferReader(Buffer.from([
			0x00, 0x00, 0x00, 0x00, 0x00, 0x48, 0x45, 0x4C, 0x4C, 0x4F
		]));
		reader.AsString({
			length: 5,
			offset: 5
		}).should.eql('HELLO');
		reader.offset.should.eql(0);
	}); //should not increment currentOffset

	it('should get Bytes', () => {
		const reader = new CleverBufferReader(Buffer.from([
			0x20, 0x6d, 0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20
		]));
		reader.Bytes({
			offset: 2,
			length: 9
		}).should.eql([0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20]);
		reader.Bytes({
			length: 4
		}).should.eql([0x20, 0x6d, 0x57, 0x68]);
		reader.Bytes({
			length: 1
		}).should.eql([0x61]);
	});

	it('should get bytes', () => {
		const reader = new CleverBufferReader(Buffer.from([
			0x20, 0x6d, 0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20
		]));
		reader.bytes({
			offset: 3,
			length: 8
		}).should.eql([0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20]);
		reader.bytes({
			length: 3
		}).should.eql([0x20, 0x6d, 0x57]);
		reader.bytes({
			length: 2
		}).should.eql([0x68, 0x61]);
	});

	it('should throw an error when reading past the length', () => {
		buf = Buffer.from([0x1]);
		const reader = new CleverBufferReader(buf);
		should.equal(reader.UInt8(), 1);
		(() => reader.UInt8().should.throw());
	});


	// it('when noAssert is true: should return <undefined> when reading past the length', () => {
	//   buf = Buffer.from([0x1]);
	//   const reader = new CleverBufferReader(buf, { noAssert: true });
	//   should.equal(reader.UInt8(), 1);
	//   should.equal(typeof reader.UInt8(), 'undefined');
	// });

	// const testCases = specHelper.cartesianProduct({
	//   size: [1, 2, 4, 8],
	//   unsigned: [false, true],
	//   bigEndian: [false, true],
	//   offset: [undefined, 20],
	// });

	// testCases.map(testCase => (({
	//   size, unsigned, bigEndian, offset,
	// }) => it(`when noAssert is false: should throw RangeError when reading past the length for ${JSON.stringify(testCase)}`, () => {
	//   buf = Buffer.alloc(((offset || 0) + size) - 1);
	//   const reader = new CleverBufferReader(buf, { bigEndian, noAssert: false });
	//   const f = unsigned ? `getUInt${size * 8}` : `getInt${size * 8}`;
	//   (() => reader[f](offset)).should.throw(RangeError);
	// })
	// )(testCase));
	//
	// testCases.map(testCase => (({
	//   size, unsigned, bigEndian, offset,
	// }) => it(`when noAssert is true: should not throw RangeError when reading past the length for ${JSON.stringify(testCase)}`, () => {
	//   buf = Buffer.alloc(((offset || 0) + size) - 1);
	//   const reader = new CleverBufferReader(buf, { bigEndian, noAssert: true });
	//   const f = unsigned ? `getUInt${size * 8}` : `getInt${size * 8}`;
	//   (() => reader[f](offset)).should.not.throw();
	// })
	// )(testCase));
});
