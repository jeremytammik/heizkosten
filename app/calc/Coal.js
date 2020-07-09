// Coal.js
//
// Utility cost allocation algorithm implementing nebenkostenabrechnung for a given contract
//
// Copyright 2020 by Jeremy Tammik.
//
// Following advice on JavaScript OOP from http://book.mixu.net/node/ch6.html
//

/*
 input: unit, contract, energy_cost_for_this_contract_in_eur
 output: einzelabrechnung
*/

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

function get_latest_contract_expected_payments( dict_date_amount_string )
{
  var a = dict_date_amount_string.split( ',' );
  var b = a[ a.length - 1 ].split( ':' );
  return Number( b[1] );
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

function get_hausgeld_umlagefaehig_anteilig( costs )
{
  //var h = unit.costs[year.toString()].allocatable;
  //var total = sum_of_object_values( h );
  //var total_propertional = total - total_anteilig;
  //var total_anteilig = costs.kabelgebuehren;
  
  return costs.kabelgebuehren;
}

function get_hausgeld_umlagefaehig_proportional( costs )
{
  return costs.allgemeinstrom
    + costs.muellgebuehren_hausmeister
    + costs.streu_und_putzmittel
    + costs.aussenanlage_pflege
    + costs.versicherungen
    + costs.niederschlagswasser
    + costs.trinkwasseruntersuchung
    + costs.material_und_hilfsstoffe
    + costs.reinigung
    + costs.hausmeister_sozialabgaben
    + costs.hausservice_fremdfirmen
    + costs.lift_umlagefaehig
    + costs.feuerloescher_wartung
    + costs.wartung_eingangstueren
    + costs.wartung_lueftungsanlage;
}

function Coal( unit, costs, apartment, contract,
  addressee, year, energy_cost_eur ) // energiekosten
{
  //console.log(year, contract, util);
  
  // Determine contract duration in given year span
  
  var days_in_year = util.days_in_year( year ); // 365 or 366!
  var [begin, end] = util.get_duration_in_given_year( contract.begin, contract.end, year );
  var contract_days = util.date_diff_days( begin, end );
  var contract_months = util.date_diff_months( begin, end );
  var contract_duration = days_in_year / contract_days;

  //console.log('contract beg/end, days in year, contract days and duration',
  //  util.jtisodate(begin), util.jtisodate(end), days_in_year, contract_days, contract_duration );
  
  var pnk = util.string_to_object_with_numbers( contract.payments_nk );
  var pnk_for_year = pnk[ year.toString() ];
  
  if( !pnk_for_year ) {
    pnk_for_year = contract_months
      * get_latest_contract_expected_payments( contract.nebenkosten_eur );
  }
  
  //console.log(contract_months, contract.nebenkosten_eur, pnk_for_year);
  
  var h_anteilig = get_hausgeld_umlagefaehig_anteilig( costs );
  var h_proportional = get_hausgeld_umlagefaehig_proportional( costs );
  var h = contract_duration * (h_anteilig / unit.apt_count + h_proportional * apartment.faktor_hauskosten_umlagefaehig);

  var smoke_detector_count = Object.keys( apartment.smokedetectors ).length;
  
  //var tdr = '<td class="right">';
  //var s = `<h3>Wohnung ${contract.apartment_id}</h3>\n`;
  //s += `<p>An ${addressee.firstname} ${addressee.lastname}, ${addressee.street} ${addressee.streetnr}, ${addressee.city}</p>\n`;
  //s += '<table>\n';
  //s += `<tr>${tdr}Vorauszahlung geleistet</td>${tdr}${nkvorauszahlung.toFixed(2)}</td></tr>\n`;
  //s += `<tr>${tdr}Rueckbehalt</td>${tdr}${rueckbehalt}</td></tr>\n`;
  //s += `<tr>${tdr}Hausgeld umlagefaehig</td>${tdr}${hausgeld_umlagefaehig.toFixed(2)}</td></tr>\n`;
  //s += `<tr>${tdr}Grundsteuer</td>${tdr}${grundsteuer.toFixed(2)}</td></tr>\n`;
  //s += `<tr>${tdr}Rauchmelderwartung</td>${tdr}${rauchmelderwartung.toFixed(2)}</td></tr>\n`;
  //s += `<tr>${tdr}Nebenkosten</td>${tdr}${nebenkosten.toFixed(2)}</td></tr>\n`;
  //s += `<tr>${tdr}Guthaben</td>${tdr}${credit.toFixed(2)}</td></tr>\n`;
  //s += `<tr>${tdr}Vorauszahlung zukuenftig</td>${tdr}${new_nkvorauszahlung_per_month.toFixed(2)}</td></tr>\n`;
  //s += '</table>\n';

  //this.apartment_id = contract.apartment_id;
  
  this.contract_id = contract._id;
  this.faktor_hauskosten_umlagefaehig = apartment.faktor_hauskosten_umlagefaehig;
  this.salutation = addressee.salutation;
  this.addressee = `${addressee.firstname} ${addressee.lastname}`;
  this.address = `${addressee.street} ${addressee.streetnr}, ${addressee.zip} ${addressee.city}`;
  this.nkvorauszahlung = util.round_to_two_digits( pnk_for_year );
  this.rueckbehalt = contract.withholding_nk_eur;
  this.hausgeld_umlagefaehig = util.round_to_two_digits( h );
  this.grundsteuer = util.round_to_two_digits( apartment.landtax_eur * contract_duration );
  this.rauchmelderwartung = util.round_to_two_digits( smoke_detector_count * contract.smokedetector_maintenance_cost_eur * contract_duration );
  this.energycost = energy_cost_eur;
  
  this.nebenkosten = util.round_to_two_digits( this.energycost + this.hausgeld_umlagefaehig + this.grundsteuer + this.rauchmelderwartung );
  
  // - (this.nkvorauszahlung + this.rueckbehalt) );
  
  this.credit = util.round_to_two_digits( this.nkvorauszahlung - this.nebenkosten );
  this.new_nkvorauszahlung_pm = util.round_to_two_digits( (this.nkvorauszahlung - 12 * (this.credit / 11.5)) / 12 );
  
  //console.log('this', this);
}

module.exports = Coal;
