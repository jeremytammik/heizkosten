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
  liste einzahlungen wohnungskaltmiete euro
  liste einzahlungen nebenkostenvorauszahlungen euro
  liste einzahlungen kaution euro
  liste einzahlungen miete fuer nebenraeume und anderes euro 
*/

const enum_occupant_accounts = [
  'apartment_rental',
  'other_rental',
  'nebenkosten',
  'deposit' ];

var occupantSchema = new Schema({
  occupant_id: String,
  person1_id: ObjectId,
  person2_id: ObjectId,
  payments: [{
    date: Date,
    amount: Number,
    account: { type: String, enum: enum_occupant_accounts } }],
});

mongoose.model( 'occupant', occupantSchema );
