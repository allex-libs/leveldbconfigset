function createHook (execlib, leveldblib) {
  'use strict';

  var lib = execlib.lib,
    LDBHook = leveldblib.Hook;

  function Hook (leveldb, cb) {
    LDBHook.call(this, leveldb, cb);
  }

  lib.inherit(Hook, LDBHook);

  return Hook;
}

module.exports = createHook;
