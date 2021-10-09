import _assert from "assert";
import { dew as _indexDewDew } from "safer-buffer/index.dew.js";
import { dew as _typesDewDew } from "./types.dew.js";
import { dew as _errorsDewDew } from "./errors.dew.js";
var exports = {},
    _dewExec = false;

var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : global;

export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  // Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.
  var assert = _assert;

  var Buffer = _indexDewDew().Buffer;

  var ASN1 = _typesDewDew();

  var errors = _errorsDewDew(); // --- Globals


  var newInvalidAsn1Error = errors.newInvalidAsn1Error; // --- API

  function Reader(data) {
    if (!data || !Buffer.isBuffer(data)) throw new TypeError('data must be a node Buffer');
    (this || _global)._buf = data;
    (this || _global)._size = data.length; // These hold the "current" state

    (this || _global)._len = 0;
    (this || _global)._offset = 0;
  }

  Object.defineProperty(Reader.prototype, 'length', {
    enumerable: true,
    get: function () {
      return (this || _global)._len;
    }
  });
  Object.defineProperty(Reader.prototype, 'offset', {
    enumerable: true,
    get: function () {
      return (this || _global)._offset;
    }
  });
  Object.defineProperty(Reader.prototype, 'remain', {
    get: function () {
      return (this || _global)._size - (this || _global)._offset;
    }
  });
  Object.defineProperty(Reader.prototype, 'buffer', {
    get: function () {
      return (this || _global)._buf.slice((this || _global)._offset);
    }
  });
  /**
   * Reads a single byte and advances offset; you can pass in `true` to make this
   * a "peek" operation (i.e., get the byte, but don't advance the offset).
   *
   * @param {Boolean} peek true means don't move offset.
   * @return {Number} the next byte, null if not enough data.
   */

  Reader.prototype.readByte = function (peek) {
    if ((this || _global)._size - (this || _global)._offset < 1) return null;
    var b = (this || _global)._buf[(this || _global)._offset] & 0xff;
    if (!peek) (this || _global)._offset += 1;
    return b;
  };

  Reader.prototype.peek = function () {
    return this.readByte(true);
  };
  /**
   * Reads a (potentially) variable length off the BER buffer.  This call is
   * not really meant to be called directly, as callers have to manipulate
   * the internal buffer afterwards.
   *
   * As a result of this call, you can call `Reader.length`, until the
   * next thing called that does a readLength.
   *
   * @return {Number} the amount of offset to advance the buffer.
   * @throws {InvalidAsn1Error} on bad ASN.1
   */


  Reader.prototype.readLength = function (offset) {
    if (offset === undefined) offset = (this || _global)._offset;
    if (offset >= (this || _global)._size) return null;
    var lenB = (this || _global)._buf[offset++] & 0xff;
    if (lenB === null) return null;

    if ((lenB & 0x80) === 0x80) {
      lenB &= 0x7f;
      if (lenB === 0) throw newInvalidAsn1Error('Indefinite length not supported');
      if (lenB > 4) throw newInvalidAsn1Error('encoding too long');
      if ((this || _global)._size - offset < lenB) return null;
      (this || _global)._len = 0;

      for (var i = 0; i < lenB; i++) (this || _global)._len = ((this || _global)._len << 8) + ((this || _global)._buf[offset++] & 0xff);
    } else {
      // Wasn't a variable length
      (this || _global)._len = lenB;
    }

    return offset;
  };
  /**
   * Parses the next sequence in this BER buffer.
   *
   * To get the length of the sequence, call `Reader.length`.
   *
   * @return {Number} the sequence's tag.
   */


  Reader.prototype.readSequence = function (tag) {
    var seq = this.peek();
    if (seq === null) return null;
    if (tag !== undefined && tag !== seq) throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) + ': got 0x' + seq.toString(16));
    var o = this.readLength((this || _global)._offset + 1); // stored in `length`

    if (o === null) return null;
    (this || _global)._offset = o;
    return seq;
  };

  Reader.prototype.readInt = function () {
    return this._readTag(ASN1.Integer);
  };

  Reader.prototype.readBoolean = function () {
    return this._readTag(ASN1.Boolean) === 0 ? false : true;
  };

  Reader.prototype.readEnumeration = function () {
    return this._readTag(ASN1.Enumeration);
  };

  Reader.prototype.readString = function (tag, retbuf) {
    if (!tag) tag = ASN1.OctetString;
    var b = this.peek();
    if (b === null) return null;
    if (b !== tag) throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) + ': got 0x' + b.toString(16));
    var o = this.readLength((this || _global)._offset + 1); // stored in `length`

    if (o === null) return null;
    if ((this || _global).length > (this || _global)._size - o) return null;
    (this || _global)._offset = o;
    if ((this || _global).length === 0) return retbuf ? Buffer.alloc(0) : '';

    var str = (this || _global)._buf.slice((this || _global)._offset, (this || _global)._offset + (this || _global).length);

    (this || _global)._offset += (this || _global).length;
    return retbuf ? str : str.toString('utf8');
  };

  Reader.prototype.readOID = function (tag) {
    if (!tag) tag = ASN1.OID;
    var b = this.readString(tag, true);
    if (b === null) return null;
    var values = [];
    var value = 0;

    for (var i = 0; i < b.length; i++) {
      var byte = b[i] & 0xff;
      value <<= 7;
      value += byte & 0x7f;

      if ((byte & 0x80) === 0) {
        values.push(value);
        value = 0;
      }
    }

    value = values.shift();
    values.unshift(value % 40);
    values.unshift(value / 40 >> 0);
    return values.join('.');
  };

  Reader.prototype._readTag = function (tag) {
    assert.ok(tag !== undefined);
    var b = this.peek();
    if (b === null) return null;
    if (b !== tag) throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) + ': got 0x' + b.toString(16));
    var o = this.readLength((this || _global)._offset + 1); // stored in `length`

    if (o === null) return null;
    if ((this || _global).length > 4) throw newInvalidAsn1Error('Integer too long: ' + (this || _global).length);
    if ((this || _global).length > (this || _global)._size - o) return null;
    (this || _global)._offset = o;
    var fb = (this || _global)._buf[(this || _global)._offset];
    var value = 0;

    for (var i = 0; i < (this || _global).length; i++) {
      value <<= 8;
      value |= (this || _global)._buf[(this || _global)._offset++] & 0xff;
    }

    if ((fb & 0x80) === 0x80 && i !== 4) value -= 1 << i * 8;
    return value >> 0;
  }; // --- Exported API


  exports = Reader;
  return exports;
}