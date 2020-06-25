// nkabrechnung.js
//
// algorithm implementing nebenkostenabrechnung for a given contract
//
// Copyright 2020 by Jeremy Tammik.
//
// Following advice on JavaScript OOP from http://book.mixu.net/node/ch6.html
//

/*
 input: unit, contract, energy_cost_for_this_contract_in_eur
 output: einzelabrechnung
*/

const Coal = require('./Coal');

function get_nkabrechnung_for( unit, costs, apartment, contract, addressee, year, energy_cost_eur ) // energiekosten
{
  var c = new Coal(
    unit, costs, apartment, contract,
    addressee, year, energy_cost_eur );
  
  var tdr = '<td class="right">';
  var s = `<h3>Wohnung ${c.apartment_id}</h3>\n`;
  s += `<p>An ${c.addressee}</p>\n`;
  s += '<table>\n';
  s += `<tr>${tdr}Vorauszahlung geleistet</td>${tdr}${c.nkvorauszahlung.toFixed(2)}</td></tr>\n`;
  s += `<tr>${tdr}Rueckbehalt</td>${tdr}${c.rueckbehalt.toFixed(2)}</td></tr>\n`;
  s += `<tr>${tdr}Hausgeld umlagefaehig</td>${tdr}${c.hausgeld_umlagefaehig.toFixed(2)}</td></tr>\n`;
  s += `<tr>${tdr}Grundsteuer</td>${tdr}${c.grundsteuer.toFixed(2)}</td></tr>\n`;
  s += `<tr>${tdr}Rauchmelderwartung</td>${tdr}${c.rauchmelderwartung.toFixed(2)}</td></tr>\n`;
  s += `<tr>${tdr}Nebenkosten</td>${tdr}${c.nebenkosten.toFixed(2)}</td></tr>\n`;
  s += `<tr>${tdr}Guthaben</td>${tdr}${c.credit.toFixed(2)}</td></tr>\n`;
  s += `<tr>${tdr}Vorauszahlung zukuenftig</td>${tdr}${c.new_nkvorauszahlung_pm.toFixed(2)}</td></tr>\n`;
  s += '</table>\n';
  
  return s;
}

const loaddata = require('../../data/loaddata');

function get_nkabrechnung(
  contract_id,
  yr, // todo, possibly: support flexible begin and end date
  energy_cost_eur ) // energiekosten
{
  var contract = loaddata.contracts[contract_id];
  var year = yr;
  var apartment = loaddata.apartments[contract.apartment_id];
  var unit = loaddata.units[apartment.unit_id];
  var costs = loaddata.costs[apartment.unit_id + '-' + year.toString()];
  
  var nk = {};
  nk.energy_cost_eur = energy_cost_eur;

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
  if( !pnk_for_year ) { pnk_for_year = contract_months * get_latest_contract_expected_payments( contract.nebenkosten_eur ); }
  //console.log(contract_months, contract.nebenkosten_eur, pnk_for_year);
  nk.nkvorauszahlung = pnk_for_year;
  nk.rueckbehalt = 0; // this information is entered manually
  var h_anteilig = get_hausgeld_umlagefaehig_anteilig( costs );
  var h_proportional = get_hausgeld_umlagefaehig_proportional( costs );
  var h = contract_duration * (h_anteilig / unit.apt_count + h_proportional * apartment.nebenkosten_anteil_schluessel);
  nk.hausgeld_umlagefaehig = util.round_to_two_digits( h );
  nk.grundsteuer = apartment.landtax_eur * contract_duration;
  nk.rauchmelderwartung = Object.keys( apartment.smokedetectors ).length * contract.smokedetector_maintenance_cost_eur * contract_duration;
  nk.nebenkosten = util.round_to_two_digits( nk.energy_cost_eur + nk.rueckbehalt + nk.hausgeld_umlagefaehig + nk.grundsteuer + nk.rauchmelderwartung );
  nk.credit = util.round_to_two_digits( nk.nkvorauszahlung - nk.nebenkosten );
  nk.new_nkvorauszahlung_per_month = util.round_to_two_digits( (nk.nkvorauszahlung - 12 * (nk.credit / 11.5)) / 12 );
  return nk;
}

// class methods

//Nkabrechnung.prototype.report_html = function() {
//  console.log(this);
//};

module.exports = {
  get_nkabrechnung,
  get_nkabrechnung_for
};
