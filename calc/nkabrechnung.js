// nkabrechnung.js
//
// algorithm implementing nebenkostenabrechnung for a given contract
//
// Copyright 2020 by Jeremy Tammik.
//
// Following advice from http://book.mixu.net/node/ch6.html
//

/*
 input: unit, contract, energy_cost_for_this_contract_in_eur
 output: einzelabrechnung
*/

const loaddata = require('../data/loaddata');
const util = require('./util');

function get_contract_payments_total( contract, konto, year )
{
  var total = 0;
  var year_begin = new Date(year-1, 11, 31);
  var year_end =  new Date(year, 11, 31);
  contract.payments.forEach( (p) => {
    if( konto === p.account
       && year_begin < p.date
       && p.date < year_end ) {
        total += p.amount;
    }
  });
  return total;
}

// https://stackoverflow.com/questions/16449295/how-to-sum-the-values-of-a-javascript-object
function sum_of_object_values( obj )
{
  var sum = 0;
  for( var el in obj ) {
    if( obj.hasOwnProperty( el ) ) {
      sum += obj[el]; // parseFloat( obj[el] );
    }
  }
  return sum;
}

function get_hausgeld_umlagefaehig_anteilig_propotional( unit, year )
{
  var h = unit.costs[year.toString()].allocatable;
  var total = sum_of_object_values( h );
  var total_anteilig = h.kabelgebuehren;
  var total_propertional = total - total_anteilig;
  return [total_anteilig, total_propertional];
}

function Nkabrechnung(
  contract_id,
  year, // todo, possibly: support flexible begin and end date
  energy_cost_eur )
{
  var contract = loaddata.contracts[contract_id];
  var apartment = loaddata.apartments[contract.apartment];
  var unit = loaddata.units[apartment.unit_id];
  
  this.energy_cost_eur = energy_cost_eur;

  // Determine contract duration in given year span

  var begin = new Date( year-1, 11, 31 );
  var end =  new Date( year, 11, 31 );
  
  //console.log('here: ' + begin.toString() + ', ' + end.toString() );
  
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
  
  this.nkvorauszahlung = get_contract_payments_total( contract, 'nebenkosten', year );
  this.rueckbehalt = 0; // this information is entered manually
  var h2 = get_hausgeld_umlagefaehig_anteilig_propotional( unit, year );
  var h = contract_duration * h2[0] / unit.apt_count + contract_duration * h2[1] * apartment.nebenkosten_anteil_schluessel;
  this.hausgeld_umlagefaehig = util.round_to_two_digits( h );
  this.grundsteuer = apartment.landtax_eur * contract_duration;
  this.rauchmelderwartung = Object.keys( apartment.smokedetectors ).length * contract.smokedetector_maintenance_cost_eur * contract_duration;
  this.nebenkosten = util.round_to_two_digits( this.energy_cost_eur + this.rueckbehalt + this.hausgeld_umlagefaehig + this.grundsteuer + this.rauchmelderwartung );
  this.credit = util.round_to_two_digits( this.nkvorauszahlung - this.nebenkosten );
  this.new_nkvorauszahlung_per_month = util.round_to_two_digits( (this.nkvorauszahlung - 12 * (this.credit / 11.5)) / 12 );
}

// class methods
//Nkabrechnung.prototype.fooBar = function() {
//};

module.exports = Nkabrechnung;
