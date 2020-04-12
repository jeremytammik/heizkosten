const loaddata = require('./loaddata');

test('loaded five apartments', () => {
  expect(Object.keys(loaddata.apartments).length).toBe(5);
});

test('loaded nine persons', () => {
  expect(Object.keys(loaddata.persons).length).toBe(9);
});