# tableman

[![Build Status](https://travis-ci.org/alsotang/tableman.svg?branch=master)](https://travis-ci.org/alsotang/tableman)
[![Coverage Status](https://coveralls.io/repos/alsotang/tableman/badge.svg)](https://coveralls.io/r/alsotang/tableman)

This package is used to deal with table structure data which retrieved from mysql or other databases.

table must has structure like:

```
var table = [
  {id: 1, num: 2},
  {id: 2, num: 10},
  {id: 3, num: 20},
];
```

## methods

### sum(table, options)

```
options (Object) =
  field (String): which field you wanna sum
  [where] (Function): filter rows which you need
```

example:

```
tableman.sum(table, {
  field: 'num',
  where: function (row) {return row.id > 1;}}
).should.eql(30);
```

### join(table1, table2, options)

```
options Object =
   on (Array|Function): ['field1', 'field2']
       or `function (a, b) {return a.sid === b.id}`
```

example:

```
tableman.join(table, otherTable, {on: ['id', 'sid']})
tableman.join(table, otherTable, {on: function (a, b) {
  return a.id === b.sid;
}})
```

### leftJoin(table1, table2, options)

the same as `join`, but use left join strategy.

example:

```
tableman.leftJoin(table, otherTable, {on: function (a, b) {
  return a.id === b.sid;
}})
```

### group(table, options)

```
options Object =
  by (String|Array): group by this field
  action (Function): function (rows: Array, column: String|Array) {}.
      `rows` would be the rows which be grouped
```

example:

```
tableman.group(otherTable, {
  by: 'address', // or ['adress', 'age']
  action: function (rows, column) {
    // column would be String or Array, decided by `by`
    return {count: rows.length};
  }})
```
