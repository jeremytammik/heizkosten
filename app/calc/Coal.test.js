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
  var addressee = loaddata.persons[contract.occupant_ids[0]];

  var coal = new Coal(
    unit, costs, apartment, contract,
    addressee, year, energy_cost_eur );
  
  console.log( coal );
  
  expect( coal.nkvorauszahlung ).toBe(2208);
  expect( coal.hausgeld_umlagefaehig ).toBe(828.66);
  expect( coal.grundsteuer ).toBe(278.44);
  expect( coal.rauchmelderwartung ).toBe(20);
  expect( coal.nebenkosten ).toBe(2034.64);
  expect( coal.credit ).toBe(173.36);
  expect( coal.new_nkvorauszahlung_pm ).toBe(168.93);
});

test('test Coal utility cost allocation algorithm given changes in nebenkostenabvorauszahlung for a given contract', () => {
  var year = 2019;
  var contract_id = "001-01-06-2018";
  var energy_cost_eur = 1892.03;
  var contract = loaddata.contracts[contract_id];
  var apartment = loaddata.apartments[contract.apartment_id];
  var unit = loaddata.units[apartment.unit_id];
  var costs = loaddata.costs[apartment.unit_id + '-' + year.toString()];
  var addressee = loaddata.persons[contract.occupant_ids[0]];

  var coal = new Coal(
    unit, costs, apartment, contract,
    addressee, year, energy_cost_eur );
  
  console.log( coal );
  
  expect( coal.nkvorauszahlung ).toBe(2536.44);
  expect( coal.hausgeld_umlagefaehig ).toBe(672.51);
  expect( coal.grundsteuer ).toBe(234.80);
  expect( coal.rauchmelderwartung ).toBe(15.00);
  expect( coal.nebenkosten ).toBe(2814.34);
  expect( coal.credit ).toBe(277.90);
  expect( coal.new_nkvorauszahlung_pm ).toBe(235.54);
});

/*

"nebenkosten_eur": "2019-01-01: 211.37",
"nebenkosten_eur": "2019-01-01: 204.44, 2019-07-01: 218.30",

Mietvertrag 001-01-06-2018
Werter Mieter*in Constatin & Tatiana Mattern, Fecampring 28, 79618 Rheinfelden

Faktor Hauskosten umlagefähig	0.0110
1. Daraus: anteiliges Hausgeld	672.51
2. Grundsteuer	234.80
3. Wartung Rauchmelder	15.00
4. Energiekosten	1892.03
5. Summe Nebenkosten	2814.34
6. Geleistete Vorrauszahlungen	2536.44
7. Evtl. Rückbehalt	0.00
8. Guthaben (+) oder Nachzahlung (-)	-277.90
Daraus ergibt sich folgende zukünftige Warmmiete:

9. Kaltmiete, wie bisher	666.00
10. NK- Vorrauszahlung, neu	235.54
11. Sonstige Mieten (Garage usw.)	10.00
12. Neue Warmmiete	911.54
*/
