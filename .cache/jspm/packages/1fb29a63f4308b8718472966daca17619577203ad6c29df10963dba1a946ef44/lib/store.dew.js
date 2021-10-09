var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  /*jshint unused:false */
  function Store() {}

  exports.Store = Store; // Stores may be synchronous, but are still required to use a
  // Continuation-Passing Style API.  The CookieJar itself will expose a "*Sync"
  // API that converts from synchronous-callbacks to imperative style.

  Store.prototype.synchronous = false;

  Store.prototype.findCookie = function (domain, path, key, cb) {
    throw new Error('findCookie is not implemented');
  };

  Store.prototype.findCookies = function (domain, path, cb) {
    throw new Error('findCookies is not implemented');
  };

  Store.prototype.putCookie = function (cookie, cb) {
    throw new Error('putCookie is not implemented');
  };

  Store.prototype.updateCookie = function (oldCookie, newCookie, cb) {
    // recommended default implementation:
    // return this.putCookie(newCookie, cb);
    throw new Error('updateCookie is not implemented');
  };

  Store.prototype.removeCookie = function (domain, path, key, cb) {
    throw new Error('removeCookie is not implemented');
  };

  Store.prototype.removeCookies = function (domain, path, cb) {
    throw new Error('removeCookies is not implemented');
  };

  Store.prototype.getAllCookies = function (cb) {
    throw new Error('getAllCookies is not implemented (therefore jar cannot be serialized)');
  };

  return exports;
}