// nkabrechnung.js
//
// algorithm implementing nebenkostenabrechnung for each contract
//
// Copyright 2020 by Jeremy Tammik.
//
// Following advice from http://book.mixu.net/node/ch6.html
//

/*
 input: unit, contract, energy_cost_for_this_contract_in_eur
 output: einzelabrechnung
*/

const loaddata = require('./loaddata');

function Nkabrechnung(
  unit,
  contract,
  energy_cost_eur )
{
  // always initialize all instance properties
  this.unit = unit;
  this.contract = contract;
  this.energy_cost_eur = energy_cost_eur;
  
  var apartment = loaddata.apartments[contract.apartment];
  
  var contract_duration = 1.0; // whole year
  
  
  this.vorauszahlungen = 
  this.rueckbehalt = 
  this.hauskosten_umlagefaehig = 
  this.energiekosten = 
  this.grundsteuer = 
  this.rauchmelderwartung = 
};

// class methods
Nkabrechnung.prototype.fooBar = function() {

};

module.exports = Nkabrechnung;
