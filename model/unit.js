// unit.js
//
// mongo data model definition for a heizkosten housing unit
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

/*
id_objekt
  energieerfassung
    gesamt qm
    gesamt anzahl wohnungen
    gesamt energie joule kwh
    verbrauch brennstoff material euro oel gas
    verbrauch wasser
    kosten energieerfassung heizanlage verteilung
    kosten wartung heizanlage
    kosten strom heizanlage
    splitting kostenschlüssel aufteilung energiekosten zwischen qm der wohnung und einheiten am heizkörper, e.g. 50 / 50 siehe in punkt 6 "Aufteilung der Heizkosten". or 70 / 30, etc.
  andere rechnungen
    hausgeld
    nebenkosten

drei abrechnungstoepfe:
einmal im jahr die energiekostenverteilung berechnen
zweiter abrechnungskreislauf: nutzerbezogene nebenkosten:
  hausmeister, reningung, listwartung
  100% per haus und dann anteilig qm-maessig auf mieter verteilt
  in dem konto sind auch nk-vorauszahlungen drin
  diese daten kommen von der hausverwaltung
dritter kreislauf: hausverwaltung
  alle hauskosten: versicherung hausmeister hausverwalkter pruefgebuehren fuer lift energieeinkauf strassengebuehr kanalisationsgebuehr
  das muessen wir jetzt nicht koennen
  sollte aber einfach erweiterbar sein, fuer den fall das es keine hausverwaltung gibt

rechnung:
  objekt unit ObjectId
  datum
  summe
  konto (lift, hausmeister, satellitenanlage, ...) --> nebenkosten oder hauskosten NK / HK
  betreff
  beschreibung
  
die objektID braucht zwei listen in den anfallende kosten kontiert werden können:

Hausgeld: sind die konten, die nicht umlagefähig sind 
Nebenkostengeld: sind die konten die auf die mieter umlagefähig sind

felder des hausgelds sind:

  reparaturen
  anschaffungen
  verwalterkosten
  reparaturrücklage

felder der NK sind:

  hausmeisterkosten
  wartungsarbeiten
  versicherungen
  reinigungskosten
  grundsteuer

Wenn man sowieso die zahlungen auf verschiedene konten buchen muss,
dann kann man sie auch alle gleich in einer liste stellen, in der man
aus dem konto heraus feststellen kann, ob es sich um HG oder NK handelt.

*/

const enum_unit_accounts = [
  
  // hausgeld HG

  'reparaturen',
  'anschaffungen',
  'verwalterkosten',
  'reparaturruecklage',

  // nebenkostern NK

  'hausmeisterkosten',
  'wartungsarbeiten',
  'versicherungen',
  'reinigungskosten',
  'grundsteuer' ];


var unitSchema = new Schema({
  unit_id: String,
  area_m2: Number,
  apt_count: Number,
  energy_consumption_kwh: Number,
  fuel_consumption_eur: Number,
  water_consumption_l: Number,
  heating_consumption_allocation_cost_eur: Number,
  heating_maintenance_cost_eur: Number,
  heating_electrity_cost_eur: Number,
  splitting_factor: Number,
  hausgeld_eur: Number,
  nebenkosten_eur: Number,
  invoices: [{
    date: Date,
    amount: Number,
    account: { type: String, enum: enum_unit_accounts } }],
});

mongoose.model( 'Unit', unitSchema );
