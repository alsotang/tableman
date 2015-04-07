var Benchmark = require('benchmark');
var tableman = require('./');

var suite = new Benchmark.Suite();

var groupTable = [
  {sid: 2, address: 'aaa', age: 20},
  {sid: 3, address: 'bbb', age: 21},
  {sid: 4, address: 'ccc', age: 20},
  {sid: 5, address: 'aaa', age: 19},
];
for (var i = 0; i < 6; i++) {
  groupTable = groupTable.concat(groupTable);
}

var table = (function () {
  var arr = [];
  for (var i = 0; i < 500; i ++) {
    arr.push({sid: i});
  }
  return arr;
})();

var otherTable = (function () {
  var arr = [];
  for (var i = 0; i < 200; i ++) {
    arr.push({sid: i});
  }
  return arr;
})();


console.log('length of `groupTable` is:', groupTable.length);
console.log('length of `table` is:', table.length);
console.log('length of `otherTable` is:', otherTable.length);

suite
.add('#group', function() {
  tableman.group(groupTable, {
    by: ['age', 'address'],
    action: function (rows) {
      return {count: rows.length};
    }
  });
})
.add('table join otherTable with function', function() {
  tableman.join(table, otherTable, {on: function (a, b) {
    return a.sid === b.sid;
  }});
})
.add('table join otherTable with array', function() {
  tableman.join(table, otherTable, {on: ['sid', 'sid']});
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  // console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ 'async': true });
