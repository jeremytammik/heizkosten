// consumption.js
//
// mongo data model definition for consumption data inclunding meter readings 
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

/*
id_energieverbrauchserfassung anlesedaten
  verbrauchswerte von hkv heizkostenverteiler nummer
    anzahl einheiten
  wasseruhren kalt (koennen mehrere sein)
  wasseruhren warm (koennen mehrere sein)
  rauchmelder (anzahl der wechsel oder wartungen)
  eingabemaske fuer saemtlich abgelesenen werte
*/

var consumptionSchema = new Schema({
  heatcostallocatorreadings: [{ number:String, date:Date, amount:Number }],
  coldwatermeters: [{ number:String, date:Date, amount:Number }],
  hotwatermeters: [{ number:String, date:Date, amount:Number }],
  smokedetector_maintenance_count: Number,
});

mongoose.model( 'consumption', consumptionSchema );
