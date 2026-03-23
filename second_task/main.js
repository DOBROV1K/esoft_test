function deepCopy(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return obj;
  }

  if (seen.has(obj)) {
    return seen.get(obj);
  }

  if (typeof obj === "function") {
    const clonedFn = function (...args) { return obj.apply(this, args); };
    seen.set(obj, clonedFn);
    copyOwnProperties(obj, clonedFn, seen);
    return clonedFn;
  }

  if (obj instanceof Date) {
    const cloned = new Date(obj.getTime());
    seen.set(obj, cloned);
    return cloned;
  }

  if (obj instanceof RegExp) {
    const cloned = new RegExp(obj.source, obj.flags);
    cloned.lastIndex = obj.lastIndex;
    seen.set(obj, cloned);
    return cloned;
  }

  if (obj instanceof Map) {
    const cloned = new Map();
    seen.set(obj, cloned);
    for (const [key, value] of obj) {
      cloned.set(deepCopy(key, seen), deepCopy(value, seen));
    }
    return cloned;
  }

  if (obj instanceof Set) {
    const cloned = new Set();
    seen.set(obj, cloned);
    for (const value of obj) {
      cloned.add(deepCopy(value, seen));
    }
    return cloned;
  }

  if (obj instanceof ArrayBuffer) {
    const cloned = obj.slice(0);
    seen.set(obj, cloned);
    return cloned;
  }

  if (ArrayBuffer.isView(obj)) {
    const cloned = new obj.constructor(obj.buffer.slice(0));
    seen.set(obj, cloned);
    return cloned;
  }

  const proto = Object.getPrototypeOf(obj);
  const cloned = Array.isArray(obj)
    ? []
    : Object.create(proto);

  seen.set(obj, cloned);
  copyOwnProperties(obj, cloned, seen);
  return cloned;
}


function copyOwnProperties(source, target, seen) {
  const allKeys = [
    ...Object.getOwnPropertyNames(source),
    ...Object.getOwnPropertySymbols(source),
  ];

  for (const key of allKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(source, key);

    if (descriptor.get || descriptor.set) {
      Object.defineProperty(target, key, descriptor);
    } else {
      Object.defineProperty(target, key, {
        ...descriptor,
        value: deepCopy(descriptor.value, seen),
      });
    }
  }
}

// Тест
const original = { a: 1, b: { c: 2 }, arr: [1, 2, 3] };
original.self = original; 

const clone = deepCopy(original);
console.log(clone.b.c); // 2
console.log(clone.arr); // [1, 2, 3]
console.log(clone.self === clone); // true
console.log(clone === original); // false