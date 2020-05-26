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

const loaddata = require('./loaddata');
const util = require('./util');

// Determine contract duration in given year span
function get_contract_duration_in_given_year( contract, begin, end )
{
  // adjust begin and end to contract begin and end in given year
  
  if(contract.end < begin)
  {
    return begin, begin;
  }
  else if (contract.begin > end)
  {
    return end, end;
  }
  else {
    if(begin < contract.begin) {
      begin = contract.begin;
    }
    if(contract.end < end) {
      end = contract.end;
    }
  }
  return begin, end;
}

function Energycostalloc(
  contract_id,
  year ) // todo, possibly: support flexible begin and end date
{
  var contract = loaddata.contracts[contract_id];
  var apartment = loaddata.apartments[contract.apartment_id];
  var unit = loaddata.units[apartment.unit_id];
  var costs = loaddata.costs[apartment.unit_id + '-' + year.toString()];

  var begin = new Date( year-1, 11, 31 );
  var end =  new Date( year, 11, 31 );
  var begin, end = get_contract_duration_in_given_year( contract, begin, end );
  
  var cw_numbers = Object.keys(apartment.coldwatermeters);
  var cw_readings = contract.coldwatermeters;
  
  console.log(`contract begin and end in ${year}: ` + begin.toString() + ', ' + end.toString() );
  
  
//    "coldwatermeters": { "KW-BA-4007049": "2020-12-31", "KW-KU-52440355": "2020-12-31"},
//    "hotwatermeters": { "WW-BA-4133058": "2020-12-31", "WW-KU-604465496": "2020-12-31"},
//    "heatcostallocators": { "HE-WO-44322335": "2020-12-31, 1.35", "HE-BA-443323257": "2020-12-31, 0.375", "HE-SM-44323240": "2020-12-31, 0.975", "HE-SK-443323233": "2020-12-31, 0.675", "HE-KU-44322328": "2020-12-31, 0.575"},
  
  
}

module.exports = Energycostalloc;
