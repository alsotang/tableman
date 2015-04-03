
var _ = require('lodash');
var tableman = {};

exports = module.exports = tableman;

tableman.sum = function (table, options) {
  var total = 0;
  var field = options.field;
  var where = options.where;
  if (where) {
    table = table.filter(where);
  }
  table.forEach(function (row) {
    total += Number(row[field]);
  });

  return total;
};


tableman.count = function (table, options) {
  options = options || {};
  var where = options.where;
  if (where) {
    table = table.filter(where);
  }
  return table.length;
};

var makeJoin = (function (makeOptions) {
  makeOptions = makeOptions || {};
  function arrayToFn(array) {
    var f1 = array[0];
    var f2 = array[1];
    return function (a, b) {
      return String(a[f1]) === String(b[f2]);
    };
  }
  return function (t1, t2, options) {
    t1 = _.cloneDeep(t1);
    t2 = _.cloneDeep(t2);

    options = options || {};
    var condition = options.on;
    if (!condition) {
      throw new Error('must provide `on` option when `join`');
    }
    if (Array.isArray(condition)) {
      condition = arrayToFn(condition);
    }

    var newTable = [];
    t1.forEach(function (row1) {
      var found = false;
      t2.forEach(function (row2) {
        if (condition(row1, row2)) {
          found = true;
          var newRow = _.assign({}, row1, row2);
          newTable.push(newRow);
        }
      });
      if (!found && makeOptions.isLeft) {
        newTable.push(row1);
      }
    });

    return newTable;
  };
});

tableman.join = makeJoin();

tableman.leftJoin = makeJoin({isLeft: true});

var SEPARATOR = '^_^@T_T';
tableman.group = (function () {
  function makeByFn(by) {
    return function (row) {
      var key = by.map(function (_by) {
        return row[_by];
      });
      return JSON.stringify(key);
    };
  }

  return function (table, options) {
    var by = options.by;
    var action = options.action;
    if (!Array.isArray(by)) {
      by = [by];
    }
    var byFn = makeByFn(by);

    var map = {};

    table.forEach(function (row) {
      var key = byFn(row);
      map[key] = map[key] || [];
      map[key].push(row);
    });

    var newTable = [];
    for(var key in map) {
      var byValues = JSON.parse(key);
      var newRow = _.zipObject(by, byValues);

      var column = (function () {
        if (byValues.length === 1) {
          return byValues[0];
        } else {
          return byValues;
        }
      })();
      newRow = _.assign(newRow, action(map[key], column));
      newTable.push(newRow);
    }

    return newTable;
  };
})();
