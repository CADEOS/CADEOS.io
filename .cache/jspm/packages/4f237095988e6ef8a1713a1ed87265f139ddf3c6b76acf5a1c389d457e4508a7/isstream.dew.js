import _stream from "stream";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  var stream = _stream;

  function isStream(obj) {
    return obj instanceof stream.Stream;
  }

  function isReadable(obj) {
    return isStream(obj) && typeof obj._read == 'function' && typeof obj._readableState == 'object';
  }

  function isWritable(obj) {
    return isStream(obj) && typeof obj._write == 'function' && typeof obj._writableState == 'object';
  }

  function isDuplex(obj) {
    return isReadable(obj) && isWritable(obj);
  }

  exports = isStream;
  exports.isReadable = isReadable;
  exports.isWritable = isWritable;
  exports.isDuplex = isDuplex;
  return exports;
}