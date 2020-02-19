// occupant.js
//
// mongo data model definition for a heizkosten occupant
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

/*
id_nutzer occupant (tenant or owner)
  2 x name
  2 x vorname
  2 x geburtsdatum
  verbindliche email
  verbindliche iban
  telefon
  liste einzahlungen kaltmiete euro
  liste einzahlungen nebenkosten euro
  liste einzahlungen kaution euro
  liste einzahlungen miete fuer nebenraeume euro 
*/

var occupantSchema = new Schema({
  occupant_id: String,
  firstname: String,
  lastname: String,
  birthdate: Date,
  firstname2: String,
  lastname2: String,
  birthdate2: Date,
  email: String,
  iban: String,
  telephone: String,
  rent_payments: [{ date:Date, amount:Number }],
  nebenkosten_payments: [{ date:Date, amount:Number }],
  deposit_payments: [{ date:Date, amount:Number }],
  secondaryspace_payments: [{ date:Date, amount:Number }]
});

mongoose.model( 'occupant', occupantSchema );
