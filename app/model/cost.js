// cost.js
//
// mongo data model definition for yearly unit heating and running costs
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

var costSchema = new Schema({
  _id: String, // suppress automatic generation  
  
  unit_id: String,
  year: Number,
  
  // hausgeld nicht umlagefaehig, zahlen eigentuemer
  
  hausgeld_eur: Number, 

  // hausgeld umlagefaehig, zahlen mieter
  
  kabelgebuehren: Number, // pro wohnung
  
  // pro quadratmeter mit nebenkosten_anteil_schluessel
  
  allgemeinstrom: Number,
  muellgebuehren_hausmeister: Number,
  streu_und_putzmittel: Number,
  aussenanlage_pflege: Number,
  versicherungen: Number,
  niederschlagswasser: Number,
  trinkwasseruntersuchung: Number,
  material_und_hilfsstoffe: Number,
  reinigung: Number,
  hausmeister_sozialabgaben: Number,
  hausservice_fremdfirmen: Number,
  lift_umlagefaehig: Number,
  feuerloescher_wartung: Number,
  wartung_eingangstueren: Number,
  wartung_lueftungsanlage: Number,

  // gesamtkosten heizung kaltwasser warmwasser HKW (5 items):
  
  // 1. brennstoff - fuel

  fuel_consumption_kwh: Number,
  fuel_consumption_eur: Number,

  // 2. heiznebenkosten

  heating_nk_consumption_allocation_eur: Number,
  heating_nk_maintenance_eur: Number,
  heating_nk_electrity_eur: Number,
  heating_nk_chimneysweep_eur: Number,

  // 3. heizzusatzkosten - kosten heizgeraete

  heating_zk_heizgeraete_eur: Number,
  
  // 4. zusatzkosten warmwasser

  hotwater_zk_eur: Number,

  // 5. hausnebenkosten (kaltwasseraufbereitung und entsorgung) enthaelt u.a. (5 positionen):

  house_nk_coldwater_m3: Number,
  house_nk_coldwater_eur: Number,
  house_nk_coldwater_equipment_eur: Number,
  house_nk_coldwater_allocation_fee_eur: Number,
  house_nk_coldwater_sonderkosten_eur: Number },
  
  { _id: false } // suppress automatic generation
);

costSchema.methods.get_display_string = function() {
  return this._id + ' &ndash; ' +
    `yearly costs in ${this.year} for ${this.unit_id}`;
};

var Cost = mongoose.model( 'Cost', costSchema );

const { jtformgen_edit_document } = require('../form/jtformgen.js');

Cost.get_edit_form_html = ( a, thing_display, create_duplicate, error ) => {
  var id = a['_id'];
  delete a['__v'];
  
  if( !create_duplicate ) {
    delete a['_id'];
    delete a['unit_id'];
    delete a['year'];
  }
  
  var url_action = create_duplicate ? 'dupl' : 'edit';
  var verb = create_duplicate
    ? `duplizieren, also neue ${thing_display} anlegen mit aehnlichen Daten`
    : `in ${a.year} fuer ${a.unit_id} edititieren`;
  verb = thing_display + ' ' + verb;

  return jtformgen_edit_document( a, id, url_action, verb, false, error );
}

module.exports = Cost;
