// apartment.js
//
// mongo data model definition for an apartment
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

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
  nebenkosten_anteil_schluessel is more or less the total unit living area divided by the apartment area m2
  
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
*/

var apartmentSchema = new Schema({
  _id: String, // suppress automatic generation
  unit_id: String, // unit
  owner_id: String, // person
  grundbuchnr: String,
  area_m2: Number,
  room_count: Number,
  smokedetectors: { type: Map, of: String }, // dictionary mapping meter_id to expires Date
  coldwatermeters: { type: Map, of: String }, // map meter_id to expires Date
  warmwatermeters: { type: Map, of: String }, // map meter_id to expires Date
  heatcostallocators: { type: Map, of: [String,Number] }, // map meter_id to [expires: Date, factor: Number]
  management_cost_eur: Number,
  heating_electrity_cost_eur: Number,
  landtax_eur: Number,
  nebenkosten_anteil_schluessel: Number },
  
  { _id: false } // suppress automatic generation
);

apartmentSchema.methods.get_display_string = function() {
  return `${this._id} &ndash; ${this.room_count} rooms with ${this.area_m2} m2`;
};

var Apartment = mongoose.model( 'apartment', apartmentSchema );

Apartment.route = 'apt';
Apartment.thing_en = Apartment.modelName.toLowerCase();
Apartment.thing_de = Apartment.modelName;

module.exports = Apartment;
