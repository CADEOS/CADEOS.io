var exports = {},
    _dewExec = false;

var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : global;

export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  exports = exports = stringify;
  exports.getSerialize = serializer;

  function stringify(obj, replacer, spaces, cycleReplacer) {
    return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);
  }

  function serializer(replacer, cycleReplacer) {
    var stack = [],
        keys = [];
    if (cycleReplacer == null) cycleReplacer = function (key, value) {
      if (stack[0] === value) return "[Circular ~]";
      return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
    };
    return function (key, value) {
      if (stack.length > 0) {
        var thisPos = stack.indexOf(this || _global);
        ~thisPos ? stack.splice(thisPos + 1) : stack.push(this || _global);
        ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
        if (~stack.indexOf(value)) value = cycleReplacer.call(this || _global, key, value);
      } else stack.push(value);

      return replacer == null ? value : replacer.call(this || _global, key, value);
    };
  }

  return exports;
}