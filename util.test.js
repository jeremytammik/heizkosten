const util = require('./util');

test('date difference', () => {
  var begin = new Date(2019, 1, 1);
  var end = new Date(2019, 8, 30);
  var d = util.date_units_diff( begin, end );
  expect(d).toBe(100);
});
