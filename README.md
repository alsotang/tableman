# tableman

[![Build Status](https://travis-ci.org/alsotang/tableman.svg?branch=master)](https://travis-ci.org/alsotang/tableman)
[![Coverage Status](https://coveralls.io/repos/alsotang/tableman/badge.svg)](https://coveralls.io/r/alsotang/tableman)

This package is used to deal with table structure data which retrieved from mysql or other databases.

table must has structure like:

```js
var table = [
  {id: 1, num: 2},
  {id: 2, num: 10},
  {id: 3, num: 20},
];
```

## methods

### sum(table, options)

```js
options (Object) =
  field (String): which field you wanna sum
  [where] (Function): filter rows which you need
```

example:

```js
tableman.sum(table, {
  field: 'num',
  where: function (row) {return row.id > 1;}}
).should.eql(30);
```

### count(table, options)

example:

```js
tableman.count(table, {where: function (row) {return row.num > 5;}})
```

### join(table1, table2, options)

```js
options Object =
   on (Array|Function): ['field1', 'field2']
       or `function (a, b) {return a.sid === b.id}`
```

example:

```js
// hign speed
tableman.join(table, otherTable, {on: ['id', 'sid']})
// very slow speed, but flexible
tableman.join(table, otherTable, {on: function (a, b) {
  return a.id === b.sid;
}})
```

### leftJoin(table1, table2, options)

the same as `join`, but use left join strategy.

example:

```js
tableman.leftJoin(table, otherTable, {on: function (a, b) {
  return a.id === b.sid;
}})
```

### group(table, options)

```js
options Object =
  by (String|Array): group by this field
  action (Function): function (rows: Array, column: String|Array) {}.
      `rows` would be the rows which be grouped
```

example:

```js
tableman.group(otherTable, {
  by: 'address', // or ['adress', 'age']
  action: function (rows, column) {
    // column would be String or Array, decided by length of `by`
    return {count: rows.length};
  }})
```

### select(table, columns)

example:

```js
tableman.select(otherTable, ['sid', 'age'])
```

### order(table, columns)

example:

```js
// order by sid asc, age desc
tableman.order(otherTable, ['sid', '-age'])
```

## benchmark

```
Node.js version is: v1.6.3
length of `groupTable` is: 256
length of `table` is: 500
length of `otherTable` is: 500
#group x 2,665 ops/sec ±4.10% (82 runs sampled)
table join otherTable with array x 4,676 ops/sec ±4.57% (72 runs sampled)
table join otherTable with function x 307 ops/sec ±3.52% (76 runs sampled)
```
