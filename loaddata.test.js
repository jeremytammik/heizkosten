const loaddata = require('./loaddata');

test('loaded five apartments', () => {
  expect(Object.keys(loaddata.apartments).length).toBe(5);
});

test('loaded nine persons', () => {
  expect(Object.keys(loaddata.persons).length).toBe(9);
});

//test('apartment has valid owner', () => {
//  for (var entry of loaddata.apartments) {
//    var key = entry[0], value = entry[1];
//    expect(key).toBe(value.apartment_id);
//    //expect value.owner_id to be a valid key in the list of persons
//  }  
//});
