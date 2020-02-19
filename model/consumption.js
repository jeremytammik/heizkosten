// consumption.js
//
// mongo data model definition for a heizkosten consumption
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

/*
id_energieverbrauchserfassung
  verbrauchswerte von hkv heizkostenverteiler nummer
    anzahl einheiten
  wasseruhren kalt (koennen mehrere sein)
  wasseruhren warm (koennen mehrere sein)
  rauchmelder (anzahl der wechsel oder wartungen)
  eingabemaske fuer saemtlich abgelesenen werte
*/

var consumptionSchema = new Schema({
  rent_payments: [{ date:Date, amount:Number }],
  nebenkosten_payments: [{ date:Date, amount:Number }],
  deposit_payments: [{ date:Date, amount:Number }],
  secondaryspace_payments: [{ date:Date, amount:Number }]
});

mongoose.model( 'consumption', consumptionSchema );
