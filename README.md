# tableman

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
options Object =
  field String: which field you wanna sum
  [where Function]: filter rows which you need
```

```
tableman.sum(table, {field: 'num', where: function (row) {return row.id > 1;}})
      .should.eql(30);
```

