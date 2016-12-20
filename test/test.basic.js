loadMochaIntegration('allex_leveldblib');
describe('Basic tests', function () {
  it('Load lib', function () {
    return setGlobal('Lib', require('..')(execlib));
  });
  it('Register Lib.Hook ctor', function () {
    return setGlobal('LibHookCtor', Lib.Hook);
  });
  it('Create test db', function () {
    var d = q.defer();
    new (Lib.LevelDBConfigSet)({
      path: 'test.db',
      fields: ['width', 'height', 'weight'],
      starteddefer: d
    });
    return setGlobal('DB', d.promise);
  });
  it('Register KVStorage', function () {
    return setGlobal('KVStorage', DB.kvstorage);
  });
  it('Write width for a', function () {
    return DB.put('a', 'width', 10);
  });
  it ('Read width for a', function () {
    return expect(DB.get('a', 'width')).to.eventually.equal(10);
  });
  createLevelDBHookIt({
    ctor: 'LibHookCtor',
    leveldb: 'KVStorage',
    instancename: 'HookWidthAll',
    hookTo: {keys: [['***', 'width']], scan: true}
  });
  createLevelDBHookIt({
    ctor: 'LibHookCtor',
    leveldb: 'KVStorage',
    instancename: 'HookWidtha',
    hookTo: {keys: [['a', 'width']], scan: true}
  });
  createWriteAndGetInHookIt({
    dbname: 'DB',
    hookname: ['HookWidthAll', 'HookWidtha'],
    putparams: ['a', 'width', 10],
    expect: 10
  });
  createWriteAndGetInHookIt({
    dbname: 'DB',
    hookname: 'HookWidtha',
    putparams: ['a', 'width', 10],
    expect: 10
  });
  createWriteAndNotGetInHookIt({
    dbname: 'DB',
    hookname: ['HookWidthAll', 'HookWidtha'],
    putparams: ['a', 'height', 10],
    expect: 10
  });
  createWriteAndGetInHookIt({
    dbname: 'DB',
    hookname: 'HookWidthAll',
    putparams: ['b', 'width', 10],
    expect: 10
  });
  createWriteAndNotGetInHookIt({
    dbname: 'DB',
    hookname: 'HookWidtha',
    putparams: ['b', 'width', 10],
    expect: 10
  });
  it ('Write height for a', function () {
    return DB.put('a', 'height', 10);
  });
  it ('Write width for a', function () {
    return DB.put('a', 'width', 15);
  });
  it ('Write width for b', function () {
    return DB.put('b', 'width', 19);
  });
});
