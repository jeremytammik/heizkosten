'use strict';

const {   non_empty_alpha_mumeric, empty_or_ascii_or_umlaut } = require( './jtregex' );
const loaddata = require('./loaddata');

test('JSON parse date reviver', () => {
  const text = '{ "date": "2016-04-26" }';
  const obj = JSON.parse(text, loaddata.json_parse_date_reviver);
  expect(obj.date.getFullYear()).toBe(2016);
  expect(obj.date.getMonth()).toBe(3);
  expect(obj.date.getDate()).toBe(26);
});

test('all data characters are ascii or umlaut', () => {
  for (const [key, value] of Object.entries(loaddata)) {
    for (const [key2, value2] of Object.entries(value)) {
      for (const [key3, value3] of Object.entries(value2)) {
        expect(key3).toMatch( non_empty_alpha_mumeric );
        if (typeof value3 === 'string' || value3 instanceof String) {
          expect(value3).toMatch( empty_or_ascii_or_umlaut );
        }
      }
    }
  }
});

test('loaded five apartments', () => {
  expect(Object.keys(loaddata.apartments).length).toBe(5);
});

test('loaded N persons', () => {
  expect(Object.keys(loaddata.persons).length).toBe(13);
});

test('person id matches dictionary key', () => {
  for (const [key, value] of Object.entries(loaddata.persons)) {
    expect(value._id).toBe( key );
  }
});

test('person is linked to valid units', () => {
  var unit_ids = Object.keys(loaddata.units);
  for (const [key, value] of Object.entries(loaddata.persons)) {
    value.units.split(',').forEach( (uid) => {
      expect(unit_ids).toContain( uid );
    });
  }
});

test('unit id matches dictionary key', () => {
  for (const [key, value] of Object.entries(loaddata.units)) {
    expect(value._id).toBe( key );
  }
});

test('unit has valid manager', () => {
  var person_ids = Object.keys(loaddata.persons);
  for (const [key, value] of Object.entries(loaddata.units)) {
    expect(person_ids).toContain( value.manager );
  }  
});

test('apartment id matches dictionary key', () => {
  for (const [key, value] of Object.entries(loaddata.apartments)) {
    expect(value._id).toBe( key );
  }
});

test('apartment has valid owner', () => {
  var person_ids = Object.keys(loaddata.persons);
  for (const [key, value] of Object.entries(loaddata.apartments)) {
    expect(person_ids).toContain( value.owner_id );
  }  
});

test('apartment has valid active contract', () => {
  var map_apt_to_contract = {};
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    // check that contract is currently active:
    var test_date_time = new Date("2018-07-14").getTime();
    if(value.begin.getTime() <= test_date_time
       && ((null == value.end)
           || (test_date_time <= value.end.getTime()))) {
      var apt = value.apartment;
      if(!(apt in map_apt_to_contract)) {
        map_apt_to_contract[apt] = [];
      }
      map_apt_to_contract[apt].push(value);
    }
  }
  var apartment_ids = Object.keys(loaddata.apartments);
  var map_keys = Object.keys(map_apt_to_contract);
  apartment_ids.forEach( (a) => { expect(map_keys).toContain( a ); } );
});

test('contract id matches dictionary key', () => {
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    expect(value._id).toBe( key );
  }
});

test('contract has valid apartment, occupants, begin date, and later end', () => {
  var apartment_ids = Object.keys(loaddata.apartments);
  var person_ids = Object.keys(loaddata.persons);
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    expect(apartment_ids).toContain( value.apartment );
    value.occupants.forEach( (p) => { expect(person_ids).toContain( p ); } );
    expect(value.begin).toBeInstanceOf(Date);
    var end_is_null_or_later_than_begin = (null === value.end)
      ? true
      : (value.begin.getTime() < value.end.getTime());
    expect(end_is_null_or_later_than_begin).toBeTruthy();
  }  
});

test('each contracts meter numbers match its apartments ones', () => {
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    var apt = loaddata.apartments[value.apartment];
    var a = Object.keys(apt.coldwatermeters);
    var b = Object.keys(value.coldwatermeters);
    expect(0===b.length || (a.length === b.length && a.every(function(value, index) { return value === b[index]}))).toBeTruthy();
    var a = Object.keys(apt.hotwatermeters);
    var b = Object.keys(value.hotwatermeters);
    expect(0===b.length || (a.length === b.length && a.every(function(value, index) { return value === b[index]}))).toBeTruthy();
    var a = Object.keys(apt.heatcostallocators);
    var b = Object.keys(value.heatcostallocatorreadings);
    expect(0===b.length || (a.length === b.length && a.every(function(value, index) { return value === b[index]}))).toBeTruthy();
  }
});

test('all payment in each contract match expected account enum values', () => {
  const enum_contract_accounts = [
    'apartment_rental',
    'other_rental',
    'nebenkosten'
    //'deposit',
    //'nkrueckbehalt'
  ];
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    value.payments.forEach( (p) => expect(enum_contract_accounts).toContain(p.account));
  }
});
