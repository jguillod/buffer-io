const defaults = require('./defaults');
const BufferIO = require('./buffer-common');
const ieee754WriteFn = require('ieee754').write,
	ieee754Write = function (value, offset, isLE, mLen, nBytes) {
		ieee754WriteFn( /* buffer */ this, value, offset, isLE, mLen, nBytes);
		return offset + nBytes;
	};

class BufferIOWriter extends BufferIO {

	/**
	 * @extends BufferIO
	 * @param {Buffer} buffer
	 * @param {object} [options]
	 * @param {number} [options.offset=0] offset at instanciation
	 * @param {boolean} [options.bigEndian=false] use Big or Low Endian (default)
	 * @returns {BufferIOWriter}
	 */
	constructor(buffer, options = {}) {
		super(buffer, options);
	}

	/**
	 *
	 * @param {string} value String to be written to buffer
	 * @param {object} [options]
	 * @param {object} [options.length] number of bytes to write (byte length ≠ char length depending on encoding)
	 * @param {object} [options.offset] Number of bytes to skip before starting to write string.
	 *  Default to current reader offset.
	 * @param {object} [options.encoding=utf8] The character encoding of string
	 * @return {BufferIOWriter}
	 */
	AsString(value, options = {}) {
		// return this.Bytes(Buffer.from(value, options.encoding || 'utf8'), options);
		const offsetSpecified = (options.offset != null);
		let {
			length,
			offset,
			encoding
		} = defaults(options, {
			length: null,
			offset: this.offset,
			encoding: 'utf8'
		});
		let maxlen = Buffer.from(value, encoding).length;
		length = Math.min(length || maxlen, maxlen);
		this._checkAllocBuffer(offset, length);
		length = this.buffer.write(value, offset, length, encoding);
		if (!offsetSpecified) {
			this.offset += length;
		}
		return this;
	}
	/**
	 * 
	 * @param {object} option see {@link BufferIOWriter#AsString} but enforce `option.encoding = utf8`
	 */
	UTF8(value, option = {}) {
		option.encoding = `utf8`;
		return this.AsString(value, option);
	}

	/**
	 * Write data
	 * @param value Bytes to be writen to buffer
	 * @param {Array|Buffer|UIn8Array|ArrayBuffer|SharedArrayBuffer|string|Object} [options] An ArrayBuffer, SharedArrayBuffer, for example the .buffer property of a TypedArray.
	 * An object supporting `Symbol.toPrimitive` or `valueOf()`. See variation in nodejs documentation on
	 * [`Buffer.from`](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_array).
	 * @param {object} [options.length] number of bytes to write (byte length ≠ char length depending on encoding)
	 * @param {object} [options.offset] Index in buffer where to start writing. Default is current offset
	 * @return {BufferIOWriter} This buffer writer.
	 */
	Bytes(value, options = {}) {
		const offsetSpecified = (options.offset != null);
		let {
			length,
			offset
		} = defaults(options, {
			length: null,
			offset: this.offset
		});
		if (!(value instanceof Buffer)) value = Buffer.from(value);
		length = Math.min(value.length, length || value.length);
		this._checkAllocBuffer(offset, value.length);
		length = value.copy(this.buffer, offset, 0, length);
		if (!offsetSpecified) {
			this.offset += length;
		}
		return this;
	}


	/**
	 * @param {Float} value Number to be written to buffer
	 * @param {object} offset Number of bytes to skip before starting to write string.
	 * @return {BufferIOWriter} This buffer writer.
	 */

	Float24_32(value, offset) {
		return (this.bigEndian ? this.Float24_32BE : this.Float24_32LE).call(this, value, offset);
	}

	Float24_32BE(value, offset) {
		return this._executeWriteAndIncrement(4, ieee754Write, value, offset, false, 24, 4); // offset, isLE, mLen, nBytes
	}

	Float24_32LE(value, offset) {
		return this._executeWriteAndIncrement(4, ieee754Write, value, offset, true, 24, 4);
	}

	SFloat12_16(value, offset) {
		return (this.bigEndian ? this.SFloat12_16BE : this.SFloat12_16LE).call(this, value, offset);
	}
	SFloat12_16BE(value, offset) {
		return this._executeWriteAndIncrement(2, ieee754Write, value, offset, false, 12, 2);
	}

	SFloat12_16LE(value, offset) {
		return this._executeWriteAndIncrement(2, ieee754Write, value, offset, true, 12, 2);
	}

	BigInt64(value, offset) {
		return (this.bigEndian ? this.BigInt64BE : this.BigInt64LE).call(this, value, offset);
	}

	BigInt64BE(value, offset) {
		return this._executeWriteAndIncrement(8, Buffer.prototype.writeBigInt64BE, value, offset);
	}

	BigInt64LE(value, offset) {
		return this._executeWriteAndIncrement(8, Buffer.prototype.writeBigInt64LE, value, offset);
	}

	BigUInt64(value, offset) {
		return (this.bigEndian ? this.BigUInt64BE : this.BigUInt64LE).call(this, value, offset);
	}

	BigUInt64BE(value, offset) {
		return this._executeWriteAndIncrement(8, Buffer.prototype.writeBigUInt64BE, value, offset);
	}

	BigUInt64LE(value, offset) {
		return this._executeWriteAndIncrement(8, Buffer.prototype.writeBigUInt64LE, value, offset);
	}

	Double(value, offset) {
		return (this.bigEndian ? this.DoubleBE : this.DoubleLE).call(this, value, offset);
	}

	DoubleBE(value, offset) {
		return this._executeWriteAndIncrement(8, Buffer.prototype.writeDoubleBE, value, offset);
	}

	DoubleLE(value, offset) {
		return this._executeWriteAndIncrement(8, Buffer.prototype.writeDoubleLE, value, offset);
	}

	Float(value, offset) {
		return (this.bigEndian ? this.FloatBE : this.FloatLE).call(this, value, offset);
	}

	FloatBE(value, offset) {
		return this._executeWriteAndIncrement(4, Buffer.prototype.writeFloatBE, value, offset);
	}

	FloatLE(value, offset) {
		return this._executeWriteAndIncrement(4, Buffer.prototype.writeFloatLE, value, offset);
	}

	Int16(value, offset) {
		return (this.bigEndian ? this.Int16BE : this.Int16LE).call(this, value, offset);
	}

	Int16BE(value, offset) {
		return this._executeWriteAndIncrement(2, Buffer.prototype.writeInt16BE, value, offset);
	}

	Int16LE(value, offset) {
		return this._executeWriteAndIncrement(2, Buffer.prototype.writeInt16LE, value, offset);
	}

	Int32(value, offset) {
		return (this.bigEndian ? this.Int32BE : this.Int32LE).call(this, value, offset);
	}

	Int32BE(value, offset) {
		return this._executeWriteAndIncrement(4, Buffer.prototype.writeInt32BE, value, offset);
	}

	Int32LE(value, offset) {
		return this._executeWriteAndIncrement(4, Buffer.prototype.writeInt32LE, value, offset);
	}

	Int8(value, offset) {
		return this._executeWriteAndIncrement(1, Buffer.prototype.writeInt8, value, offset);
	}

	/** Writes byteLength bytes of value to buf at the specified offset. Supports up to 48 bits of accuracy.
	 * Behavior is undefined when value is anything other than a signed integer.
	 * @param {string} value Number to be written to buffer
	 * @param {integer} offset Index in bytes where to start to write.
	 * @param {integer} byteLength Number of bytes to write. Must satisfy 0 < byteLength <= 6.
	 * @return {number} - Value read.
	 */

	Int(value, offset, byteLength) {
		return (this.bigEndian ? this.IntBE : this.IntLE).call(this, value, offset, byteLength);
	}

	/**
	 * see {@link BufferIOWriter#Int}
	 */
	IntBE(value, offset, byteLength) {
		return this._executeWriteAndIncrement(byteLength, Buffer.prototype.writeIntBE, value, offset, byteLength);
	}

	/**
	 * see {@link BufferIOWriter#Int}
	 */
	IntLE(value, offset, byteLength) {
		return this._executeWriteAndIncrement(byteLength, Buffer.prototype.writeIntLE, value, offset, byteLength);
	}

	UInt16(value, offset) {
		return (this.bigEndian ? this.UInt16BE : this.UInt16LE).call(this, value, offset);
	}

	UInt16BE(value, offset) {
		return this._executeWriteAndIncrement(2, Buffer.prototype.writeUInt16BE, value, offset);
	}

	UInt16LE(value, offset) {
		return this._executeWriteAndIncrement(2, Buffer.prototype.writeUInt16LE, value, offset);
	}

	UInt32(value, offset) {
		return (this.bigEndian ? this.UInt32BE : this.UInt32LE).call(this, value, offset);
	}

	UInt32BE(value, offset) {
		return this._executeWriteAndIncrement(4, Buffer.prototype.writeUInt32BE, value, offset);
	}

	UInt32LE(value, offset) {
		return this._executeWriteAndIncrement(4, Buffer.prototype.writeUInt32LE, value, offset);
	}

	UInt8(value, offset) {
		return this._executeWriteAndIncrement(1, Buffer.prototype.writeUInt8, value, offset);
	}

	/** Writes byteLength bytes of value to buf at the specified offset. Supports up to 48 bits of accuracy.
	 * Behavior is undefined when value is anything other than a signed integer.
	 * @param {integer} offset Index in bytes where to start to write.
	 * @param {integer} byteLength Number of bytes to write. Must satisfy 0 < byteLength <= 6.
	 * @return {number} - Value read.
	 */

	UInt(value, offset, byteLength) {
		return (this.bigEndian ? this.UIntBE : this.UIntLE).call(this, value, offset, byteLength);
	}

	/**
	 * see {@link BufferIOWriter#Int}
	 */
	UIntBE(value, offset, byteLength) {
		return this._executeWriteAndIncrement(byteLength, Buffer.prototype.writeUIntBE, value, offset, byteLength);
	}

	/**
	 * see {@link BufferIOWriter#Int}
	 */
	UIntLE(value, offset, byteLength) {
		return this._executeWriteAndIncrement(byteLength, Buffer.prototype.writeUIntLE, value, offset, byteLength);
	}

}

// same alias:
BufferIOWriter.prototype.UInt64 = BufferIOWriter.prototype.BigUInt64;
BufferIOWriter.prototype.UInt64BE = BufferIOWriter.prototype.BigUInt64BE;
BufferIOWriter.prototype.UInt64LE = BufferIOWriter.prototype.BigUInt64LE;
BufferIOWriter.prototype.Int64 = BufferIOWriter.prototype.BigInt64;
BufferIOWriter.prototype.Int64BE = BufferIOWriter.prototype.BigInt64BE;
BufferIOWriter.prototype.Int64LE = BufferIOWriter.prototype.BigInt64LE;

// Let's build aliases of functions with lowercased names 
Object.getOwnPropertyNames(BufferIOWriter.prototype)
	.filter(name => !['constructor'].includes(name))
	.forEach(name => BufferIOWriter.prototype[name.toLowerCase()] = BufferIOWriter.prototype[name]);


module.exports = BufferIOWriter;

// BufferIOWriter
/**
 * @name BufferIOWriter#BigInt64
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#BigInt64BE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#BigInt64LE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#BigUInt64
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#BigUInt64BE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#BigUInt64LE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Double
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#DoubleBE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#DoubleLE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Float
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Float24_32
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Float24_32BE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Float24_32LE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#FloatBE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#FloatLE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Int16
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Int16BE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Int16LE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Int32
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Int32BE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Int32LE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Int64
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Int64BE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Int64LE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#Int8
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#SFloat12_16
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#SFloat12_16BE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#SFloat12_16LE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#UInt16
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#UInt16BE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#UInt16LE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#UInt32
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#UInt32BE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#UInt32LE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#UInt64
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#UInt64BE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#UInt64LE
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

/**
 * @name BufferIOWriter#UInt8
 * @function
 * @param {number} value - Number to be written to buffer.
 * @param {integer} offset Index in bytes where to start to write.
 * @return {BufferIOWriter} This buffer writer.
 */

// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ