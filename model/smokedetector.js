// smokedetector.js
//
// mongo data model definition for a heizkosten smokedetector
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

/*
  rauchmelder (ablaufdatum)
*/

var smokedetectorSchema = new Schema({
  apartment_id: ObjectId,
  expires: Date
});

mongoose.model( 'smokedetector', smokedetectorSchema );
