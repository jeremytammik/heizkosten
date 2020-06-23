// cost.js
//
// mongo data model definition for yearly unit heating and running costs
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

var costSchema = new Schema({
  _id: String, // suppress automatic generation  
  
  unit_id: String, // unit
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

costSchema.methods.get_hausgeld_umlagefaehig_anteilig = function() {
  //var h = unit.costs[year.toString()].allocatable;
  //var total = sum_of_object_values( h );
  //var total_propertional = total - total_anteilig;
  //var total_anteilig = costs.kabelgebuehren;
  return this.kabelgebuehren;
};

costSchema.methods.get_hausgeld_umlagefaehig_proportional = function() {
  return this.allgemeinstrom
    + this.muellgebuehren_hausmeister
    + this.streu_und_putzmittel
    + this.aussenanlage_pflege
    + this.versicherungen
    + this.niederschlagswasser
    + this.trinkwasseruntersuchung
    + this.material_und_hilfsstoffe
    + this.reinigung
    + this.hausmeister_sozialabgaben
    + this.hausservice_fremdfirmen
    + this.lift_umlagefaehig
    + this.feuerloescher_wartung
    + this.wartung_eingangstueren
    + this.wartung_lueftungsanlage;
};

var Cost = mongoose.model( 'Cost', costSchema );

const { jtformgen_edit_document } = require('../form/jtformgen');

Cost.route = Cost.modelName.toLowerCase();
Cost.thing_en = 'yearly cost';
Cost.thing_de = 'Kosten';

Cost.get_edit_form_html = ( a, action, error ) => {
  var id = a['_id'];
  var url_action = 'view' === action ? '' : action + '_submit';
  url_action = `/${Cost.route}/${id}/${url_action}`;

  var verb = (action === 'dupl')
    ? `duplizieren, also neue ${Cost.thing_de} anlegen mit aehnlichen Daten`
    : (action === 'edit'
       ? `in ${a.year} fuer ${a.unit_id} edititieren`
       : 'anschauen');

  verb = Cost.thing_de + ' ' + verb;

  delete a['__v'];
  delete a['_id'];
  
  if( !(action === 'dupl') ) {
    delete a['unit_id'];
    delete a['year'];
  }
  return jtformgen_edit_document( a, url_action, verb, false, error );
}

module.exports = Cost;
