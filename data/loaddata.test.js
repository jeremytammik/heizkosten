'use strict';

const jtregex = require( './jtregex' );
const jtvalidators = require( './jtvalidators' );
const loaddata = require('./loaddata');

//test('JSON parse date reviver', () => {
//  const text = '{ "date": "2016-04-26" }';
//  const obj = JSON.parse(text, loaddata.json_parse_date_reviver);
//  expect(obj.date.getFullYear()).toBe(2016);
//  expect(obj.date.getMonth()).toBe(3);
//  expect(obj.date.getDate()).toBe(26);
//});

test('all data characters are ascii or umlaut', () => {
  for (const [key, value] of Object.entries(loaddata)) {
    for (const [key2, value2] of Object.entries(value)) {
      for (const [key3, value3] of Object.entries(value2)) {
        expect(key3).toMatch( jtregex.non_empty_alpha_mumeric );
        if (typeof value3 === 'string' || value3 instanceof String) {
          expect(value3).toMatch( jtregex.empty_or_ascii_or_umlaut );
        }
      }
    }
  }
});

test('unit id matches dictionary key', () => {
  for (const [key, value] of Object.entries(loaddata.units)) {
    expect(value._id).toBe( key );
  }
});

test('unit has a valid manager', () => {
  var person_ids = Object.keys(loaddata.persons);
  for (const [key, value] of Object.entries(loaddata.units)) {
    expect( person_ids ).toContain( value.manager_id );
  }
});

test('cost id matches dictionary key', () => {
  for (const [key, value] of Object.entries(loaddata.costs)) {
    expect(value._id).toBe( key );
  }
});

test('cost has valid unit and year matching dictionary key', () => {
  var unit_ids = Object.keys(loaddata.units);
  for (const [key, value] of Object.entries(loaddata.costs)) {
    expect( unit_ids ).toContain( value.unit_id );
    expect( value._id ).toBe( value.unit_id + '-' + value.year );
  }
});

test('loaded N persons', () => {
  expect( Object.keys( loaddata.persons ).length ).toBe( 119 );
});

test('person id matches dictionary key', () => {
  for (const [key, value] of Object.entries(loaddata.persons)) {
    expect(value._id).toBe( key );
    expect(value._id).toMatch( jtregex.valid_person_id );
    expect(value.units).toMatch( jtregex.valid_unit_list );
    if(value.firstname) { expect(value.firstname).toMatch( jtregex.valid_name_chars ); }
    expect(value.lastname).toMatch( jtregex.valid_name_chars );
    if(value.email) { expect(value.email).toMatch( jtregex.valid_email_address ); }
    if(value.iban) { expect(value.iban).toMatch( jtregex.valid_iban ); }
    if(value.telephone) { expect(value.telephone).toMatch( jtregex.valid_telephone_numbers ); }
    //expect(value.salutation).toMatch( );
    //expect(value.street).toMatch( );
    //expect(value.streetnr).toMatch( );
    //expect(value.zip).toMatch( );
    //expect(value.city).toMatch( );
    expect(value.country).toMatch( jtregex.valid_name_chars );
  }
});

test('tenant data fulfils person regex requirements', () => {
  if( loaddata.tenants ) {
    for (const [key, value] of Object.entries(loaddata.tenants)) {
      expect(value._id).toBe( key );
      expect(value._id).toMatch( jtregex.valid_person_id );
      //expect(value.units).toMatch( valid_unit_list );
      if(value.firstname) { expect(value.firstname).toMatch( jtregex.valid_name_chars ); }
      expect(value.lastname).toMatch( jtregex.valid_name_chars );
      if(value.email) { expect(value.email).toMatch( jtregex.valid_email_address ); }
      if(value.iban) { expect(value.iban).toMatch( jtregex.valid_iban ); }
      if(value.telephone) { expect(value.telephone).toMatch( jtregex.valid_telephone_numbers ); }
      //expect(value.salutation).toMatch( );
      //expect(value.street).toMatch( );
      //expect(value.streetnr).toMatch( );
      //expect(value.zip).toMatch( );
      //expect(value.city).toMatch( );
      if(value.country) { expect(value.country).toMatch( jtregex.valid_name_chars ); }
    }
  }
});

test('person is linked to valid units', () => {
  var unit_ids = Object.keys(loaddata.units);
  for (const [key, value] of Object.entries(loaddata.persons)) {
    value.units.split(',').forEach( (uid) => {
      expect(unit_ids).toContain( uid );
    });
  }
});

test('loaded N apartments', () => {
  expect(Object.keys(loaddata.apartments).length).toBe(96);
});

test('apartment id matches dictionary key', () => {
  for (const [key, value] of Object.entries(loaddata.apartments)) {
    expect(value._id).toBe( key );
  }
});

test('apartment has valid owner', () => {
  var person_ids = Object.keys(loaddata.persons);
  for (const [key, value] of Object.entries(loaddata.apartments)) {
    var s = value.owner_id;
    if( s && !('unknown_owner_id'===s) ) { 
      expect(person_ids).toContain( value.owner_id );
    }
  }
});

const apartment_meter_types = {
  "RA": "rauch",
  "HE": "heizung",
  "KW": "kaltwasser",
  "WW": "warmwasser",
};

const apartment_room_codes = {
  "KU": "kueche",
  "BA": "bad",
  "FL": "flur",
  "SK": "schlaf_klein",
  "SM": "schlaf_mittel",
  "SG": "schlaf_gross",
  "WO": "wohn"
};

test('all apartment meter ids have valid meter type, room prefix and number', () => {
  function test_meter_id( typ, id ) {
    expect(id.substr(0,3)).toBe( typ + '-' );
    expect(room_codes).toContain( id.slice(3,5) );
    expect(id[5]).toBe( '-' );
    expect(id.substr(6)).toMatch( jtregex.valid_meter_nr );
  }
  var meter_types = Object.keys( apartment_meter_types );
  var room_codes = Object.keys( apartment_room_codes );
  for (const [key, value] of Object.entries(loaddata.apartments)) {
    for (const [key2, value2] of Object.entries(value.smokedetectors)) {
      test_meter_id( 'RA', key2 );
    }
    for (const [key2, value2] of Object.entries(value.coldwatermeters)) {
      test_meter_id( 'KW', key2 );
    }
    for (const [key2, value2] of Object.entries(value.hotwatermeters)) {
      test_meter_id( 'WW', key2 );
    }
    for (const [key2, value2] of Object.entries(value.heatcostallocators)) {
      test_meter_id( 'HE', key2);
    }
  }
});

// this does not work until all contracts have been defined
var contracts_defined = false;
if( contracts_defined ) {
test('apartment has valid active contract', () => {
  var map_apt_to_contract = {};
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    // check that contract is currently active:
    var test_date_time = new Date("2018-07-14").getTime();
    //console.log(value.begin, typeof value.begin);
    if(value.begin.getTime() <= test_date_time
       && ((null == value.end)
           || (test_date_time <= value.end.getTime()))) {
      var apt = value.apartment_id;
      if(!(apt in map_apt_to_contract)) {
        map_apt_to_contract[apt] = [];
      }
      map_apt_to_contract[apt].push(value);
    }
  }
  var apt_with_valid_contract_keys = Object.keys(map_apt_to_contract);
  //var apartment_ids = Object.keys(loaddata.apartments);
  //apartment_ids.forEach( (a) => { expect(map_keys).toContain( a ); } );
  for (const [key, value] of Object.entries(loaddata.apartments)) {
    if( value.owner_id ) { expect(map_keys).toContain( value._id ); }
  }
});
}

test('contract id valid and matches dictionary key, unit and apartment ids', () => {
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    expect(key).toMatch( jtregex.valid_contract_id );
    expect(value._id).toBe( key );
    expect(key.substring(0,3)).toEqual( value.unit_id );
    expect(key.substring(0,9)).toEqual( value.apartment_id );
  }
});

test('contract referenced unit and apartment match contract id', () => {
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    expect(key).toMatch( jtregex.valid_contract_id );
    expect(value._id).toBe( key );
  }
});

test('contract begin and end are dates', () => {
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    //expect( value.begin.constructor.name ).toBe( 'Date' );
    //if( value.end ) { expect( value.end.constructor.name ).toBe( 'Date' ); }
    expect( value.begin ).toMatch( jtregex.date_format );
    if( value.end ) { expect( value.begin ).toMatch( jtregex.date_format ); }
  }
});

test('contract has valid apartment, occupants, begin date, and later end', () => {
  var apartment_ids = Object.keys(loaddata.apartments);
  var person_ids = Object.keys(loaddata.persons);
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    expect(apartment_ids).toContain( value.apartment_id );
    value.occupant_ids.forEach( (p) => { expect(person_ids).toContain( p ); } );
    //expect(value.begin).toBeInstanceOf(Date);
    //var end_is_null_or_later_than_begin = ("" === value.end)
    //  ? true
    //  : (value.begin.getTime() < value.end.getTime());
    //expect(end_is_null_or_later_than_begin).toBeTruthy();
    if( value.end ) {
      expect( value.begin.localeCompare( value.end ) < 0 )
        .toBeTruthy(); }
  }
});

test('contract expected payments have valid dictionary structure: list of pairs of begin_date:amount', () => {
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    //console.log(value);
    var a = jtvalidators.validate_dict_date_amount_string(value.rent_apartment_eur);
    var b = value.rent_other_eur ? jtvalidators.validate_dict_date_amount_string(value.rent_other_eur) : true;
    var c = jtvalidators.validate_dict_date_amount_string(value.nebenkosten_eur);
    //console.log(a, b, c);
    expect(a).toBe(true);
    expect(b).toBe(true);
    expect(c).toBe(true);
  }
});

/*
before moving all meter readings from contract.json to apt.json:

test('all contract meter numbers match its apartment ones', () => {
  var meterdata = {};
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    if( '001-09-02-01' === key ) { continue; }
    meterdata[value.apartment_id] = {};
    var apt = loaddata.apartments[value.apartment_id];
    var a = Object.keys(apt.coldwatermeters);
    var b = Object.keys(value.coldwatermeters);
    expect(0===b.length || (a.length === b.length && a.every(function(value, index) { return value === b[index]}))).toBeTruthy();
    
    var d = {};
    for (const [key2, value2] of Object.entries(apt.coldwatermeters)) {
      d[key2] = value2 + ', ' + value.coldwatermeters[key2];
    }
    meterdata[value.apartment_id].coldwatermeters = d;

    var a = Object.keys(apt.hotwatermeters);
    var b = Object.keys(value.hotwatermeters);
    expect(0===b.length || (a.length === b.length && a.every(function(value, index) { return value === b[index]}))).toBeTruthy();
    
    d = {};
    for (const [key2, value2] of Object.entries(apt.hotwatermeters)) {
      d[key2] = value2 + ', ' + value.hotwatermeters[key2];
    }
    meterdata[value.apartment_id].hotwatermeters = d;

    var a = Object.keys(apt.heatcostallocators);
    var b = Object.keys(value.heatcostallocators);
    expect(0===b.length || (a.length === b.length && a.every(function(value, index) { return value === b[index]}))).toBeTruthy();
    
    d = {};
    for (const [key2, value2] of Object.entries(apt.heatcostallocators)) {
      d[key2] = value2 + ', ' + value.heatcostallocators[key2];
    }
    meterdata[value.apartment_id].heatcostallocators = d;
  }
  var fs = require('fs');
  fs.writeFileSync( 'meterdata.json', JSON.stringify( meterdata, null, 2 ) );
});
*/

/*
test('all payments in each contract match expected account enum values', () => {
  const enum_contract_accounts = [
    'apartment_rental',
    'other_rental',
    'nebenkosten'
    //'deposit',
    //'nkrueckbehalt'
  ];
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    value.payments.forEach( (p) => expect(enum_contract_accounts).toContain(p.account));
  }
});

function get_rent_dict_val(d)
{
  for (const [key, value] of Object.entries(d)) {
    return value;
  }
}

test('calculate payment total in 2018 for each contract and account', () => {
  for (const [key, value] of Object.entries(loaddata.contracts)) {
    var rentpm = get_rent_dict_val(value.rent_apartment_eur);
    var renta = get_rent_dict_val(value.rent_apartment_eur) * value.payment_rent_apartment_count;
    var rento = get_rent_dict_val(value.rent_other_eur) * value.payment_rent_other_count;
    var nk = get_rent_dict_val(value.nebenkosten_eur) * value.payment_nk_count;
    console.log( `\
    ${rentpm}\n\
    "payments_rent_apartment": { 2018: ${renta} },\n\
    "payments_rent_other": { 2018: ${rento} },\n\
    "payments_nk": { 2018: ${nk} },\n\
` );
  }
});
*/

/*
test('VCF import', () => {
  loaddata.visiting_cards.forEach( (v) => {
    var d = v.data;
    var n = d.n.valueOf().replace(';', ' ').trim();
    expect( n ).toMatch( valid_name_chars );
  });
});
*/
