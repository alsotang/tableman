var Benchmark = require('benchmark');
var tableman = require('./');

var suite = new Benchmark.Suite();

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

for (var i = 0; i < 6; i++) {
  otherTable = otherTable.concat(otherTable);
}
console.log('length of `otherTable` is:', otherTable.length);

suite
.add('#group', function() {
  tableman.group(otherTable, {
    by: ['age', 'address'],
    action: function (rows) {
      return {count: rows.length};
    }
  });
})
.add('#join with function', function() {
  tableman.join(otherTable, otherOtherTable, {on: function (a, b) {
    return a.sid === b.sid;
  }});
})
.add('#join with array', function() {
  tableman.join(otherTable, otherOtherTable, {on: ['sid', 'sid']});
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  // console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ 'async': true });
