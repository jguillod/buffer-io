const defaults = require('./defaults');
var TYPES;

/**
 *
 * @param {Buffer} buffer
 * @param {object} [options]
 * @param {number} [options.offset=0] offset at instanciation
 * @param {boolean} [options.bigEndian=false] use Big or Low Endian (default)
 * @returns {CleverBuffer}
 */
class CleverBuffer {
	constructor(buffer, options = {}) {

		// this._executeAndIncrement = this._executeAndIncrement.bind(this);
		// this.getBuffer = this.getBuffer.bind(this);
		// this.getOffset = this.getOffset.bind(this);
		// this.skip = this.skip.bind(this);
		// this.skipTo = this.skipTo.bind(this);
		// this.trim = this.trim.bind(this);
		// this.slice = this.slice.bind(this);
		this.buffer = buffer;

		({
			offset: this.offset,
			bigEndian: this.bigEndian
		} = defaults(options, {
			offset: 0,
			bigEndian: false
		}));
	}

	/**
	 * @returns {Array.string} A list of types used by reader and writer.
	 * Selection is made by taking functions of both classes with same name.
	 */
	static types() {
		if (!TYPES) {
			const Reader = require('./clever-buffer-reader'),
				Writer = require('./clever-buffer-writer');
			const rList = Object.getOwnPropertyNames(Reader.prototype).filter(name => !['constructor'].includes(name)),
				wList = Object.getOwnPropertyNames(Writer.prototype).filter(name => !['constructor'].includes(name));
				TYPES = rList.filter(name => wList.includes(name)).sort();
		}
		return TYPES;
	}

	_realOffset(_offset) {
		return _offset != null ? _offset : this.offset;
	}

	_executeReadAndIncrement( /* number */ size, readFn, /* number | null | undefined */ _offset, /* byteLength | undefined */ ...rest) {
		const offset = this._realOffset(_offset);

		// console.log('[_executeReadAndIncrement]', offset, ...rest);
		// if(rest) console.log('ieee754 =>', require('ieee754').read(this.buffer, offset, ...rest), this.buffer);

		let val = readFn.call(this.buffer, offset, ...rest);
		if (_offset == null) {
			this.offset += size;
		}
		return val;
	}

	/**
	 *
	 * @param size length of value to be written.
	 * @param writeFn function for write; signature is `writeFn(value, offset, ...rest)`
	 * @param value data value
	 * @param [_offset] optional number of bytes to skip from start of buffer before write
	 * @param [rest] optional value for the writeFn
	 * @returns {CleverBuffer}
	 * @private
	 */
	_executeWriteAndIncrement( /* number */ size, writeFn, value, /* number | null | undefined */ _offset, /* byteLength | length, encoding | undefined */ ...rest) {
		const offset = this._realOffset(_offset);
		this._checkAllocBuffer(offset, size);

		// console.log('[_executeWriteAndIncrement]', value, offset, ...rest);
		// if(rest) console.log('ieee754', require('ieee754').write(this.buffer, value, offset, ...rest));

		const ofst = writeFn.call(this.buffer, value, offset, ...rest);
		// console.log('[_executeWriteAndIncrement]', _offset, ofst, this);
		if (_offset == null) {
			this.offset = ofst;
		}
		return this; // i.e. chainable
	}

	/**
	 *
	 * @param {number} size length of value to be written.
	 * @param {number} offset number of bytes to skip before starting to write.
	 * @private
	 */
	_checkAllocBuffer(offset, size) {
		const minSize = size + offset;
		// grow buffer when necessary
		if (this.buffer.length < minSize) { // same as willOverflow
			this.buffer = Buffer.alloc(minSize, this.buffer);
		}
	}

	/**
	 * @description returns true if bytes from offset to offset+size is not included in buffer.
	 * @param {number} size length of value to be written.
	 * @param {number} offset number of bytes to skip before starting to write.
	 * @return {boolean}
	 */
	isRangeError(size, offset) {
		const minSize = size + offset;
		// grow buffer when necessary
		return this.buffer.length < minSize || offset < 0;
	}

	get(type, ...rest) {
		try {
			return this['read' + type](...rest);
		} catch (e) {
			console.log('[clever-buffer#get] ERREUR :', `type=${type}`, e);
		}

	}
	set(type, ...rest) {
		return this['write' + type](...rest);
	}

	getBuffer() {
		return this.buffer;
	}

	get offset() {
		return this._offset;
	}

	set offset(value) {
		this._offset = value;
	}

	/**
	 * @returns {boolean} - whether the current position is at the end of the buffer
	 */
	eob() {
		return this.offset < this.buffer.length;
	}

	get length() {
		return this.buffer.length;
	}

	skip(bytesToSkip) {
		this.offset += bytesToSkip;
	}

	skipTo(offset) {
		this.offset = offset;
	}

	trim() {
		return this.buffer.slice(0, this.offset);
	}

	slice(start, end) {
		const realEnd = end ? this.offset + end : this.buffer.length;
		return this.buffer.slice(this.offset + (start || 0), realEnd);
	}
}

module.exports = CleverBuffer;