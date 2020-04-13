'use strict';

const loaddata = require('./loaddata');

test('loaded five apartments', () => {
  expect(Object.keys(loaddata.apartments).length).toBe(5);
});

test('loaded nine persons', () => {
  expect(Object.keys(loaddata.persons).length).toBe(9);
});

test('apartment has valid owner', () => {
  var owners = Object.keys(loaddata.persons);
  for (const [key, value] of Object.entries(loaddata.apartments)) {
    expect(key).toBe( value.apartment_id );
    expect(owners).toContain( value.owner_id );
  }  
});
