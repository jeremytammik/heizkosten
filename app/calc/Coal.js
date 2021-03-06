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
//function get_contract_duration_in_given_year( contract, begin, end )
//{
//  // adjust begin and end to contract begin and end in given year
//
//  if(contract.end < begin)
//  {
//    return begin, begin;
//  }
//  else if (contract.begin > end)
//  {
//    return end, end;
//  }
//  else {
//    if(begin < contract.begin) {
//      begin = contract.begin;
//    }
//    if(contract.end < end) {
//      end = contract.end;
//    }
//  }
//  return begin, end;
//}

//function get_contract_payments_total( contract, konto, year )
//{
//  var total = 0;
//  var year_begin = last_day_in_year( year - 1 );
//  var year_end = last_day_in_year( year );
//  contract.payments.forEach( (p) => {
//    if( konto === p.account
//       && year_begin < p.date
//       && p.date < year_end ) {
//        total += p.amount;
//    }
//  });
//  return total;
//}

function get_latest_contract_expected_payments( dict_date_amount_string )
{
  var b = 0;
  if( dict_date_amount_string ) {
    var a = dict_date_amount_string.split( ',' );
    b = a[ a.length - 1 ].split( ':' );
    b = Number( b[1] );
  }
  return b;
}

function get_prepayments_during(
  dict_date_amount_string, begin, end,
  calculate_prepayment_based_on_days )
{
  //console.log( dict_date_amount_string, begin, end,
  //  calculate_prepayment_based_on_days );
  
  var pp = 0;
  if( dict_date_amount_string ) {
    var a = dict_date_amount_string.split( ',' ).map( s => s.split( ':' ) );
    //var last = a[ a.length - 1 ];
    //var last_date = last[0].trim();
    
    if( false /*util.isodate_string_is_before_or_eq( last_date, begin )*/ ) {
      // calculate prepayment based on full months
      var nmonths = util.date_diff_months( begin, end );
      var last_amount = Number( last[1] );
      pp = nmonths * last_amount;
    }
    
    else if( calculate_prepayment_based_on_days ) {
      // calculate prepayment based on days
      var ndays = 0;
      var icurrent = a.length - 1;
      var ppstartdate = a[icurrent][0].trim();
      var pppm = Number( a[icurrent][1] ); // expected prepayment amount per month
      var pppd = pppm * 12 / 365; // expected prepayment amount per day
      var day = end;
      //console.log( day, icurrent, ppstartdate, pppm, pppd );
      while( begin <= day ) {
        if( day < ppstartdate ) {
          --icurrent;
          ppstartdate = a[icurrent][0].trim();
          pppm = Number( a[icurrent][1] );
          pppd = pppm * 12 / 365;
          //console.log( day, icurrent, ppstartdate, pppm, pppd );
        }
        day = util.get_day_before( day );
        pp += pppd;
        ++ndays;
      }
      //console.log( day, ndays, pppd, pp );
    }
    else {
      // calculate prepayment based on half months
      var nhalfmonths = 0;
      var icurrent = a.length - 1;
      var ppstartdate = a[icurrent][0].trim();
      var pppm = Number( a[icurrent][1] ); // expected prepayment amount per month
      var ppphm = 0.5 * pppm; // expected prepayment amount per half month
      var day = end;
      //console.log( day, icurrent, ppstartdate, pppm, ppphm );
      while( begin < day ) {
        if( day <= ppstartdate ) {
          --icurrent;
          ppstartdate = a[icurrent][0].trim();
          pppm = Number( a[icurrent][1] );
          ppphm = 0.5 * pppm;
          //console.log( day, icurrent, ppstartdate, pppm, ppphm );
        }
        day = util.get_day_half_month_earlier( day );
        pp += ppphm;
        ++nhalfmonths;
      }
      //console.log( day, nhalfmonths, ppphm, pp );
    }      
  }
  return pp;
}

// https://stackoverflow.com/questions/16449295/how-to-sum-the-values-of-a-javascript-object
//function sum_of_object_values( obj )
//{
//  var sum = 0;
//  for( var el in obj ) {
//    if( obj.hasOwnProperty( el ) ) {
//      sum += obj[el]; // parseFloat( obj[el] );
//    }
//  }
//  return sum;
//}

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
  addressee, year, energy_cost_str, // energy cost according to ista per year
  calculate_nk_prepayment_based_on_days )
{
  // Determine contract duration in given year span

  var days_in_year = util.days_in_year( year ); // 365 or 366
  var [begin, end] = util.get_duration_in_given_year( contract.begin, contract.end, year );
  //console.log( 'contract begin and end in year:', begin, end );
  var ndays = util.date_diff_days( begin, end );
  var fraction = ndays / days_in_year;

  //console.log('contract', contract._id, 'beg/end, days in year, contract days and duration',
  //  util.jtisodate(begin), util.jtisodate(end), days_in_year, ndays, fraction );

  const pnk = util.string_to_object_with_numbers( contract.payments_nk );
  var pnk_for_year = pnk[ year.toString() ];

  if( !pnk_for_year ) {
    pnk_for_year = get_prepayments_during(
      contract.nebenkosten_eur, begin, end,
      calculate_nk_prepayment_based_on_days );
  }
  
  const ec = util.string_to_object_with_numbers( energy_cost_str );
  const ec_for_year = ec[ year.toString() ];

  //console.log('contract', contract._id, 'year', year, 'energy cost', ec_for_year );

  var h_anteilig = get_hausgeld_umlagefaehig_anteilig( costs );
  var h_proportional = get_hausgeld_umlagefaehig_proportional( costs );
  var h = fraction * (h_anteilig / unit.apt_count + h_proportional * apartment.faktor_hauskosten_umlagefaehig);
  var smoke_detector_count = Object.keys( apartment.smokedetectors ).length;

  this.contract_id = contract._id;
  this.faktor_hauskosten_umlagefaehig = apartment.faktor_hauskosten_umlagefaehig;
  this.salutation = addressee.salutation;
  this.addressee = `${addressee.firstname} ${addressee.lastname}`;
  this.address = `${addressee.street} ${addressee.streetnr}, ${addressee.zip} ${addressee.city}`;
  this.nkvorauszahlung = util.round_to_two_digits( pnk_for_year );
  this.rueckbehalt = util.round_to_two_digits( contract.withholding_nk_eur );
  this.hausgeld_umlagefaehig = util.round_to_two_digits( h );
  this.grundsteuer = util.round_to_two_digits( apartment.landtax_eur * fraction );
  this.rauchmelderwartung = util.round_to_two_digits( smoke_detector_count * contract.smokedetector_maintenance_cost_eur * fraction );
  this.energycost = ec_for_year;
  this.nebenkosten = util.round_to_two_digits( this.energycost + this.hausgeld_umlagefaehig + this.grundsteuer + this.rauchmelderwartung );
  this.credit = util.round_to_two_digits( this.nkvorauszahlung + this.rueckbehalt - this.nebenkosten );
  const nmonths = util.date_diff_months( begin, end );
  const credit_rounded_up = (nmonths / (nmonths - 0.5)) * this.credit;
  const pnk_pm = pnk_for_year / nmonths;
  this.new_nkvorauszahlung_pm = util.round_to_two_digits( pnk_pm - credit_rounded_up / nmonths );
  this.old_rent_pm = util.round_to_two_digits( get_latest_contract_expected_payments( contract.rent_apartment_eur ) );
  this.old_rent_other_pm = util.round_to_two_digits( get_latest_contract_expected_payments( contract.rent_other_eur ) );
}

module.exports = Coal;
