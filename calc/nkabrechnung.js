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
const util = require('./util');

function Nkabrechnung(
  unit,
  contract,
  year,
  energy_cost_eur )
{
  // always initialize all instance properties
  this.unit = unit;
  this.contract = contract;
  this.year = year;
  this.energy_cost_eur = energy_cost_eur;

  // Determine contract duration in given year span
  
  var begin = Date(year-1, 11, 31);
  var end =  Date(year, 11, 31);
  var days_in_year = util.date_diff_days( begin, end ); // 365 or 366!
  var days = days_in_year;
  
  if((contract.end < begin) || (contract.begin > end))
  {
    days = 0;
  }
  else {
    if(begin < contract.begin) {
      begin = contract.begin;
    }
    if(contract.end < end) {
      end = contract.end;
    }
    days = util.date_diff_days( begin, end );
  }
  
  var contract_duration = days_in_year / days;
  
  var apartment = loaddata.apartments[contract.apartment];
  
  
  this.vorauszahlungen = // get contract payments with account 'nebenkosten'
  this.rueckbehalt =  // get contract payments with account 'nkrueckbehalt'
  this.hauskosten_umlagefaehig = // retrieve hauskosten and apply umlage factor * contract_duration; is umlagefactor = apartment.nebenkosten_anteil_schluessel?
  this.energiekosten = 
  this.grundsteuer = apartment.landtax_eur * contract_duration;
  this.rauchmelderwartung = // contract.smokedetector_maintenance_count * contract.smokedetector_maintenance_cost_eur?

};

// class methods
Nkabrechnung.prototype.fooBar = function() {

};

module.exports = Nkabrechnung;
