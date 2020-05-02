const defaults = require('./defaults');
var TYPES;

class BufferIO {

	/**
	 * This a the superclass for both {@link BufferIOReader} and ${@link BufferIOWriter}.
	 * @abstract
	 * @hideconstructor
	 * @param {Buffer} buffer
	 * @param {object} [config]
	 * @param {number} [config.offset=0] offset at instanciation
	 * @param {boolean} [config.bigEndian=false] use Big or Low Endian (LE by default)
	 * @returns {BufferIO}
	 */
	constructor(buffer, config = {}) {

		// this._executeAndIncrement = this._executeAndIncrement.bind(this);
		// this.getBuffer = this.getBuffer.bind(this);
		// this.getOffset = this.getOffset.bind(this);
		// this.skip = this.skip.bind(this);
		// this.skipTo = this.skipTo.bind(this);
		// this.trim = this.trim.bind(this);
		// this.slice = this.slice.bind(this);
		this.buffer = buffer;

		({
			offset: this._offset,
			bigEndian: this.bigEndian
		} = defaults(config, {
			offset: 0,
			bigEndian: false
		}));
	}

	/*
	 * @private
	 * @example
	 * console.log(require('./src/buffer-common')._doc_generator());
	 */
	static _doc_generator() {
		const exclusion = ['asstring', 'utf8', 'bytes', 'int', 'intle', 'intbe', 'uint', 'uintle', 'uintbe'];
		const types = this.types()
		.filter(f => (!exclusion.includes(f) && !exclusion.includes(f.toLowerCase()) 
		&& (f != f.toLowerCase())))
		.sort().sort((a, b) => {
			return ((a = a.toLowerCase()) > (b = b.toLowerCase())) ? 1 : (a == b ? 0 : -1);
		});
		return '// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ' +
			'\n// BufferIOWriter\n' +
			types.map(f => {
				return `/**
* @name BufferIOWriter#${f}
* @function 
* @param {number} value - Value to write.
* @param {integer} offset Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - byteLength.
* @return {BufferIOWriter} This buffer writer.
*/`;
			}).join('\n\n') +
			'\n// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ' +
			'\n// BufferIOReader\n' +
			types.map(f => {
				return `/**
* @name BufferIOReader#${f}
* @function 
* @param {integer} offset Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - byteLength.
* @return {number} - Value read.
*/`;
			}).join('\n\n') +
			'\n// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ';
	}
	/**
	 * @returns {Array.string} A list of types which are functions to read/write from/to buffer.
	 * Selection is made by taking functions of both classes with same name.
	 * @example
	 * const { types } = require('@imed.ch/buffer-io');
	 * types(); // => list of functions
	 * 
	 * // These are equivalent :
	 * reader.UInt8();
	 * reader.uint8();
	 * reader['UInt8']();
	 * reader['uint8']();
	 * let type = 'uint8';
	 * reader[type]();
	 */
	static types() {
		if (!TYPES) {
			const Reader = require('./buffer-reader'),
				Writer = require('./buffer-writer');
			const rList = Object.getOwnPropertyNames(Reader.prototype).filter(name => !['constructor'].includes(name)),
				wList = Object.getOwnPropertyNames(Writer.prototype).filter(name => !['constructor'].includes(name));
			TYPES = rList.filter(name => wList.includes(name)).sort();
		}
		return TYPES;
	}

	_realOffset(_offset) {
		return _offset != null ? _offset : this._offset;
	}

	_executeReadAndIncrement( /* number */ size, readFn, /* number | null | undefined */ _offset, /* byteLength | undefined */ ...rest) {
		const offset = this._realOffset(_offset);

		// console.log('[_executeReadAndIncrement]', offset, ...rest);
		// if(rest) console.log('ieee754 =>', require('ieee754').read(this.buffer, offset, ...rest), this.buffer);

		let val = readFn.call(this.buffer, offset, ...rest);
		if (_offset == null) {
			this._offset += size;
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
	 * @returns {BufferIO}
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
			this._offset = ofst;
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

	/**
	 * Execute the function given a type.
	 * @param {string} type the name of a function, e.g. `uint8`.
	 * @param  {...any} rest parameter for the function, e.g. `offset`.
	 */
	io(type, ...rest) {
		return this[type](...rest);
	}

	/**
	 * @returns {BUffer} The data buffer.
	 */
	getBuffer() {
		return this.buffer;
	}

	/**
	 * The current offset.
	 * @example
	 * current = reader.offset;
	 * reader.offset = current + 10;
	 */
	get offset() {
		return this._offset;
	}

	set offset(value) {
		this._offset = value;
	}

	/**
	 * @returns {boolean} - `true` if the current position is at the end of the buffer.
	 */
	eob() {
		return this._offset >= this.buffer.length;
	}

	/**
	 * @property
	 * The length of buffer.
	 */
	get length() {
		return this.buffer.length;
	}

	/**
	 * 
	 * @param {integer} sizeToSkip number of bytes to skip (recalculate offset).
	 */
	skip(sizeToSkip) {
		this._offset += sizeToSkip;
	}
	/**
	 * Set a new value for offset
	 * @param {integer} offset 
	 */
	skipTo(offset) {
		this._offset = offset;
	}

	/**
	 * Will return a buffer slice from the start of the buffer to the current offset.
	 * @example
	 * var buf = Buffer.from([0xFF, 0x02]);
	 * var reader = new BufferIOReader(buf);
	 * reader.UInt8();
	 * console.log(reader.trim()); // [0xFF]
	 * console.log(buf);           // [0xFF, 0x02]
	 */
	trim() {
		return this.buffer.slice(0, this._offset);
	}

	/**
	 * Will return a buffer slice from the start of the buffer to the current offset
	 * @example
	 * var buf = Buffer.from([0xFF, 0x02]);
	 * var reader = new BufferIOReader(buf);
	 * reader.UInt8();
	 * console.log(reader.trim()); // [0xFF]
	 * console.log(buf);           // [0xFF, 0x02]
	 * @param {integer} start
	 * @param {integer} end 
	 */
	slice(start, end) {
		const realEnd = end ? this._offset + end : this.buffer.length;
		return this.buffer.slice(this._offset + (start || 0), realEnd);
	}
}

module.exports = BufferIO;