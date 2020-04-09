// const should   = require('should');
const defaults = require(`${SRC}/defaults`);

describe('defaults', () => {

  it('does not override existing properties', () => {
    const obj = { a: 1 };
    const res = defaults(obj, { a: 2 });
    obj.should.eql({ a: 1 });
    res.should.eql({ a: 1 });
  });

  it('adds unset properties', () => {
    const obj = { a: 1 };
    const res = defaults(obj, { b: 2 });
    obj.should.eql({ a: 1 });
    res.should.eql({ a: 1, b: 2 });
  });

  it('does not override falsy values', () => {
    const obj = { a: false };
    const res = defaults(obj, { a: true });
    obj.should.eql({ a: false });
    res.should.eql({ a: false });
  });
});

