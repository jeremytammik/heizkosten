const util = require('./util');

test('date difference', () => {
  var begin = new Date(2019, 0, 1);
  var end = new Date(2019, 8, 1);
  var d = util.date_diff_days( begin, end );
  expect(d).toBe(242);
});

test('number of days in year', () => {
  var begin = new Date(2018, 11, 31);
  var end = new Date(2019, 11, 31);
  var d = util.date_diff_days( begin, end );
  expect(d).toBe(365);
});

test('number of days in leap year', () => {
  var begin = new Date(2019, 11, 31);
  var end = new Date(2020, 11, 31);
  var d = util.date_diff_days( begin, end );
  expect(d).toBe(366);
});
