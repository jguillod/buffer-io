const defaults = require('./defaults');
const BufferIO = require('./buffer-common');
const ieee754ReadFn = require('ieee754').read,
	ieee754Read = function (offset, isLE, mLen, nBytes) {
		return ieee754ReadFn( /* buffer */ this, offset, isLE, mLen, nBytes);
	};

class BufferIOReader extends BufferIO {

	/**
	 * @extends BufferIO
	 * @param {Buffer} buffer
	 * @param {object} [options]
	 * @param {number} [options.offset=0] offset at instanciation
	 * @param {boolean} [options.bigEndian=false] use Big or Low Endian (default)
	 * @returns {BufferIOReader}
	 */
	constructor(buffer, options = {}) {
		super(buffer, options);
	}

	/**
	 * Read a string
	 * @param {object} [options]
	 * @param {object} [options.length=0] number of bytes to read (byte length ≠ char length depending on encoding).
	 * When not specified, will read to the end of buffer.
	 * @param {object} [options.offset] Number of bytes to skip before starting to read string.
	 *  Default to current reader offset.
	 * @param {object} [options.encoding=utf8] The character encoding of string
	 * @returns {String} - the decoded string, `''` if length was `0`.
	 */
	AsString(options = {}) {
		const offsetSpecified = (options.offset != null);
		const {
			length,
			offset,
			encoding
		} = defaults(options, {
			length: 0,
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
	 * Same as {@link BufferIOReader#AsString} but enforce `option.encoding = utf8`.
	 */
	UTF8(option = {}) {
		option.encoding = `utf8`;
		return this.AsString(option);
	}

	/**
	 *
	 * @param value
	 * @param {object} [options]
	 * @param {object} [options.length] number of bytes to read (byte length ≠ char length depending on encoding)
	 * @param {object} [options.offset] Index in buffer where to start reading. Default is current offset.
	 * @return {BufferIOWriter} This buffer writer.
	 */
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


	/**
	 * @param {integer} offset Index in bytes where to start to read.
	 * @param {integer} byteLength Number of bytes to read. Must satisfy 0 < byteLength <= 6.
	 * @return {number} - Value read.
	 */
	Int(offset, byteLength) {
		return (this.bigEndian ? this.IntBE : this.IntLE).call(this, offset, byteLength);
	}

	/**
	 * see {@link BufferIOReader#Int}
	 */
	IntBE(offset, byteLength) {
		return this._executeReadAndIncrement(byteLength, Buffer.prototype.readIntBE, offset, byteLength);
	}

	/**
	 * see {@link BufferIOReader#Int}
	 */
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

	/**
	 * @param {integer} offset Index in bytes where to start to read.
	 * @param {integer} byteLength Number of bytes to read. Must satisfy 0 < byteLength <= 6.
	 * @return {number} - Value read.
	 */
	UInt(offset, byteLength) {
		return (this.bigEndian ? this.UIntBE : this.UIntLE).call(this, offset, byteLength);
	}

	/**
	 * see {@link BufferIOReader#UInt}
	 */
	UIntBE(offset, byteLength) {
		return this._executeReadAndIncrement(byteLength, Buffer.prototype.readUIntBE, offset, byteLength);
	}

	/**
	 * see {@link BufferIOReader#UInt}
	 */
	UIntLE(offset, byteLength) {
		return this._executeReadAndIncrement(byteLength, Buffer.prototype.readUIntLE, offset, byteLength);
	}

}

// same alias:
BufferIOReader.prototype.UInt64 = BufferIOReader.prototype.BigUInt64;
BufferIOReader.prototype.UInt64BE = BufferIOReader.prototype.BigUInt64BE;
BufferIOReader.prototype.UInt64LE = BufferIOReader.prototype.BigUInt64LE;
BufferIOReader.prototype.Int64 = BufferIOReader.prototype.BigInt64;
BufferIOReader.prototype.Int64BE = BufferIOReader.prototype.BigInt64BE;
BufferIOReader.prototype.Int64LE = BufferIOReader.prototype.BigInt64LE;

// Let's build aliases of functions with lowercased names 
Object.getOwnPropertyNames(BufferIOReader.prototype)
	.filter(name => !['constructor'].includes(name))
	.forEach(name => BufferIOReader.prototype[name.toLowerCase()] = BufferIOReader.prototype[name]);

module.exports = BufferIOReader;

// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ
// BufferIOReader
/**
 * @name BufferIOReader#BigInt64
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#BigInt64BE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#BigInt64LE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#BigUInt64
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#BigUInt64BE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#BigUInt64LE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Double
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#DoubleBE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#DoubleLE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Float
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Float24_32
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Float24_32BE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Float24_32LE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#FloatBE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#FloatLE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */


/**
 * @name BufferIOReader#Int16
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Int16BE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Int16LE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Int32
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Int32BE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Int32LE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Int64
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Int64BE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Int64LE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#Int8
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#SFloat12_16
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#SFloat12_16BE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#SFloat12_16LE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#UInt16
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#UInt16BE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#UInt16LE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#UInt32
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#UInt32BE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#UInt32LE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#UInt64
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#UInt64BE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#UInt64LE
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

/**
 * @name BufferIOReader#UInt8
 * @function
 * @param {integer} offset Index in bytes where to start to read.
 * @return {number} - Value read.
 */

// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ