/**
 *
 * @param {object} obj the object to set default
 * @param {object} defaultValues default values
 * @returns {object} a new object with
 * @example ````js
 *   // copy-paste in a nodejs terminal
 *   function example_1(defaultValues) {
 *      let obj = {
 *          offset: 0,
 *          bigEndian: false
 *      };
 *      console.log('[1] Exemple with keeping only a subset of elected properties :')
 *      console.log('[1] obj BEFORE setting default values =', obj);
 *      console.log('[1] defaultValues =', defaultValues);
 *      // filter out to keep only allowed properties
 *      ({offset: obj.offset, bigEndian: obj.bigEndian} = defaults(obj, defaultValues
 *      ));
 *      console.log('[1] obj AFTER setting default values =', obj);
 *   }
 *
 *   function example_2(defaultValues) {
 *      let obj = {
 *          offset: 0,
 *          bigEndian: false
 *      };
 *      console.log('[2] Exemple with keeping all properties of defaultValues :')
 *      console.log('[2] obj BEFORE setting default values =', obj);
 *      console.log('[2] defaultValues =', defaultValues);
 *      // keep all properties
 *      ({...obj} = defaults(obj, defaultValues
 *      ));
 *      console.log('[2] obj AFTER setting default values =', obj);
 *   }
 *   var def;
 *   def={un:1, bigEndian: true}; example_1(def); console.log('---');example_2(def);
 *   def={offset:999, un:1, bigEndian: true}; example_1(def); console.log('---');example_2(def);
 *   * ``
 */



const defaults = (obj, defaultValues) => {
    return Object.assign({}, defaultValues, obj);

    // const newObj = obj;
    // Object.keys(props).forEach((p) => {
    //   if (newObj[p] == null) { newObj[p] = props[p]; }
    // });
    // return newObj;
};

module.exports = defaults;


/*
function example_1(defaultValues) {
    let obj = {
        // offset: 0,
        bigEndian: false
    };
    console.log('[1] Exemple with keeping only a subset of elected properties :')
    console.log('[1] obj BEFORE setting default values =', obj);
    console.log('[1] defaultValues =', defaultValues);
    // filter out to keep only allowed properties
    ({offset: obj.offset, bigEndian: obj.bigEndian} = defaults(obj, defaultValues
    ));
    console.log('[1] obj AFTER setting default values =', obj);
}

function example_2(defaultValues) {
    let obj = {
        offset: 0,
        bigEndian: false
    };
    console.log('[2] Exemple with keeping all properties of defaultValues :')
    console.log('[2] obj BEFORE setting default values =', obj);
    console.log('[2] defaultValues =', defaultValues);
    // keep all properties
    ({...obj} = defaults(obj, defaultValues
    ));
    console.log('[2] obj AFTER setting default values =', obj);
}
var def;
def={un:1, bigEndian: true}; example_1(def); console.log('---');example_2(def);
def={offset:999, un:1}; example_1(def); console.log('---');example_2(def);

*/
