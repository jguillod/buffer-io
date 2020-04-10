# @imed.ch/buffer-io
On github at [buffer-io](https://github.com/jguillod/buffer-io).

Buffer write and read utilities.

BufferIO adds the following features to legacy [NodeJS Class Buffer](https://nodejs.org/api/buffer.html)&nbsp;:

* A BufferIO reader or writer keeps track of the offset for you.
* You can specify then default endian-ness when instanciating the buffer (but can still use the other).
* 64 bit integer support. We dont use any non standard NodeJS 12.x dependencies.
* Function names are&nbsp;:
  * abbreviated to type name only (`read`and `write`prefix have been removed).
  * aliased with a lowercase name (e.g. `UInt8` => `uint8`, `Int32BE` => `int32be`, …).
* A writer buffer automatically expands when you write passed the end.

## Installation

    npm install @imed.ch/buffer-io


## Usage ##

```js
const {
    BufferIOReader,
    BufferIOWriter,
    types
} = require('@imed.ch/buffer-io');
```

# Documentation

Build documentation with&nbsp;:

    npm run docs

It will generate the documentation and open its html page. It's a shortcut of:

    npm run generate-docs
    npm run show-docs

Last command should open file `./docs/@imed.ch/buffer-io/<version>/index.html` (e.g. `./docs/@imed.ch/buffer-io/1.0.0/index.html`) in your browser.


## Common Features ##
The following is common to `BufferIOReader` and `BufferIOWriter` (The examples only show reader).

#### reader.offset | writer.offset
Gets the current offset of the buffer
```js
var buf = Buffer.from([0xFF, 0x02]); // [255, 2]
var reader = new BufferIOReader(buf);
console.log(reader.offset); // 0
reader.UInt8();  // => 255
reader.uint8();  // => 2
reader.uint8();
// => throws RangeError [ERR_OUT_OF_RANGE]: The value of "offset" is out of range. It must be >= 0 and <= 1. Received 2
reader.uint8(1);  // => 2
reader.offset = 0;
reader.UInt8();  // => 255

```

Sets the current offset of the buffer  
<small>In most case you will set `offset` in the `options` parameter of read/write functions. But it is possible to set it manually with&nbsp;:</small>
```js
reader.offset = 3;
writer.offset = 4;
```
For a reader `offset` should be in range of `[0..reader.length-1]`.

#### reader.eob() | writer.eob()
This function returns `true` if offset is set passed the end of buffer.

#### reader.skip(size) | writer.skip(size)
* {number} size

Skips the current offset forward the specified bytes amount

```js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new BufferIOReader(buf);
console.log(reader.offset); // 0
reader.skip(2);
console.log(reader.offset); // 2  
```

#### reader.skipTo(offset) | writer.skipTo(offset)

Alternate to `reader.offset = offset`.

* {number} offset

Skips to the specified offset

```js
var buf = Buffer.from([0xFF, 0xFF, 0xFF, 0x01]);
var reader = new BufferIOReader(buf);
console.log(reader.offset); // 0
reader.skipTo(3); // same as : reader.offset = 3;
console.log(reader.offset); // 3  
```

#### reader.Buffer() | writer.Buffer()
Will return the underlying buffer so you can perform actions directly on it

```js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new BufferIOReader(buf);
console.log(reader.Buffer()[1]); // 2
```

#### reader.trim() | writer.trim()
Will return a buffer slice from the start of the buffer to the current offset

```js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new BufferIOReader(buf);
reader.UInt8();
console.log(reader.trim()); // [0xFF]
console.log(buf);           // [0xFF, 0x02]
```

#### reader/writer.isRangeError(size, offset)

```js
if (!reader.isRangeError(size, offset)) data = reader.bytes({ length, offset });
```

#### Functions List ####

This is the list of all functions to read and write data&nbsp;:

`asstring`, ` AsString`, ` bigint64`, ` BigInt64`, ` bigint64be`, ` BigInt64BE`, ` bigint64le`, ` BigInt64LE`, ` biguint64`, ` BigUInt64`, ` biguint64be`, ` BigUInt64BE`, ` biguint64le`, ` BigUInt64LE`, ` bytes`, ` Bytes`, ` double`, ` Double`, ` doublebe`, ` DoubleBE`, ` doublele`, ` DoubleLE`, ` float`, ` Float`, ` float24_32`, ` Float24_32`, ` float24_32be`, ` Float24_32BE`, ` float24_32le`, ` Float24_32LE`, ` floatbe`, ` FloatBE`, ` floatle`, ` FloatLE`, ` int`, ` Int`, ` int16`, ` Int16`, ` int16be`, ` Int16BE`, ` int16le`, ` Int16LE`, ` int32`, ` Int32`, ` int32be`, ` Int32BE`, ` int32le`, ` Int32LE`, ` int64`, ` Int64`, ` int64be`, ` Int64BE`, ` int64le`, ` Int64LE`, ` int8`, ` Int8`, ` intbe`, ` IntBE`, ` intle`, ` IntLE`, ` sfloat12_16`, ` SFloat12_16`, ` sfloat12_16be`, ` SFloat12_16BE`, ` sfloat12_16le`, ` SFloat12_16LE`, ` uint`, ` UInt`, ` uint16`, ` UInt16`, ` uint16be`, ` UInt16BE`, ` uint16le`, ` UInt16LE`, ` uint32`, ` UInt32`, ` uint32be`, ` UInt32BE`, ` uint32le`, ` UInt32LE`, ` uint64`, ` UInt64`, ` uint64be`, ` UInt64BE`, ` uint64le`, ` UInt64LE`, ` uint8`, ` UInt8`, ` uintbe`, ` UIntBE`, ` uintle`, ` UIntLE`, ` utf8`, ` UTF8`

This list can be query with:

```js
const { types } = require('@imed.ch/buffer-io');
types(); // => list of functions

// These are equivalent :
reader.UInt8();
reader.uint8();
reader['UInt8']();
reader['uint8']();
let type = 'uint8';
reader[type]();
```

>CAVEAT : Documentation below may not be complete but you find description of most function in the `Buffer.read<type>` and `Buffer.write<type>` in [NodeJS documentation](https://nodejs.org/api/buffer.html#buffer_buf_readbigint64be_offset).



### Reader Usage

#### new BufferIOReader existingBuffer, [options]

Instanciate a new BufferIOReader with an internal buffer of the specified existingBuffer:

``` js
var reader = new BufferIOReader(yourBuffer, { offset: 0, bigEndian: false});
```

#### Example with `reader.UInt8([offset])`

``` js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new BufferIOReader(buf);
console.log(reader.UInt8()); // 255
console.log(reader.UInt8()); // 2
```


## Writer Usage

#### Requiring the writer in your project

```js
const { BufferIOWriter } = require('@imed.ch/buffer-io');
```

#### new BufferIOWriter existingBuffer, [options]

Allocates a new BufferIOWriter with an internal buffer of the specified existingBuffer
```js
var writer = new BufferIOWriter(existingBuffer, {offset: 0, bigEndian: false});
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

#### Example with `writer.writeUInt8(value, [offset])`

```js
var buf = Buffer.alloc(2);
var writer = new BufferIOWriter(buf);
writer.writeUInt8(255);
writer.writeUInt8(2);
console.log(buf); // [0xFF, 0x02]
```


## Error Handling

Note that this module does not run any assertion and you have to deal with errors&nbsp;:

```js
try {
    let str = reader.String({length: 5});
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

## API Signatures Summary

### Reader/Writer API ###

```js
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
```

where type is describes in the [Functions list](#Functions_List) §.

## Testing

```
npm test
```

## Support or just a greeting !

Enyjoy, fill an issue when appropriate! If you'd like you can support the freelancer I am via&nbsp;:

[![click me](https://ko-fi.com/img/Kofi_Logo_Blue.svg)](https://ko-fi.com/elojes)

## ABOUT ME ##

Please, feel free to visit our personal website [imed.ch](http://imed.ch) and have a look to IoT projects for HealthCare we are involved in with [eliiot technology](http://eliiot-technology.ch).
