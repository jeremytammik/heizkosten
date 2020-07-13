const util = require('./util');

test('trimAllFieldsInObjectAndChildren', () => {
  //import * as _ from 'lodash';
  //assert.true(_.isEqual(util.trimAllFieldsInObjectAndChildren(' bob '), 'bob'));
  //assert.true(_.isEqual(util.trimAllFieldsInObjectAndChildren('2 '), '2'));
  //assert.true(_.isEqual(util.trimAllFieldsInObjectAndChildren(['2 ', ' bob ']), ['2', 'bob']));
  //assert.true(_.isEqual(util.trimAllFieldsInObjectAndChildren({'b ': ' bob '}), {'b': 'bob'}));
  //assert.true(_.isEqual(util.trimAllFieldsInObjectAndChildren({'b ': ' bob ', 'c': 5, d: true }), {'b': 'bob', 'c': 5, d: true}));
  //assert.true(_.isEqual(util.trimAllFieldsInObjectAndChildren({'b ': ' bob ', 'c': {' d': 'alica c c '}}), {'b': 'bob', 'c': {'d': 'alica c c'}}));
  //assert.true(_.isEqual(util.trimAllFieldsInObjectAndChildren({'a ': ' bob ', 'b': {'c ': {'d': 'e '}}}), {'a': 'bob', 'b': {'c': {'d': 'e'}}}));
  //assert.true(_.isEqual(util.trimAllFieldsInObjectAndChildren({'a ': ' bob ', 'b': [{'c ': {'d': 'e '}}, {' f ': ' g ' }]}), {'a': 'bob', 'b': [{'c': {'d': 'e'}}, {'f': 'g' }]}));

  expect(util.trimAllFieldsInObjectAndChildren(' bob ')).toBe('bob');
  expect(util.trimAllFieldsInObjectAndChildren('2 ')).toBe('2');
  expect(util.trimAllFieldsInObjectAndChildren(['2 ', ' bob '])).toEqual(['2', 'bob']);
  expect(util.trimAllFieldsInObjectAndChildren({'b ': ' bob '})).toEqual({'b': 'bob'});
  expect(util.trimAllFieldsInObjectAndChildren({'b ': ' bob ', 'c': 5, d: true })).toEqual({'b': 'bob', 'c': 5, d: true});
  expect(util.trimAllFieldsInObjectAndChildren({'b ': ' bob ', 'c': {' d': 'alica c c '}})).toEqual({'b': 'bob', 'c': {'d': 'alica c c'}});
  expect(util.trimAllFieldsInObjectAndChildren({'a ': ' bob ', 'b': {'c ': {'d': 'e '}}})).toEqual({'a': 'bob', 'b': {'c': {'d': 'e'}}});
  expect(util.trimAllFieldsInObjectAndChildren({'a ': ' bob ', 'b': [{'c ': {'d': 'e '}}, {' f ': ' g ' }]})).toEqual({'a': 'bob', 'b': [{'c': {'d': 'e'}}, {'f': 'g' }]});
});

test('date_diff_days date difference', () => {
  
  var begin = '2019-01-01'; // same day
  var end = '2019-01-01';
  var d = util.date_diff_days( begin, end );
  expect( d ).toBe( 0 );
  
  var begin = '2019-01-01'; // 31 + 28 + 31 + 30 + 31 + 30 + 31 + 30 + 1
  var end = '2019-09-01';
  var d = util.date_diff_days( begin, end );
  expect( d ).toBe( 243 );
  
  // crazy stuff using Date class
  //begin = new Date( 2019, 0, 1 );
  //end = new Date( 2019, 8, 1 );
  //d = util.date_diff_days( begin, end );
  //expect( d ).toBe( 242.95833333333334 );
  
  var begin = '2019-01-01';
  var end = '2019-12-31';
  var d = util.date_diff_days( begin, end );
  expect( d ).toBe( 364 );
  
  var begin = '2020-01-01';
  var end = '2020-12-31';
  var d = util.date_diff_days( begin, end );
  expect( d ).toBe( 365 );
});

test('number of days in year', () => {
  //var begin = new Date(2018, 11, 31);
  //var end = new Date(2019, 11, 31);
  //var begin = '2018-12-31';
  //var end = '2019-12-31';
  var begin = util.isodate_first_in_year( 2019 );
  var end = util.isodate_first_in_year( 2020 );
  var d = util.date_diff_days( begin, end );
  expect( d ).toBe( 365 );
});

test('number of days in leap year', () => {
  //var begin = new Date(2019, 11, 31);
  //var end = new Date(2020, 11, 31);
  //var begin = '2019-12-31';
  //var end = '2020-12-31';
  var begin = util.isodate_first_in_year( 2020 );
  var end = util.isodate_first_in_year( 2021 );
  var d = util.date_diff_days( begin, end );
  expect( d ).toBe( 366 );
});

test( 'get_duration_in_given_year for entire year', () => {
  var year = 2019;
  var begin = '2018-11-10'; 
  var end = '2020-01-10';
  var pair = util.get_duration_in_given_year( begin, end, year );
  expect( pair[0] ).toBe( '2019-01-01' );
  expect( pair[1] ).toBe( '2020-01-01' );
});
  
test( 'get_duration_in_given_year for partial year', () => {
  var year = 2018;
  var begin = '2017-11-10'; 
  var end = '2018-03-31';
  var pair = util.get_duration_in_given_year( begin, end, year );
  expect( pair[0] ).toBe( '2018-01-01' );
  expect( pair[1] ).toBe( '2018-03-31' );
});

test( 'get contract duration in given year for partial year', () => {
  year = 2018;
  const cbegin = '2015-12-16';
  const cend = '2018-04-01';
  var days_in_year = util.days_in_year( year ); // 365 or 366!
  expect( days_in_year ).toBe( 365 );
  var [begin, end] = util.get_duration_in_given_year( cbegin, cend, year );
  expect( begin ).toBe( '2018-01-01' );
  expect( end ).toBe( '2018-04-01' );
  var contract_days = util.date_diff_days( begin, end );
  expect( contract_days ).toBe( 31 + 28 + 31 );
  var contract_months = util.date_diff_months( begin, end );
  expect( contract_months ).toBe( 3 );
  var contract_duration = contract_days / days_in_year;
  expect( contract_duration ).toBe( 0.2465753424657534 );
});

test( 'get contract duration in given year for entire year', () => {
  year = 2018;
  const cbegin = '2015-12-16';
  const cend = '2020-04-01';
  var days_in_year = util.days_in_year( year ); // 365 or 366!
  expect( days_in_year ).toBe( 365 );
  var [begin, end] = util.get_duration_in_given_year( cbegin, cend, year );
  expect( begin ).toBe( '2018-01-01' );
  expect( end ).toBe( '2019-01-01' );
  var contract_days = util.date_diff_days( begin, end );
  expect( contract_days ).toBe( 365 );
  var contract_months = util.date_diff_months( begin, end );
  expect( contract_months ).toBe( 12 );
  var contract_duration = contract_days / days_in_year;
  expect( contract_duration ).toBe( 1 );
});
