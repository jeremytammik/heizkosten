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

test('JSON parse date reviver', () => {
  const text = '{ "date": "2016-04-26" }';
  const obj = JSON.parse(text, util.json_parse_date_reviver);
  expect(obj.date.getFullYear()).toBe(2016);
  expect(obj.date.getMonth()).toBe(3);
  expect(obj.date.getDate()).toBe(26);
});
