// apartment.js
//
// mongo data model definition for an apartment
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

const jtregex = require( '../../data/jtregex' );
const jtvalidators = require( '../../data/jtvalidators' );

/*
id_wohnung
  energieerfassung
    eigentuemer
    qm
    anzahl zimmer
    rauchmelder (ablaufdatum) -- smokedetector
    wasseruhren (nummer, ablaufdatum) -- watermeter
    heizkostenverteiler (nummer, ablaufdatum, faktor) -- heatcostallocator
  andere rechnungen
    verwaltergebuehr
    grundsteuer
  zimmerkuerzel: BA bad, FL flur, KU kueche, SK, SM, SG schlaf klein, mittel und gross
  faktor_hauskosten_umlagefaehig is more or less the total unit living area divided by the apartment area m2
  
  there are 16 storeys numbered 00-15 with 6 apartments on each storey --> 96
  01 + 02 are 2-room ones
  03 is 3 rooms small
  04 is 4 rooms
  05 + 06 are 3 rooms large
  
  erste ziffer: unit: 001
  zweite ziffer: etage: 00: EG bis 15. etage
  dritte ziffer: whg: 01-06
  vierte ziffer: vertragszusatz: 00 is owner; 01-09 mieter
  
  whg 01 & 02: 76 qm
  whg 03: 87 qm
  whg 04: 107 qm
  whg 05 & 06: 89 qm
  
  the rooms are coded as:
  
  BA bad
  FL flur
  KU kueche
  SK schlaf klein
  SM schlaf mittel
  SG schlaf gross
  WO wohnen

  the heat cost allocation and water meters are coded as:
  
  RA rauch
  HE heizung
  KW kaltwasser
  WW warmwasser
  
  smoke detector, water meter and heat cost allocator data:
  
  _f: heat cost allocator factor
  _x: date_expiry
  <date>: meter reading
  
*/

var apartmentSchema = new Schema({
  _id: { // suppress automatic generation  
    type: String,
    min: 9,
    max: 9,
    validate: {
      validator: function(s) {
        return jtregex.valid_apartment_id.test(s);
      },
      message: props => `'${props.value}' is not a valid apartment_id`
    }
  },
  unit_id: {
    type: String,
    min: 3,
    max: 3,
    validate: {
      validator: function(s) {
        return jtregex.valid_unit_id.test(s);
      },
      message: props => `'${props.value}' is not a valid unit_id`
    }
  },
  owner_id: { // person
    type: String,
    min: 1,
    max: 20,
    validate: {
      validator: function(s) {
        return (!s) || jtregex.valid_person_id.test(s);
      },
      message: props => `'${props.value}' is not a valid person_id`
    }
  },
  grundbuchnr: String,
  area_m2: Number,
  room_count: Number,
  smokedetectors: { // dictionary mapping meter_id to expires Date
    type: Object,
    validate: {
      validator: function(d) {
        for (const [k,v] of Object.entries(d)) {
          //console.log( k, jtregex.valid_meter_id.test(k), v, jtregex.valid_date.test(v) );
          if(!(k.substr(0,2) === 'RA')) { return false; }
          if(!jtregex.valid_meter_id.test(k)) { return false; }
          if(!jtregex.valid_date.test(v)) { return false; }
        }
        return true;
      },
      message: 'invalid smoke detector id or expiry date'
    }
  },
  coldwatermeters: { // map meter_id to expires Date
    type: Object,
    validate: {
      validator: function(d) {
        for (const [k,v] of Object.entries(d)) {
          if(!(k.substr(0,2) === 'KW')) { return false; }
          if(!jtregex.valid_meter_id.test(k)) { return false; }
          if(!jtvalidators.validate_meter_data( v, false )) { return false; }
        }
        return true;
      },
      message: 'invalid cold water meter id or expiry date, readings'
    }
  },
  hotwatermeters: { // map meter_id to expires Date
    type: Object,
    validate: {
      validator: function(d) {
        for (const [k,v] of Object.entries(d)) {
          if(!(k.substr(0,2) === 'WW')) { return false; }
          if(!jtregex.valid_meter_id.test(k)) { return false; }
          if(!jtvalidators.validate_meter_data( v, false )) { return false; }
        }
        return true;
      },
      message: 'invalid hot water meter id or expiry date, readings'
    }
  },
  heatcostallocators: { // map meter_id to "expiry_date, factor"
    type: Object,
    validate: {
      validator: function(d) {
        //console.log('d:', Object.entries(d));
        for (const [k,v] of Object.entries(d)) {
          if( !(k.substr(0,2) === 'HE')) { return false; }
          if(!jtregex.valid_meter_id.test(k)) { return false; }
          if(!jtvalidators.validate_meter_data( v, true )) { return false; }
        }
        return true;
      },
      message: 'invalid heating cost meter id or expiry date, factor, readings'
    }
  },
  management_cost_eur: Number,
  heating_electrity_cost_eur: Number,
  landtax_eur: Number,
  faktor_hauskosten_umlagefaehig: Number },
  { _id: false } // suppress automatic generation
);

apartmentSchema.methods.get_display_string = function() {
  return `${this._id} &ndash; ${this.room_count} rooms with ${this.area_m2} m2`;
};

var Apartment = mongoose.model( 'Apartment', apartmentSchema );

Apartment.route = 'apt';
Apartment.thing_en = Apartment.modelName.toLowerCase();
Apartment.thing_de = Apartment.modelName;
Apartment.meter_types = {
  "RA": "rauch",
  "HE": "heizung",
  "KW": "kaltwasser",
  "WW": "warmwasser",
};
Apartment.room_codes = {
  "BA": "bad",
  "FL": "flur",
  "KU": "kueche",
  "SK": "schlaf_klein",
  "SM": "schlaf_mittel",
  "SG": "schlaf_gross",
  "WO": "wohnen"
};

const { jtformgen_edit_document } = require('../form/jtformgen');

// Turn the given map<String, String> into separate dictionary
// entries d[] = mapto an Object so it can be converted to JSON
//function unwrap_map_into_d( d, mapname, keyname, valname)
//{
//  var map = d[mapname];
//  var i = 0;
//  map.forEach( function( val, key ) {
//    var e = mapname + ' ' + (++i).toString() + ' ';
//    d[e + keyname] = key;
//    d[e + valname] = val;
//  });
//  delete d[mapname];
//}

Apartment.get_edit_form_html = ( d, action, error ) => {
  var id = d['_id'];
  var url_action = 'view' === action ? '' : action + '_submit';
  url_action = `/${Apartment.route}/${id}/${url_action}`;
  
  var verb = (action === 'dupl')
    ? `duplizieren, also neue ${Apartment.thing_de} anlegen mit aehnlichen Daten`
    : (action === 'edit' ? 'edititieren' : 'anschauen');
    
  verb = Apartment.thing_de + ' ' + id + ' ' + verb;

  delete d['__v'];
  
  if( !(action === 'dupl') ) {
    delete d['_id'];
    delete d['unit_id'];
  }
  
  //unwrap_map_into_d( d, 'smokedetectors', 'nr', 'expiry' );
  //unwrap_map_into_d( d, 'coldwatermeters', 'nr', 'expiry' );
  //unwrap_map_into_d( d, 'hotwatermeters', 'nr', 'expiry' );
  //unwrap_map_into_d( d, 'heatcostallocators', 'nr', 'expiry' );

  return jtformgen_edit_document( d, url_action, verb, true, error );
}

module.exports = Apartment;
