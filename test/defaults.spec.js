const expect   = require('chai').expect;
const defaults = require(`${SRC}/defaults`);

describe('defaults', () => {

  it('does not override existing properties', () => {
    const obj = { a: 1 };
    const res = defaults(obj, { a: 2 });
    expect(obj).to.eql({ a: 1 });
    expect(res).to.eql({ a: 1 });
  });

  it('adds unset properties', () => {
    const obj = { a: 1 };
    const res = defaults(obj, { b: 2 });
    expect(obj).to.eql({ a: 1 });
    expect(res).to.eql({ a: 1, b: 2 });
  });

  it('does not override falsy values', () => {
    const obj = { a: false };
    const res = defaults(obj, { a: true });
    expect(obj).to.eql({ a: false });
    expect(res).to.eql({ a: false });
  });
});

