var tableman = require('../');

describe('/test/tableman.test.js', function () {
  var table = [
    {id: 1, num: 2},
    {id: 2, num: 10},
    {id: 3, num: 20},
  ];

  var otherTable = [
    {sid: 2, address: 'aaa', age: 20},
    {sid: 3, address: 'bbb', age: 21},
    {sid: 4, address: 'ccc', age: 20},
    {sid: 5, address: 'aaa', age: 19},
  ];

  var otherOtherTable = [
    {sid: 2, info: 'aaa111'},
    {sid: 3, info: 'bbb222'},
    {sid: 4, info: 'ccc333'},
    {sid: 5, info: 'aaa444'},
  ];

  it('should sum', function () {
    tableman.sum(table, {field: 'num'})
      .should.eql(32);
  });

  it('should sum with where', function () {
    tableman.sum(table, {
      field: 'num',
      where: function (row) {return row.id > 1;}}
    ).should.eql(30);
  });

  it('should count', function () {
    tableman.count(table)
      .should.eql(3);
  });

  it('should count with where', function () {
    tableman.count(table, {where: function (row) {return row.num > 5;}})
      .should.eql(2);
  });

  it('should join', function () {
    tableman.join(table, otherTable, {on: ['id', 'sid']})
      .should.eql([
          {id: 2, num: 10, sid: 2, address: 'aaa', age: 20},
          {id: 3, num: 20, sid: 3, address: 'bbb', age: 21}
        ]);
  });

  it('should join with identity function', function () {
    tableman.join(table, otherTable, {on: function (a, b) {
      return a.id === b.sid;
    }})
    .should.eql([
        {id: 2, num: 10, sid: 2, address: 'aaa', age: 20},
        {id: 3, num: 20, sid: 3, address: 'bbb', age: 21}
      ]);
  });

  it('should left join', function () {
    tableman.leftJoin(table, otherTable, {on: function (a, b) {
      return a.id === b.sid;
    }})
    .should.eql([
        { id: 1, num: 2 },
        {id: 2, num: 10, sid: 2, address: 'aaa', age: 20},
        {id: 3, num: 20, sid: 3, address: 'bbb', age: 21}
      ]);
  });

  it('should group', function () {
    tableman.group(otherTable, {by: 'address', action: function (rows, column) {
      column.should.String; // `aaa` or `bbb` or `ccc`
      return {count: rows.length};
    }})
    .should.eql([
        {address: 'aaa', count: 2},
        {address: 'bbb', count: 1},
        {address: 'ccc', count: 1},
      ]);
  });

  it('should group by age', function () {
    tableman.group(otherTable, {by: 'age', action: function (rows, column) {
      column.should.Number; // 19 or 20 or 21
      return {count: rows.length};
    }})
    .should.eql([
        {age: 20, count: 2},
        {age: 21, count: 1},
        {age: 19, count: 1},
      ]);
  });


  it('should group multi columns', function () {
    tableman.group(otherTable, {
      by: ['age', 'address'],
      action: function (rows, columns) {
        columns.should.Array;
        return {count: rows.length};
      }
    })
    .should.eql([
        {age: 20, address: 'aaa', count: 1},
        {age: 21, address: 'bbb', count: 1},
        {age: 20, address: 'ccc', count: 1},
        {age: 19, address: 'aaa', count: 1},
      ]);
  });

  it('should select specified column', function () {
    tableman.select(otherTable, 'age')
      .should.eql([ { age: 20 }, { age: 21 }, { age: 20 }, { age: 19 } ]);
  });

  it('should select specified columns', function () {
    tableman.select(otherTable, ['sid', 'age'])
      .should.eql([
        { age: 20, sid: 2 },
        { age: 21, sid: 3 },
        { age: 20, sid: 4 },
        { age: 19, sid: 5 }
      ]);
  });
});
