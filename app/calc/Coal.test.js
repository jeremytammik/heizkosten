const loaddata = require('../../data/loaddata');
const Coal = require('./Coal');

test('test Coal utility cost allocation algorithm implementing nebenkostenabrechnung for a given contract', () => {
  var year = 2018;
  var contract_id = "001-01-04-2018";
  var energy_cost_eur = 907.54;
  var contract = loaddata.contracts[contract_id];
  var apartment = loaddata.apartments[contract.apartment_id];
  var unit = loaddata.units[apartment.unit_id];
  var costs = loaddata.costs[apartment.unit_id + '-' + year.toString()];
  var addressee = loaddata.persons(contract.occupant_ids[0]);

  var coal = new Coal( unit, costs, apartment, contract,
    addressee, year, energy_cost_eur )
  
  console.log( coal );
  
  expect( coal.nkvorauszahlung ).toBe(2208);
  expect( coal.hausgeld_umlagefaehig ).toBe(828.66);
  expect( coal.grundsteuer ).toBe(278.44);
  expect( coal.rauchmelderwartung ).toBe(20);
  expect( coal.nebenkosten ).toBe(2034.64);
  expect( coal.credit ).toBe(173.36);
  expect( coal.new_nkvorauszahlung_per_month ).toBe(168.93);
});
