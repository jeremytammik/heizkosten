const loaddata = require('../../data/loaddata');
const Coal = require('./Coal');

test('test Coal utility cost allocation algorithm implementing nebenkostenabrechnung for a given contract in year 2018', () => {
  var year = 2018;
  var contract_id = "001-01-04-2018";
  var energy_cost_str = "2018: 907.54";
  var contract = loaddata.contracts[contract_id];
  var apartment = loaddata.apartments[contract.apartment_id];
  var unit = loaddata.units[apartment.unit_id];
  var costs = loaddata.costs[apartment.unit_id + '-' + year.toString()];
  var addressee = loaddata.persons[contract.occupant_ids[0]];

  var coal = new Coal(
    unit, costs, apartment, contract,
    addressee, year, energy_cost_str );
  
  //console.log( coal );
  
  expect( coal.nkvorauszahlung ).toBe(2208);
  expect( coal.hausgeld_umlagefaehig ).toBe(828.66);
  expect( coal.grundsteuer ).toBe(278.44);
  expect( coal.rauchmelderwartung ).toBe(20);
  expect( coal.nebenkosten ).toBe(2034.64);
  expect( coal.credit ).toBe(173.36);
  expect( coal.new_nkvorauszahlung_pm ).toBe(168.93);
});

test('test Coal utility cost allocation algorithm given changes in nebenkostenvorauszahlung for a given contract in year 2019', () => {
  const year = 2019;
  const contract_id = "001-01-06-2018";
  const energy_cost_str = "2019: 1892.03";
  const contract = loaddata.contracts[contract_id];
  const apartment = loaddata.apartments[contract.apartment_id];
  const unit = loaddata.units[apartment.unit_id];
  const costs = loaddata.costs[apartment.unit_id + '-' + year.toString()];
  const addressee = loaddata.persons[contract.occupant_ids[0]];
  var calculate_nk_prepayment_based_on_days = true;

  var coal = new Coal(
    unit, costs, apartment, contract,
    addressee, year, energy_cost_str,
    calculate_nk_prepayment_based_on_days );
  
  //console.log( coal );
  
  expect( coal.nkvorauszahlung ).toBe(2537.12);
  expect( coal.hausgeld_umlagefaehig ).toBe(672.51);
  expect( coal.grundsteuer ).toBe(234.80);
  expect( coal.rauchmelderwartung ).toBe(15);
  expect( coal.nebenkosten ).toBe(2814.34);
  expect( coal.credit ).toBe(-277.22);
  expect( coal.new_nkvorauszahlung_pm ).toBe(235.53);

  calculate_nk_prepayment_based_on_days = false;

  coal = new Coal(
    unit, costs, apartment, contract,
    addressee, year, energy_cost_str,
    calculate_nk_prepayment_based_on_days );
  
  //console.log( coal );
  
  expect( coal.nkvorauszahlung ).toBe(2536.44);
  expect( coal.hausgeld_umlagefaehig ).toBe(672.51);
  expect( coal.grundsteuer ).toBe(234.80);
  expect( coal.rauchmelderwartung ).toBe(15);
  expect( coal.nebenkosten ).toBe(2814.34);
  expect( coal.credit ).toBe(-277.90);
  expect( coal.new_nkvorauszahlung_pm ).toBe(235.54);
});

test('test Coal utility cost allocation algorithm for a given contract in year 2020', () => {
  const year = 2020;
  const contract_id = "001-00-01-2018";
  const energy_cost_str = "2020: 1000.00";
  const contract = loaddata.contracts[contract_id];
  const apartment = loaddata.apartments[contract.apartment_id];
  const unit = loaddata.units[apartment.unit_id];
  const costs = loaddata.costs[apartment.unit_id + '-' + year.toString()];
  const addressee = loaddata.persons[contract.occupant_ids[0]];
  
  var calculate_nk_prepayment_based_on_days = true;

  var coal = new Coal(
    unit, costs, apartment, contract,
    addressee, year, energy_cost_str,
    calculate_nk_prepayment_based_on_days );
  
  //console.log( coal );
  
  //expect( coal.nkvorauszahlung ).toBe(2537.12);
  //expect( coal.hausgeld_umlagefaehig ).toBe(672.51);
  //expect( coal.grundsteuer ).toBe(234.80);
  //expect( coal.rauchmelderwartung ).toBe(15);
  //expect( coal.nebenkosten ).toBe(2814.34);
  //expect( coal.credit ).toBe(-277.22);
  //expect( coal.new_nkvorauszahlung_pm ).toBe(235.53);

  calculate_nk_prepayment_based_on_days = false;

  coal = new Coal(
    unit, costs, apartment, contract,
    addressee, year, energy_cost_str,
    calculate_nk_prepayment_based_on_days );
  
  //console.log( coal );
  
  //expect( coal.nkvorauszahlung ).toBe(2536.44);
  //expect( coal.hausgeld_umlagefaehig ).toBe(672.51);
  //expect( coal.grundsteuer ).toBe(234.80);
  //expect( coal.rauchmelderwartung ).toBe(15);
  //expect( coal.nebenkosten ).toBe(2814.34);
  //expect( coal.credit ).toBe(-277.90);
  //expect( coal.new_nkvorauszahlung_pm ).toBe(235.54);
});

/*

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

"nebenkosten_eur": "2019-01-01: 211.37",
"nebenkosten_eur": "2019-01-01: 204.44, 2019-07-01: 218.30",

Calculate per day:

jc> pppm = 204.44
        pppm = 204.44
        204.44
jc> pppy = 12 * pppm
        pppy = 2453.28
        2453.28
jc> pppd = pppy / 365
        pppd = 6.721315068
        6.721315068

Calculate per month:

jc> a = 6 * 204.44
        a = 1226.64
        1226.64
jc> b = 6 * 218.30
        b = 1309.8
        1309.8
jc> a + b
        2536.44

*/
