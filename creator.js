function createLib (execlib, LevelDBWithLog, leveldblib) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    Hook = require('./hookcreator')(execlib, leveldblib),
    LevelDBConfigSetMixin = require('./mixincreator')(execlib, LevelDBWithLog, Hook);

  function LevelDBConfigSet (prophash) {
    LevelDBWithLog.call(this, prophash);
    LevelDBConfigSetMixin.call(this, prophash);
    this.fields = prophash.fields.slice();
  }
  lib.inherit(LevelDBConfigSet, LevelDBWithLog);
  LevelDBConfigSetMixin.addMethods(LevelDBConfigSet);
  LevelDBConfigSet.prototype.destroy = function () {
    this.fields = null;
    LevelDBConfigSetMixin.prototype.destroy.call(this);
    LevelDBWithLog.prototype.destroy.call(this);
  };

  return q({
    Hook: Hook,
    LevelDBConfigSetMixin: LevelDBConfigSetMixin,
    LevelDBConfigSet: LevelDBConfigSet
  });
}

module.exports = createLib;
