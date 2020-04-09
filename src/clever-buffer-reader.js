const defaults = require('./defaults');
const CleverBuffer = require('./clever-buffer-common');
const ieee754ReadFn = require('ieee754').read,
	ieee754Read = function (offset, isLE, mLen, nBytes) {
		return ieee754ReadFn( /* buffer */ this, offset, isLE, mLen, nBytes);
	};

/**
 * @class
 * @param {Buffer} buffer data buffer to read from
 * @param {object} [options]
 * @param {number} [options.offset=0]
 * @param {number} [options.bigEndian=false]
 */
class CleverBufferReader extends CleverBuffer {

	constructor(buffer, options = {}) {
		super(buffer, options);
	}

	/**
	 * Read a string
	 * @param {object} [options]
	 * @param {object} [options.length] number of bytes to read (byte length ≠ char length depending on encoding).
	 * When not specified, will read to the end of buffer.
	 * @param {object} [options.offset] Number of bytes to skip before starting to read string.
	 *  Default to current reader offset.
	 * @param {object} [options.encoding=utf8] The character encoding of string
	 * @returns {String} - the decoded string.
	 */
	AsString(options = {}) {
		const offsetSpecified = (options.offset != null);
		const {
			length,
			offset,
			encoding
		} = defaults(options, {
			length: 1,
			offset: this.offset,
			encoding: 'utf8'
		});
		if (length === 0) {
			return '';
		}
		const val = this.buffer.toString(encoding, offset, offset + length);
		if (!offsetSpecified) {
			this.offset += length;
		}
		return val;
	}

	/**
	 * 
	 * @param {object} option see {@link AsString} but enforce `option.encoding = utf8`
	 */
	UTF8(option = {}) {
		option.encoding = `utf8`;
		return this.AsString(option);
	}

	Bytes(options = {}) {
		const offsetSpecified = (options.offset != null);
		const {
			length,
			offset
		} = defaults(options, {
			length: 0,
			offset: this.offset
		});
		if (length === 0) {
			return [];
		}
		const val = Array.prototype.slice.call(this.buffer, offset, offset + length);
		if (!offsetSpecified) {
			this.offset += length;
		}
		return val;
	}

	Float24_32(offset) {
		return (this.bigEndian ? this.Float24_32BE : this.Float24_32LE).call(this, offset);
	}

	Float24_32BE(offset) {
		return this._executeReadAndIncrement(4, ieee754Read, offset, false, 24, 4); // offset, isLE, mLen, nBytes
	}

	Float24_32LE(offset) {
		return this._executeReadAndIncrement(4, ieee754Read, offset, true, 24, 4);
	}

	SFloat12_16(offset) {
		return (this.bigEndian ? this.SFloat12_16BE : this.SFloat12_16LE).call(this, offset);
	}
	SFloat12_16BE(offset) {
		return this._executeReadAndIncrement(2, ieee754Read, offset, false, 12, 2);
	}

	SFloat12_16LE(offset) {
		return this._executeReadAndIncrement(2, ieee754Read, offset, true, 12, 2);
	}

	BigInt64(offset) {
		return (this.bigEndian ? this.BigInt64BE : this.BigInt64LE).call(this, offset);
	}

	BigInt64BE(offset) {
		return this._executeReadAndIncrement(8, Buffer.prototype.readBigInt64BE, offset);
	}

	BigInt64LE(offset) {
		return this._executeReadAndIncrement(8, Buffer.prototype.readBigInt64LE, offset);
	}

	BigUInt64(offset) {
		return (this.bigEndian ? this.BigUInt64BE : this.BigUInt64LE).call(this, offset);
	}

	BigUInt64BE(offset) {
		return this._executeReadAndIncrement(8, Buffer.prototype.readBigUInt64BE, offset);
	}

	BigUInt64LE(offset) {
		return this._executeReadAndIncrement(8, Buffer.prototype.readBigUInt64LE, offset);
	}

	Double(offset) {
		return (this.bigEndian ? this.DoubleBE : this.DoubleLE).call(this, offset);
	}

	DoubleBE(offset) {
		return this._executeReadAndIncrement(1, Buffer.prototype.readDoubleBE, offset);
	}

	DoubleLE(offset) {
		return this._executeReadAndIncrement(1, Buffer.prototype.readDoubleLE, offset);
	}

	Float(offset) {
		return (this.bigEndian ? this.FloatBE : this.FloatLE).call(this, offset);
	}

	FloatBE(offset) {
		return this._executeReadAndIncrement(4, Buffer.prototype.readFloatBE, offset);
	}

	FloatLE(offset) {
		return this._executeReadAndIncrement(4, Buffer.prototype.readFloatLE, offset);
	}

	Int16(offset) {
		return (this.bigEndian ? this.Int16BE : this.Int16LE).call(this, offset);
	}

	Int16BE(offset) {
		return this._executeReadAndIncrement(2, Buffer.prototype.readInt16BE, offset);
	}

	Int16LE(offset) {
		return this._executeReadAndIncrement(2, Buffer.prototype.readInt16LE, offset);
	}

	Int32(offset) {
		return (this.bigEndian ? this.Int32BE : this.Int32LE).call(this, offset);
	}

	Int32BE(offset) {
		return this._executeReadAndIncrement(4, Buffer.prototype.readInt32BE, offset);
	}

	Int32LE(offset) {
		return this._executeReadAndIncrement(4, Buffer.prototype.readInt32LE, offset);
	}

	Int(offset, byteLength) {
		return (this.bigEndian ? this.IntBE : this.IntLE).call(this, offset, byteLength);
	}

	IntBE(offset, byteLength) {
		return this._executeReadAndIncrement(byteLength, Buffer.prototype.readIntBE, offset, byteLength);
	}

	IntLE(offset, byteLength) {
		return this._executeReadAndIncrement(byteLength, Buffer.prototype.readIntLE, offset, byteLength);
	}

	Int8(offset) {
		return this._executeReadAndIncrement(1, Buffer.prototype.readInt8, offset);
	}

	UInt16(offset) {
		return (this.bigEndian ? this.UInt16BE : this.UInt16LE).call(this, offset);
	}

	UInt16BE(offset) {
		return this._executeReadAndIncrement(2, Buffer.prototype.readUInt16BE, offset);
	}

	UInt16LE(offset) {
		return this._executeReadAndIncrement(2, Buffer.prototype.readUInt16LE, offset);
	}

	UInt32(offset) {
		return (this.bigEndian ? this.UInt32BE : this.UInt32LE).call(this, offset);
	}

	UInt32BE(offset) {
		return this._executeReadAndIncrement(4, Buffer.prototype.readUInt32BE, offset);
	}

	UInt32LE(offset) {
		return this._executeReadAndIncrement(4, Buffer.prototype.readUInt32LE, offset);
	}

	UInt8(offset) {
		return this._executeReadAndIncrement(1, Buffer.prototype.readUInt8, offset);
	}

	UInt(offset, byteLength) {
		return (this.bigEndian ? this.UIntBE : this.UIntLE).call(this, offset, byteLength);
	}

	UIntBE(offset, byteLength) {
		return this._executeReadAndIncrement(byteLength, Buffer.prototype.readUIntBE, offset, byteLength);
	}

	UIntLE(offset, byteLength) {
		return this._executeReadAndIncrement(byteLength, Buffer.prototype.readUIntLE, offset, byteLength);
	}

}

// Let's build aliases of functons with lowercased names 
Object.getOwnPropertyNames(CleverBufferReader.prototype)
	.filter(name => !['constructor'].includes(name))
	.forEach(name => CleverBufferReader.prototype[name.toLowerCase()] = CleverBufferReader.prototype[name]);

module.exports = CleverBufferReader;