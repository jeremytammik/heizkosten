// person.js
//
// mongo data model definition for a person, human or legal
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

//const enum_person_role_not_used = [
//  'occupant',
//  'owner' ];

var personSchema = new Schema({
  person_id: String,
  firstname: String,
  lastname: String,
  email: String,
  iban: String,
  telephone: String,
  anrede: String,
  street: String,
  streetnr: String,
  zip: String,
  city: String,
  country: String
});

mongoose.model( 'person', personSchema );
