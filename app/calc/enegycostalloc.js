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

function Energycostalloc(
  unit,
  contract )
{
  // always initialize all instance properties
  this.unit = unit;
  this.contract = contract;
  
  // contract heatcostallocatorreadings to be multiplied with apartment.heatcostallocators idnr factor
  
}

module.exports = Energycostalloc;
