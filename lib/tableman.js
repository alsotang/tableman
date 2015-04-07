
var _ = require('lodash');
var helper = require('./helper');
var tableman = {};

var SEPARATOR = '^_^@T_T';

exports = module.exports = tableman;

tableman.sum = function (table, options) {
  var total = 0;
  var field = options.field;
  var where = options.where;
  if (where) {
    table = _.filter(table, where);
  }
  _.forEach(table, function (row) {
    total += Number(row[field]);
  });

  return total;
};

tableman.count = function (table, options) {
  options = options || {};
  var where = options.where;
  if (where) {
    table = _.filter(table, where);
  }
  return table.length;
};

var makeJoin = function (makeOptions) {
  makeOptions = makeOptions || {};
  function arrayToFn(array) {
    var f1 = array[0];
    var f2 = array[1];
    return function (a, b) {
      return String(a[f1]) === String(b[f2]);
    };
  }
  return function (t1, t2, options) {
    options = options || {};
    var condition = options.on;
    if (!condition) {
      throw new Error('must provide `on` option when `join`');
    }

    var newTable = [];
    if (_.isArray(condition)) {
      var t2Map = {};
      var t1Column = condition[0];
      var t2Column = condition[1];

      for (var i = 0; i < t2.length; i++) {
        var t2Row = t2[i];
        var t2Value = t2Row[t2Column];
        t2Map[t2Value] = t2Map[t2Value] || [];
        t2Map[t2Value].push(t2Row);
      }

      for (var i = 0; i < t1.length; i++) {
        var t1Row = t1[i];
        var t1Value = t1Row[t1Column];
        var t2Rows = t2Map[t1Value];
        if (t2Rows) {
          for (var j = 0; j < t2Rows.length; j++) {
            var t2Row = t2Rows[j];
            var newRow = {};
            helper.assign(newRow, t1Row);
            helper.assign(newRow, t2Row);
            newTable.push(newRow);
          }
        }
      }
    } else if (typeof condition === 'function') {
      for (var i = 0; i < t1.length; i++) {
        var row1 = t1[i];
        var found = false;
        for (var j = 0; j < t2.length; j++) {
          var row2 = t2[j];
          if (condition(row1, row2)) {
            found = true;
            var newRow = {};
            helper.assign(newRow, row1);
            helper.assign(newRow, row2);
            newTable.push(newRow);
          }
        }
        if (makeOptions.isLeft && !found) {
          newTable.push(row1);
        }
      }
    } else {
      throw new Error('`condition` should be a Array of Function');
    }
    return newTable;
  };
};

tableman.join = makeJoin();

tableman.leftJoin = makeJoin({isLeft: true});

tableman.group = (function () {
  function makeByFn(by) {
    return function (row) {
      var key = _.map(by, function (_by) {
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

    for (var i = 0; i < table.length; i++) {
      var row = table[i];
      var key = byFn(row);
      map[key] = map[key] || [];
      map[key].push(row);
    }

    var newTable = [];
    var isColumnArray = by.length === 1 ? false : true;
    for(var key in map) {
      var byValues = JSON.parse(key);
      var newRow = _.zipObject(by, byValues);

      var column = isColumnArray ? byValues : byValues[0];

      newRow = _.assign(newRow, action(map[key], column));
      newTable.push(newRow);
    }

    return newTable;
  };
})();

tableman.select = function (table, columns) {
  if (!_.isArray(columns)) {
    columns = [columns];
  }

  return _.map(table, function (row) {
    return _.pick(row, columns);
  });
};
