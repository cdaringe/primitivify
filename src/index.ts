import cloneDeepWith from "lodash/cloneDeepWith";

const isPrimitive = (value: any) =>
  (typeof value !== "object" && typeof value !== "function") || value === null;

export function primitivify<T = {}>(obj: any, onVisit?: (v: any) => any): T {
  return cloneDeepWith(obj, (_value) => {
    const value = onVisit ? onVisit(_value) : _value;
    if (isPrimitive(value)) return value;
    if (Array.isArray(value)) return value.map((v) => primitivify(v, onVisit));
    if (isPlainObject(value)) {
      const next: any = {};
      for (const key in value) {
        const subValue = value[key];
        next[key] = primitivify(subValue, onVisit);
      }
      return next;
    }
    return null;
  });
}

const isObject = (o: unknown): o is Record<string, unknown> => {
  return Object.prototype.toString.call(o) === "[object Object]";
};

function isPlainObject(o: unknown): o is Record<string, unknown> {
  var ctor, prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty("isPrototypeOf") === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}
