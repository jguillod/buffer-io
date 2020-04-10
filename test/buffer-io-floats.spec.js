/*
const {BufferIOWriter, BufferIOReader} = require('./');
w = new BufferIOWriter(Buffer.alloc(20));
r = new BufferIOReader(w.getBuffer());
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


const expect = require('chai').expect;

const {
	BufferIOWriter,
	BufferIOReader
} = require('..');

const SEPSILON = 0.001;
const EPSILON = 0.0001;

console.log('LOADED', __filename);

describe('BufferIO Writer/Reader using ieee754', () => {

	it('should write and read SFloat12_16', function () {
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

		expect(Boolean(Math.abs(num - val) < SEPSILON)).to.be.true;
		expect(Number(reader.offset)).to.equal(2);
		expect(Number(writer.offset)).to.equal(2);
		num = reader.SFloat12_16(0);
		expect(Boolean(Math.abs(num - val) < SEPSILON)).to.be.true;
	});

	it('should write and read SFloat12_16LE', function () {
		const val = 2.45,
			writer = new BufferIOWriter(Buffer.alloc(5), {
				offset: 1,
				bigEndian: false
			}),
			reader = new BufferIOReader(writer.getBuffer());
		writer.SFloat12_16(val);
		var num = reader.SFloat12_16LE(1);
		// console.log('∆ =>', Math.abs(num - val) < SEPSILON, Math.abs(num - val), num, val);
		expect(Boolean(Math.abs(num - val) < SEPSILON)).to.be.true;
		expect(Number(reader.offset)).to.equal(0);
		expect(Number(writer.offset)).to.equal(3);
		reader.offset = 1;
		num = reader.SFloat12_16LE();
		expect(Boolean(Math.abs(num - val) < SEPSILON)).to.be.true;
		expect(Number(reader.offset)).to.equal(3);
	});

	it('should write and read Float24_32', function () {
		const val = 126.422234,
			offset = 2, // offset 2 is arbitrary
			writer = new BufferIOWriter(Buffer.alloc(30)),
			reader = new BufferIOReader(writer.getBuffer());
		writer.Float24_32BE(val, offset);
		var num = reader.Float24_32BE(offset);
		// console.log('∆ =>', Math.abs(num - val) < EPSILON, Math.abs(num - val), num, val);
		// console.log('writer.buffer', writer.buffer);
		// console.log('reader.buffer', reader.buffer);
		expect(Boolean(Math.abs(num - val) < EPSILON)).to.be.true;
		expect(Number(reader.offset)).to.equal(0);
		expect(Number(writer.offset)).to.equal(0);
		num = reader.Float24_32BE(offset);
		expect(Boolean(Math.abs(num - val) < EPSILON)).to.be.true;
	});

	it('should write and read Float24_32BE', function () {
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
		expect(Boolean(Math.abs(num - val) < EPSILON)).to.be.true;
		expect(Number(reader.offset)).to.equal(0);
		expect(Number(writer.offset)).to.equal(4 + offset);
		reader.offset = offset;
		num = reader.Float24_32();
		expect(Boolean(Math.abs(num - val) < EPSILON)).to.be.true;
		expect(Number(reader.offset)).to.equal(4 + offset);
	});

});