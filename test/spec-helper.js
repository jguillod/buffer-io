global.SRC = `${__dirname}/../src`;
// cartesianProduct takes an object of arrays and creates an array of objects
// with every combination of values from each array.
// example:
// cartesianProduct({ a: [1,2,3], b: [false, true] })
// -> [ { a: 1, b: false },
//      { a: 1, b: true  },
//      { a: 2, b: false },
//      { a: 2, b: true  },
//      { a: 3, b: false },
//      { a: 3, b: true  } ]
const cartesianProduct = (arg) => {
  let acc = [{}];
  Object.keys(arg).forEach((key) => {
    const xs = arg[key];
    const acc_ = [];
    acc.forEach((a) => {
      xs.forEach((x) => {
        const r = Object.assign({}, a);
        r[key] = x;
        acc_.push(r);
      });
    });
    acc = acc_;
  });
  return acc;
};

module.exports = { cartesianProduct };
