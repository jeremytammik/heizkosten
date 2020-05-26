// enegycostalloc.js
//
// algorithm implementing energiekostenabrechnung for each contract
//
// Copyright 2020 by Jeremy Tammik.
//

/*
 input: unit, contract, energy_cost_for_this_contract_in_eur
 output: einzelabrechnung
*/

const loaddata = require('../../data/loaddata');
//const util = require('./util');

function Energycostalloc(
  contract_id,
  year ) // todo, possibly: support flexible begin and end date
{
  var contract = loaddata.contracts[contract_id];
  var apartment = loaddata.apartments[contract.apartment_id];
  var unit = loaddata.units[apartment.unit_id];
  var costs = loaddata.costs[apartment.unit_id + '-' + year.toString()];

  var begin, end = util.get_duration_in_given_year( contract.begin, contract.end, year );
  
  var cw_numbers = Object.keys(apartment.coldwatermeters);
  var cw_readings = contract.coldwatermeters;
  
  console.log(`contract begin and end in ${year}: ` + begin.toString() + ', ' + end.toString() );
  
//    "coldwatermeters": { "KW-BA-4007049": "2020-12-31", "KW-KU-52440355": "2020-12-31"},
//    "hotwatermeters": { "WW-BA-4133058": "2020-12-31", "WW-KU-604465496": "2020-12-31"},
//    "heatcostallocators": { "HE-WO-44322335": "2020-12-31, 1.35", "HE-BA-443323257": "2020-12-31, 0.375", "HE-SM-44323240": "2020-12-31, 0.975", "HE-SK-443323233": "2020-12-31, 0.675", "HE-KU-44322328": "2020-12-31, 0.575"},
    
}

module.exports = Energycostalloc;
