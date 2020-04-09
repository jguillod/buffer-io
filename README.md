# @imed.ch/clever-buffer

# DEPRECATED ! PLEASE ! DO NOT USE THIS FORK.

> Since the source code was completely rewritten with a different API we stop this module.  
Have a look to our module <a href="/jguillod/buffer-io">@imed.ch/buffer-io</a>.

Buffer write and read utilities.

CleverBuffer adds functionality that is missing from the node Buffer class

* Keeps track of the offset for you
* One time specification of endian-ness and whether to assert on buffer length
* 64 bit integer support. We dont use any non standard NodeJS 12.x dependencies.
## Installation

``` js
npm install @imed.ch/clever-buffer
```

_NOTE_: Examples below in javascript

## Reader Usage

#### Requiring the reader in your project
``` js
{ CleverBufferReader } = require('@imed.ch/clever-buffer');
```

#### new CleverBufferReader existingBuffer, [options]
* existingBuffer Buffer
* options
  * offset Number, Optional, Default: 0
  * bigEndian Boolean, Optional, Default: false

Allocates a new CleverBufferReader with an internal buffer of the specified existingBuffer
``` js
var reader = new CleverBufferReader(existingBuffer, { offset: 0, bigEndian: false});
```

#### reader.getUInt8([offset])
* offset Number, Optional, Default: current buffer position

Returns an Unsigned 8bit Integer from the current offset

``` js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new CleverBufferReader(buf);
console.log(reader.getUInt8()); // 255
console.log(reader.getUInt8()); // 2
```

#### reader.getInt8([offset])
* offset Number, Optional, Default: current buffer position

Returns a Signed 8bit Integer from the current offset

``` js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new CleverBufferReader(buf);
console.log(reader.getInt8()); // -1
console.log(reader.getInt8()); // 2
```

#### reader.getUInt16([offset])
* offset Number, Optional, Default: current buffer position

Returns an Unsigned 16bit Integer from the current offset.

``` js
var buf = Buffer.from([0xFF, 0xFF, 0x02, 0x00]);
var reader = new CleverBufferReader(buf);
console.log(reader.getUInt16()); // 65535
console.log(reader.getUInt16()); // 2
```

#### reader.getInt16([offset])
* offset Number, Optional, Default: current buffer position

Returns a Signed 16bit Integer from the current offset

```js
var buf = Buffer.from([0xFF, 0xFF, 0x02, 0x00]);
var reader = new CleverBufferReader(buf);
console.log(reader.getInt16()); // -1
console.log(reader.getInt16()); // 2
```

#### reader.getUInt32([offset])
* offset Number, Optional, Default: current buffer position

Returns an Unsigned 32bit Integer from the current offset.

``` js
var buf = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]);
var reader = new CleverBufferReader(buf);
console.log(reader.getUInt32()); // 4294967295
```

#### reader.getInt32([offset])
* offset Number, Optional, Default: current buffer position

Returns a Signed 32bit Integer from the current offset

``` js
var buf = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]);
var reader = new CleverBufferReader(buf);
console.log(reader.getInt32()); // -1
```

#### reader.getBigUInt64([offset])
* offset Number, Optional, Default: current buffer position

Returns an Unsigned 64bit Integer from the current offset.

The value will be returned as a string


```js
var buf = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF,0xFF, 0xFF, 0xFF, 0xFF]);
var reader = new CleverBufferReader(buf);
console.log(reader.getBigUInt64()); // "18446744073709551615"
```

#### reader.getBigInt64([offset])
* offset Number, Optional, Default: current buffer position

Returns a Signed 64bit Integer from the current offset

The value will be returned as a string


```js
var buf = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF,0xFF, 0xFF, 0xFF, 0xFF]);
var reader = new CleverBufferReader(buf);
console.log(reader.getBigInt64()); // "-1"
```

#### reader.getString([options])
* options Optional
  * length Number, Optional, Default: 0
  * offset Number, Optional, Default: current offset. If an offset is specified the current offset will not be incremented
  * encoding String, Optional, Default: 'utf-8'

Returns utf-8 encoded string of specified length

`readString` is an alias of `getString`

```js
var buf = Buffer.from([0x48, 0x45, 0x4C, 0x4C, 0x4F]);
var reader = new CleverBufferReader(buf);
console.log(reader.getString({length: 5})); // "HELLO"
```

## Writer Usage

#### Requiring the writer in your project
```js
const { CleverBufferWriter } = require('@imed.ch/clever-buffer');
```

#### new CleverBufferWriter existingBuffer, [options]
* existingBuffer Buffer
* options
  * offset Number, Optional, Default: 0
  * bigEndian Boolean, Optional, Default: false

Allocates a new CleverBufferWriter with an internal buffer of the specified existingBuffer
```js
var writer = new CleverBufferWriter(existingBuffer, {offset: 0, bigEndian: false});
```

#### Any writer returns itself and therefore is chainable

```js
writer.writeUInt8(255);
writer.writeUInt8(2);
```

is equivalent to :

```js
writer.writeUInt8(255).writeUInt8(2);
```

#### writer.writeUInt8(value, [offset])
* value Number
* offset Number, Optional, Default: current buffer position

Writes an Unsigned 8bit Integer to the specified/current offset

```js
var buf = Buffer.alloc(2);
var writer = new CleverBufferWriter(buf);
writer.writeUInt8(255);
writer.writeUInt8(2);
console.log(buf); // [0xFF, 0x02]
```

#### writer.writeInt8(value, [offset])
* value Number
* offset Number, Optional, Default: current buffer position

Writes an signed 8bit Integer to the specified/current offset

```js
var buf = Buffer.alloc(2);
var writer = new CleverBufferWriter(buf);
writer.writeInt8(-1);
writer.writeInt8(2);
console.log(buf); // [0xFF, 0x02]
```

#### writer.writeUInt16(value, [offset])
* value Number
* offset Number, Optional, Default: current buffer position

Writes an Unsigned 16bit Integer to the specified/current offset

```js
var buf = Buffer.alloc(4);
var writer = new CleverBufferWriter(buf);
writer.writeUInt16(65535);
writer.writeUInt16(2);
console.log(buf); // [0xFF, 0xFF, 0x02, 0x00]
```

#### writer.writeInt16(value, [offset])
* value Number
* offset Number, Optional, Default: current buffer position

Writes an Signed 16bit Integer to the specified/current offset

```js
buf = Buffer.alloc(4);
writer = new CleverBufferWriter(buf);
writer.writeInt16(-1);
writer.writeInt16(2);
console.log(buf); // [0xFF, 0xFF, 0x02, 0x00]
```
#### writer.writeUInt32(value, [offset])
* value Number
* offset Number, Optional, Default: current buffer position

Writes an Unsigned 32bit Integer to the specified/current offset

```js
var buf = Buffer.alloc(4);
var writer = new CleverBufferWriter(buf);
writer.writeUInt32(4294967295);
console.log(buf); // [0xFF, 0xFF, 0xFF, 0xFF]
```

#### writer.writeInt32(value, [offset])
* value Number
* offset Number, Optional, Default: current buffer position

Writes an signed 32bit Integer to the specified/current offset

```js
var buf = Buffer.alloc(4);
var writer = new CleverBufferWriter(buf);
writer.writeInt32(-1);
console.log(buf); // [0xFF, 0xFF, 0xFF, 0xFF]
```
#### writer.writeString(value, [options])
* value String
* options Optional
  * length Number, Optional, number of bytes to write. Note this can be greater than `value.length` for non ASCII encodings. If not specified, will default to the right number of bytes for the chosen encoding.
  * offset Number, Optional, Default: current offset. If an offset is specified the current offset will not be incremented
  * encoding String, Optional, Default: 'utf-8'
* returns the number of bytes written

Writes string to the buffer

```js
var buf =  Buffer.alloc(8);
var writer = new CleverBufferWriter(buf);
var len = writer.writeString("héllo");
console.log(len, buf); // 6, [0x68, 0xc3, 0xa9, 0x6c, 0x6c, 0x6f, 0x00, 0x00]
```

## Error Handling

Note that this module does not run any assertion and you have to deal with yourself&nbsp;:
```js
try {
    let str = reader.getString({length: 5});
    writer.setUInt32(/* value */ 87234, /* offset */ 15)
        .setDouble(34,553);
} catch(e) {
  if (e instanceof TypeError) {
    // statements to handle TypeError exceptions
  } else if (e instanceof RangeError) {
    // statements to handle RangeError exceptions
  } else {
    // statements to handle any unspecified exceptions
    logMyErrors(e); // pass exception object to error handler
  }

}
```
## Common Functionality
The following is common to CleverBufferReader and CleverBufferWriter (The examples only show reader)

#### reader.offset
Gets the current offset of the buffer
```js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new CleverBufferReader(buf);
console.log(reader.offset); // 0
reader.getUInt8();
console.log(reader.offset); // 1
reader.getUInt8();
console.log(reader.offset); // 2  
```

Sets the current offset of the buffer  
<small>In most case you will set `offset` in the `options` parameter of read/write functions. But it is possible to set it manually with&nbsp;:</small>
```js
reader.offset = 3;
writer.offset = 4;
```
For a reader `offset` should be in range of `0..reader.length`.

#### reader.eob()
This function returns `true` if offset is set passed the end of buffer.

#### reader.skip(bytes)
* bytes Number

Skips the current offset forward the specified bytes amount

```js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new CleverBufferReader(buf);
console.log(reader.offset); // 0
reader.skip(2);
console.log(reader.offset); // 2  
```

#### reader.skipTo(offset)
* offset Number

Skips to the specified offset

```js
var buf = Buffer.from([0xFF, 0xFF, 0xFF, 0x01]);
var reader = new CleverBufferReader(buf);
console.log(reader.offset); // 0
reader.skipTo(3);
console.log(reader.offset); // 3  
```

#### reader.getBuffer()
Will return the underlying buffer so you can perform actions directly on it

```js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new CleverBufferReader(buf);
console.log(reader.getBuffer()[1]); // 2
```

#### reader.trim()
Will return a buffer slice from the start of the buffer to the current offset

```js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new CleverBufferReader(buf);
reader.getUInt8();
console.log(reader.trim()); // [0xFF]
console.log(buf);           // [0xFF, 0x02]
```

## API signatures

### Reader/Writer API ###

	value = reader[type](offset);
	value = reader[type]();
	reader.AsString({
		length, // number of bytes to write (byte length ≠ char length depending on encoding)
		offset, // Number of bytes to skip before starting to write string.
		encoding, // The character encoding of string, default 'utf8'
	});
	
	writer[type](value, offset);
	writer[type](value);
	writer.AsString(value, {
		length, // number of bytes to write (byte length ≠ char length depending on encoding)
		offset, // Number of bytes to skip before starting to write string.
		encoding, // The character encoding of string, default 'utf8'
	});

where type is one of&nbsp;:

	AsString Bytes
	UTF8 // alias to  AsString() but enforce UTF-8 encoding.
	BigInt64 BigInt64BE BigInt64LE BigUInt64 BigUInt64BE BigUInt64LE Bytes Double DoubleBE DoubleLE Float Float32 Float32BE Float32LE FloatBE FloatLE Int Int16 Int16BE Int16LE Int32 Int32BE Int32LE Int8 IntBE IntLE SFloat SFloatBE SFloatLE UInt UInt16 UInt16BE UInt16LE UInt32 UInt32BE UInt32LE UInt8 UIntBE UIntLE

in lower case is also equivalent :
	asstring bytes utf8
	bigint64 bigint64be bigint64le biguint64 biguint64be biguint64le bytes double doublebe doublele float float32 float32be float32le floatbe floatle int int16 int16be int16le int32 int32be int32le int8 intbe intle sfloat sfloatbe sfloatle uint uint16 uint16be uint16le uint32 uint32be uint32le uint8 uintbe uintle



## Testing


```
npm test
```
