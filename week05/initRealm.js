const objects = [
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "Array",
    "Date",
    "RegExp",
    "Promise",
    "Proxy",
    "Map",
    "WeakMap",
    "Set",
    "WeakSet",
    "Function",
    "Boolean",
    "String",
    "Number",
    "Symbol",
    "Object",
    "Error",
    "EvalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8ClampedArray",
    "Atomics",
    "JSON",
    "Math",
    "Reflect"
  ];
 
  const set = new Set();
 
  const globalObject = {
    id: "Global Object",
    children: [
 
    ]
  }
 
  for (let i of objects) {
    globalObject.children.push({
      children: [],
      id: i
    })
  }

  for (let i = 0; i < objects.length; i++) {
    const current = objects[i]
    if (set.has(objects[i]))
      continue;
    set.add(objects[i])
    for (let p of Object.getOwnPropertyNames(window[objects[i]])) {
      let d = Object.getOwnPropertyDescriptor(window[objects[i]], p)
      if (d.hasOwnProperty("value") && ((d.value !== null && typeof d.value === "object") || (typeof d.value === "function")) && d.value instanceof Object) {
        let childrenThird = []
        for (let k of Object.getOwnPropertyNames(d.value)) {
          if (k !== 'name' && k !== 'length') {
            childrenThird.push({ id: k })
          }
        }
        globalObject["children"][i].children.push({
          children: childrenThird,
          id: p
        })
      }
      if (d.hasOwnProperty("get") && typeof d.get === "function") {
        let childrenThird = []
        for (let k of Object.getOwnPropertyNames(d.get)) {
          if (k !== 'name' && k !== 'length') {
            childrenThird.push({ id: k })
          }
        }
        globalObject["children"][i].children.push({
          children: childrenThird,
          id: p
        })
      }
      if (d.hasOwnProperty("set") && typeof d.set === "function") {
        let childrenThird = []
        for (let k of Object.getOwnPropertyNames(d.set)) {
          if (k !== 'name' && k !== 'length') {
            childrenThird.push({ id: k })
          }
        }
        globalObject["children"][i].children.push({
          children: childrenThird,
          id: p
        })
      }
    }
  }