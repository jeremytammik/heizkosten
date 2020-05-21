// unit.js
//
// mongo data model definition for a housing unit
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

/*
id_objekt
  energieerfassung
    anschrift: location
    verwalter - manager
    gesamt qm
    gesamt anzahl wohnungen
    anteil qm am splitting kostenschlüssel aufteilung energiekosten zwischen qm der wohnung und einheiten am heizkörper, e.g., 0.3 means 70% cost is for measured consumption, 30% for square metres
    
    kosten -- cost:
    
    hausgeld (zahlt eigentuemer)
    hausgeld umlagefaehig (zahlt mieter)
    gesamtkosten heizung kaltwasser warmwasser HKW (5 posten):
      brennstoff - fuel:
        verbrauch brennstoff material: oel gas usw, kwh
        verbrauch brennstoff euro: kosten
      heiznebenkosten:
        kosten energie verbrauchserfassung zur verteilung
        kosten wartung heizanlage
        kosten strom heizanlage
        kosten kaminfeger
      heizzusatzkosten - kosten heizgeraete
      zusatzkosten warmwasser
      hausnebenkosten (eigentlich kaltwasseraufbereitung und entsorgung) (5 positionen):
        verbrauch kaltwasser + abwasser kubikmeter sowie euro
        kaltwasseraufbereitung, z.b. entkalkung
        kaltwassergeraete
        abrechnung hausnebenkosten
        sonderkosten nutzer

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
  //'verwalterkosten', // moved to ownership
  'reparaturruecklage',

  // nebenkosten NK

  'hausmeisterkosten',
  'wartungsarbeiten',
  'versicherungen',
  'reinigungskosten',
  //'grundsteuer' // not part of the unit, separate for each owner
];

var unitSchema = new Schema({
  _id: String, // suppress automatic generation  
  address: String,
  manager_id: String, // person_id, not mongoose.ObjectId,
  area_m2: Number,
  apt_count: Number,
  splitting_factor_m2: Number,
  
  costs: [mongoose.ObjectId],

  payments: [{
    date: Date,
    amount: Number,
    account: { type: String, enum: enum_unit_accounts } }]
  },
  { _id: false } // suppress automatic generation
);

unitSchema.methods.get_display_string = function() {
  return this._id + ' &ndash; ' + this.address.replace(';',',');
};

var Unit = mongoose.model( 'Unit', unitSchema );

Unit.route = Unit.modelName.toLowerCase();
Unit.thing_en = Unit.modelName.toLowerCase();
Unit.thing_de = 'Gebaeude';

module.exports = Unit;
