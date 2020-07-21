/* jshint bigint: true */

const _ = require('lodash');
const expect = require('chai').expect;
const specHelper = require('./spec-helper');
const {
	BufferIOReader,
	types
} = require('..');

const EPSILON = 0.00001;

const FUNCTION_NAMES = types(); // ['AsString', 'Bytes', 'UTF8', 'BigInt64', 'BigInt64BE', 'BigInt64LE', 'BigUInt64', 'BigUInt64BE', 'BigUInt64LE', 'Int64', 'Int64BE', 'Int64LE', 'UInt64', 'UInt64BE', 'UInt64LE', 'Bytes', 'Double', 'DoubleBE', 'DoubleLE', 'Float', 'Float32', 'Float32BE', 'Float32LE', 'FloatBE', 'FloatLE', 'Int', 'Int16', 'Int16BE', 'Int16LE', 'Int32', 'Int32BE', 'Int32LE', 'Int8', 'IntBE', 'IntLE', 'SFloat', 'SFloatBE', 'SFloatLE', 'UInt', 'UInt16', 'UInt16BE', 'UInt16LE', 'UInt32', 'UInt32BE', 'UInt32LE', 'UInt8', 'UIntBE', 'UIntLE'];

describe('BufferIOReader', () => {

	// let testCase;
	let buf = Buffer.from([
		0x45, 0x58, 0x50, 0x45, 0x43, 0x54, 0x45, 0x44, 0x20, 0x52, 0x45, 0x54, 0x55, 0x52, 0x4e, 0x21,
		0x52, 0x45, 0x54, 0x55, 0x52, 0x4e, 0x20, 0x4f, 0x46, 0x20, 0x24, 0x32, 0x2e, 0x30, 0x30, 0x21
	]);

	it('should alias all functions with a lowercase name', () => {
		const reader = new BufferIOReader(buf);
		FUNCTION_NAMES.forEach(name => {
			expect((reader[name] === reader[name.toLowerCase()])).to.be.true;
		});
	});

	it('should get Uint with 0 < byteLength <= 6', () => {
		for (let byteLength = 1; byteLength <= 6; byteLength++) {
			const reader = new BufferIOReader(buf),
			val = reader.UIntLE({ byteLength });
			expect(val, val).to.equal(buf.readUIntLE(0, byteLength));
		}
	});

	it('should get int with 0 < byteLength <= 6', () => {
		for (let byteLength = 1; byteLength <= 6; byteLength++) {
			const reader = new BufferIOReader(Buffer.from(_.range(0, Math.pow(2, 8), false)));
			expect(reader.IntLE({ byteLength })).to.equal(reader.getBuffer().readIntLE(0, byteLength));
		}
	});

	it('should get Uint8', () => {
		const reader = new BufferIOReader(buf);
		expect(_.range(0, (buf.size - 1), true).map((i) => reader.UInt8().to.eql(buf.readUInt8(i, true))));
	});

	it('should get int8', () => {
		const reader = new BufferIOReader(Buffer.from(_.range(0, Math.pow(2, 8), false)));
		expect(_.range(0, (buf.size - 1), true).map((i) => reader.Int8().to.eql(buf.readInt8(i, true))));
	});

	it('should get Uint16 Little Endian', () => {
		const reader = new BufferIOReader(buf);
		expect(_.range(0, ((buf.size / 2) - 1), true).map((i) => reader.UInt16().to.eql(buf.readUInt16LE(i, true))));
	});

	it('should get Uint16 Big Endian', () => {
		const reader = new BufferIOReader(buf, {
			bigEndian: true
		});
		expect(_.range(0, ((buf.size / 2) - 1), true).map((i) => reader.UInt16().to.eql(buf.readUInt16BE(i, true))));
	});

	it('should get int16 Little Endian', () => {
		const reader = new BufferIOReader(Buffer.from(_.range(0, Math.pow(2, 16), false)));
		expect(_.range(0, ((buf.size / 2) - 1), true).map((i) => reader.Int16().to.eql(buf.readInt16LE(i, true))));
	});

	it('should get int16 Big Endian', () => {
		const reader = new BufferIOReader((Buffer.from(_.range(0, Math.pow(2, 16), false))), {
			bigEndian: true
		});
		expect(_.range(0, ((buf.size / 2) - 1), true).map((i) => reader.Int16().to.eql(buf.readInt16BE(i, true))));
	});

	it('should get Uint32 Little Endian', () => {
		const reader = new BufferIOReader(buf);
		expect(_.range(0, ((buf.size / 4) - 1), true).map((i) => reader.UInt32().to.eql(buf.readUInt32LE(i, true))));
	});

	it('should get Uint32 Big Endian', () => {
		const reader = new BufferIOReader(buf, {
			bigEndian: true
		});
		expect(_.range(0, ((buf.size / 4) - 1), true).map((i) => reader.UInt32().to.eql(buf.readUInt32BE(i, true))));
	});

	it('should get int32 Little Endian', () => {
		const mybuf = Buffer.from([0x88, 0x88, 0xA0, 0xFF]);
		const reader = new BufferIOReader(mybuf);
		expect(reader.Int32()).to.eql((reader.getBuffer().readInt32LE(0, true)));
	});

	it('should get int32 Big Endian', () => {
		const mybuf = Buffer.from([0x88, 0x88, 0xA0, 0xFF]);
		const reader = new BufferIOReader(mybuf, {
			bigEndian: true
		});
		expect(reader.Int32()).to.eql((reader.getBuffer().readInt32BE(0, true)));
	});

	it('should get BigUInt64 little endian MAX', () => {
		const reader = new BufferIOReader(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
		expect(reader.BigUInt64()).to.eql(18446744073709551615n);
	});

	it('should get BigUInt64 big endian MAX', () => {
		const reader = new BufferIOReader((Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])), {
			bigEndian: true
		});
		expect(reader.BigUInt64()).to.eql(18446744073709551615n);
	});

	it('should get BigUInt64 little endian', () => {
		const reader = new BufferIOReader(Buffer.from([0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]));
		expect(reader.BigUInt64()).to.eql(4294967366n);
	});

	it('should get BigUInt64 big endian', () => {
		const reader = new BufferIOReader((Buffer.from([0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x46])), {
			bigEndian: true
		});
		expect(reader.BigUInt64()).to.eql(4294967366n);
	});

	it('should get int64 little endian', () => {
		const reader = new BufferIOReader(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
		expect(reader.BigInt64()).to.eql(-1n);
	});

	it('should get int64 big endian', () => {
		const reader = new BufferIOReader(Buffer.from(([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), {
			bigEndian: true
		}));
		expect(reader.BigInt64()).to.eql(-1n);
	});

	it('should get String', () => {
		const reader = new BufferIOReader(buf);
		expect(reader.AsString({
			length: 16
		})).to.eql('EXPECTED RETURN!');
		expect(reader.AsString({
			length: 16
		})).to.eql('RETURN OF $2.00!');
	});

	it('should get UTF-8 String', () => {
		const reader = new BufferIOReader(buf);
		expect(reader.UTF8({
			length: 16,
			encoding: 'utf8'
		})).to.eql('EXPECTED RETURN!');
		expect(reader.UTF8({
			length: 16
		})).to.eql('RETURN OF $2.00!');
	});

	it('should return empty String when length is 0', () => {
		const reader = new BufferIOReader(buf);
		expect(reader.AsString({length: 0})).to.eql('');
	});
	it('should return full String when length is undefined', () => {
		const reader = new BufferIOReader(buf);
		expect(reader.AsString()).to.eql(buf.toString());
	});

	it('buffer should not be modified', () => {
		const reader = new BufferIOReader(buf);
		expect(reader.UInt8()).to.eql(buf.readUInt8(0, true));
		expect(reader.UInt8()).to.eql(buf.readUInt8(1, true));
		expect(reader.getBuffer()).to.eql(buf);
	});

	it('internal offset should be incremented', () => {
		const reader = new BufferIOReader(buf);
		expect(reader.UInt8()).to.eql(buf.readUInt8(0, true));
		expect(reader.UInt8()).to.eql(buf.readUInt8(1, true));
		expect(reader.offset).to.eql(2);
	});

	it('should skip bytes', () => {
		const reader = new BufferIOReader(buf);
		const returnVal = reader.skip(4);
		expect((typeof returnVal)).to.eql('undefined'); // Skipping shouldn't return a value
		expect(reader.offset).to.eql(4);
	});

	it('should skip to set offset', () => {
		const reader = new BufferIOReader(buf);
		reader.skip(4);
		expect(reader.offset).to.eql(4);
		reader.skipTo(6);
		expect(reader.offset).to.eql(6);
	});

	it('should be able to readUInt8 at a specific offset', () => {
		const reader = new BufferIOReader(Buffer.from([
			0x01, 0x02, 0x03, 0x04, 0x05
		]));
		expect(reader.UInt8(3)).to.eql(4);
		expect(reader.offset).to.eql(0);
	}); //should not increment currentOffset

	it('should be able to readUInt16 at a specific offset', () => {
		const reader = new BufferIOReader(Buffer.from([
			0x01, 0x02, 0x03, 0x00, 0x05
		]));
		expect(reader.UInt16(2)).to.eql(3);
		expect(reader.offset).to.eql(0);
	}); //should not increment currentOffset

	it('should get BigUInt64 at a specific offset', () => {
		const reader = new BufferIOReader(Buffer.from([0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
		expect(reader.BigUInt64(2)).to.eql(18446744073709551615n);
		expect(reader.offset).to.eql(0);
	}); //should not increment currentOffset

	it('should get string of specified length at a specified offset', () => {
		const reader = new BufferIOReader(Buffer.from([
			0x00, 0x00, 0x00, 0x00, 0x00, 0x48, 0x45, 0x4C, 0x4C, 0x4F
		]));
		expect(reader.AsString({
			length: 5,
			offset: 5
		})).to.eql('HELLO');
		expect(reader.offset).to.eql(0);
	}); //should not increment currentOffset

	it('should get Bytes', () => {
		const reader = new BufferIOReader(Buffer.from([
			0x20, 0x6d, 0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20
		]));
		expect(reader.Bytes({
			offset: 2,
			length: 9
		})).to.eql([0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20]);
		expect(reader.Bytes({
			length: 4
		})).to.eql([0x20, 0x6d, 0x57, 0x68]);
		expect(reader.Bytes({
			length: 1
		})).to.eql([0x61]);
	});

	it('should get bytes', () => {
		const reader = new BufferIOReader(Buffer.from([
			0x20, 0x6d, 0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20
		]));
		expect(reader.bytes({
			offset: 3,
			length: 8
		})).to.eql([0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20]);
		expect(reader.bytes({
			length: 3
		})).to.eql([0x20, 0x6d, 0x57]);
		expect(reader.bytes({
			length: 2
		})).to.eql([0x68, 0x61]);
	});

	it('expect an error when reading past the length', () => {
		buf = Buffer.from([0x1]);
		const reader = new BufferIOReader(buf);
		expect(reader.UInt8()).to.equal(1);
		expect(() => reader.UInt8()).to.throw();
	});


	it('expect a RangeError when reading past the length', () => {
		buf = Buffer.from([0x1]);
		const reader = new BufferIOReader(buf);
		expect(reader.UInt8()).to.equal(1);
		expect(() => reader.UInt8()).to.throw(RangeError);
	});

	const testCases = specHelper.cartesianProduct({
		size: [1, 2, 4, 8],
		unsigned: [false, true],
		bigEndian: [false, true],
		offset: [undefined, 20],
	});

	// UInt
	testCases.map(testCase => (({
		size,
		unsigned,
		bigEndian,
		offset,
	}) => it(`expect a RangeError when reading past the length for ${JSON.stringify(testCase)}`, () => {
		buf = Buffer.alloc(((offset || 0) + size) - 1);
		const reader = new BufferIOReader(buf, {
			bigEndian
		});
		const f = unsigned ? `UInt${size * 8}` : `Int${size * 8}`;
		expect(() => reader[f](offset), f).to.throw(RangeError);
	}))(testCase));

	// Int
	testCases.map(testCase => (({
		size,
		unsigned,
		bigEndian,
		offset,
	}) => it(`expect a RangeError when reading past the length for ${JSON.stringify(testCase)}`, () => {
		buf = Buffer.alloc(((offset || 0) + size) - 1);
		const reader = new BufferIOReader(buf, {
			bigEndian
		});
		const f = unsigned ? `Int${size * 8}` : `Int${size * 8}`;
		expect(() => reader[f](offset)).to.throw();
	}))(testCase));
});