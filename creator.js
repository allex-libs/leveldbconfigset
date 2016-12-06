function createLib (execlib, LevelDBWithLog) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    LevelDBConfigSetMixin = require('./mixincreator')(execlib, LevelDBWithLog);

  function LevelDBConfigSet (prophash) {
    LevelDBWithLog.call(this, prophash);
    LevelDBConfigSetMixin.call(this, prophash);
  }
  lib.inherit(LevelDBConfigSet, LevelDBWithLog);
  LevelDBConfigSetMixin.addMethods(LevelDBConfigSet);
  LevelDBConfigSet.prototype.destroy = function () {
    LevelDBConfigSetMixin.prototype.destroy.call(this);
    LevelDBWithLog.prototype.destroy.call(this);
  };

  return q({
    LevelDBConfigSetMixin: LevelDBConfigSetMixin,
    LevelDBConfigSet: LevelDBConfigSet
  });
}

module.exports = createLib;
