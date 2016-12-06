function createLevelDBConfigSetMixin (execlib, LevelDBWithLog) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  function LevelDBConfigSetMixin (prophash) {
  };

  LevelDBConfigSetMixin.prototype.destroy = function () {
  };

  LevelDBConfigSetMixin.prototype._putDefault = function(promiseArry,dfltVal,field){
    promiseArry.push(this.put(field,dfltVal));
  };

  LevelDBConfigSetMixin.prototype.put = function(name,key,value){
    if (this.fields.indexOf(key) < 0){
      return q.reject(new lib.Error('NOT_A_CONFIG_FIELD',key));
    }
    return LevelDBWithLog.prototype.put.call(this,[name, key],value);
  };

  LevelDBConfigSetMixin.prototype.get = function(name,key){
    if (this.fields.indexOf(key) < 0){
      return q.reject(new lib.Error('NOT_A_CONFIG_FIELD',key));
    }
    return LevelDBWithLog.prototype.get.call(this,[name, key]);
  };

  LevelDBConfigSetMixin.prototype.safeGet = function(name, key, deflt){
    if (this.fields.indexOf(key) < 0){
      return q.reject(new lib.Error('NOT_A_CONFIG_FIELD',key));
    }
    return LevelDBWithLog.prototype.safeGet.call(this,[name, key],deflt);
  };

  LevelDBConfigSetMixin.prototype.getWDefault = function(name, key, deflt){
    if (this.fields.indexOf(key) < 0){
      return q.reject(new lib.Error('NOT_A_CONFIG_FIELD',key));
    }
    return LevelDBWithLog.prototype.getWDefault.call(this,[name, key],deflt);
  };

  LevelDBConfigSetMixin.prototype._configPutter = function (retobj, name, conffieldname) {
    var _q = q,
      ret = this.safeGet(name, conffieldname ,null).then(function (conffieldvalue) {
        var ret = _q(true);
        retobj[conffieldname] = conffieldvalue;
        _q = null;
        retobj = null;
        conffieldname = null;
        return ret;
      });
    return ret;
  };

  LevelDBConfigSetMixin.prototype.getConfig = function(name){
    var ret = {}, promises = this.fields.map(this._configPutter.bind(this, ret, name));
    return q.all(promises).then(
      qlib.returner(ret)
    );
  };

  LevelDBConfigSetMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, LevelDBConfigSetMixin,
      '_putDefault',
      'put',
      'get',
      'safeGet',
      'getWDefault',
      '_configPutter',
      'getConfig'
    );
  };

  return LevelDBConfigSetMixin;
}

module.exports = createLevelDBConfigSetMixin;
