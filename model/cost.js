// cost.js
//
// mongo data model definition for heizkosten yearly unit cost
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

var costSchema = new Schema({
  type: String,
  unit_id: mongoose.ObjectId,
  year: Number,
  
  // hausgeld_umlagefaehig_eur -- zahlen mieter
  
  allocatable: {
    kabelgebuehren: Number,
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
    wartung_lueftungsanlage: Number
  },

  hausgeld_eur: Number, // zahlen eigentuemer

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
  house_nk_coldwater_sonderkosten_eur: Number 
});

mongoose.model( 'Cost', costSchema );
