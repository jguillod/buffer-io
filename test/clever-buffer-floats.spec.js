/*
const {CleverBufferWriter, CleverBufferReader} = require('./');
w = new CleverBufferWriter(Buffer.alloc(20));
r = new CleverBufferReader(w.getBuffer());
w.SFloatBE(3.4, 0);

r.SFloatBE(0);

const ieee754 = require('ieee754');
ieee754.read(r.buffer, 0, false, 12, 2);

var ieee754ReadFn = ieee754.read,
	ieee754Read = function(offset, isLE, mLen, nBytes) {
		return ieee754ReadFn(this, offset, isLE, mLen, nBytes);
	};
ieee754Read.call(r.buffer, 0, false, 12, 2);
*/
	

const chai = require('chai');
const should = chai.should(); // require('should');

const {
	CleverBufferWriter,
	CleverBufferReader
} = require('../');

const SEPSILON = 0.001;
const EPSILON = 0.0001;

console.log('LOADED', __filename);

describe('CleverBuffer Writer/Reader using ieee754', () => {

	it('should write and read SFloat12_16', function() {
		const val = 2.3242,
			writer = new CleverBufferWriter(Buffer.alloc(2), {
				bigEndian: true
			}),
			reader = new CleverBufferReader(writer.getBuffer(), {
				bigEndian: true
			});
		writer.SFloat12_16BE(val);
		var num = reader.SFloat12_16BE();
		// console.log('∆ =>', Math.abs(num - val) < SEPSILON, Math.abs(num - val), num, val);
		// console.log('writer.buffer', writer.buffer);
		// console.log('reader.buffer', reader.buffer);

		Boolean(Math.abs(num - val) < SEPSILON).should.be.true;
		Number(reader.offset).should.equal(2);
		Number(writer.offset).should.equal(2);
		var num = reader.SFloat12_16(0);
		Boolean(Math.abs(num - val) < SEPSILON).should.be.true;
	});

	it('should write and read SFloat12_16LE', function() {
		const val = 2.45,
			writer = new CleverBufferWriter(Buffer.alloc(5), {
				offset: 1,
				bigEndian: false
			}),
			reader = new CleverBufferReader(writer.getBuffer());
		writer.SFloat12_16(val);
		var num = reader.SFloat12_16LE(1);
		// console.log('∆ =>', Math.abs(num - val) < SEPSILON, Math.abs(num - val), num, val);
		Boolean(Math.abs(num - val) < SEPSILON).should.be.true;
		Number(reader.offset).should.equal(0);
		Number(writer.offset).should.equal(3);
		reader.offset = 1;
		num = reader.SFloat12_16LE();
		Boolean(Math.abs(num - val) < SEPSILON).should.be.true;
		Number(reader.offset).should.equal(3);
	});

	it('should write and read Float24_32', function() {
		const val = 126.422234,
			offset = 2, // offset 2 is arbitrary
			writer = new CleverBufferWriter(Buffer.alloc(30)),
			reader = new CleverBufferReader(writer.getBuffer());
		writer.Float24_32BE(val, offset);
		var num = reader.Float24_32BE(offset);
		// console.log('∆ =>', Math.abs(num - val) < EPSILON, Math.abs(num - val), num, val);
		// console.log('writer.buffer', writer.buffer);
		// console.log('reader.buffer', reader.buffer);
		Boolean(Math.abs(num - val) < EPSILON).should.be.true;
		Number(reader.offset).should.equal(0);
		Number(writer.offset).should.equal(0);
		var num = reader.Float24_32BE(offset);
		Boolean(Math.abs(num - val) < EPSILON).should.be.true;
	});

	it('should write and read Float24_32BE', function() {
		const val = 2.45,
			offset = 1, // offset 2 is arbitrary
			writer = new CleverBufferWriter(Buffer.alloc(5), {
				offset,
				bigEndian: true
			}),
			reader = new CleverBufferReader(writer.getBuffer(), {
				bigEndian: true
			});
		writer.Float24_32BE(val);
		var num = reader.Float24_32(offset);
		// console.log('∆ =>', Math.abs(num - val) < EPSILON, Math.abs(num - val), num, val);
		Boolean(Math.abs(num - val) < EPSILON).should.be.true;
		Number(reader.offset).should.equal(0);
		Number(writer.offset).should.equal(4+offset);
		reader.offset = offset;
		num = reader.Float24_32();
		Boolean(Math.abs(num - val) < EPSILON).should.be.true;
		Number(reader.offset).should.equal(4+offset);
	});

});
