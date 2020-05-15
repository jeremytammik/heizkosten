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
  units: [String], // persons are restricted to units
  person_id: String,
  firstname: String,
  lastname: String,
  email: String,
  iban: String,
  telephone: String,
  salutation: String,
  street: String,
  streetnr: String,
  zip: String,
  city: String,
  country: String
});

function display_string_for_person_doc( p )
{
  return p.firstname + ' ' + p.lastname + ' ' + p.salutation + ' '
    + p.street + ' ' + p.streetnr + ' ' + p.zip + ' ' + p.city + ' ' + p.country;
}

personSchema.methods.get_display_string = () => {
  return display_string_for_person_doc( this );
}

var Person = mongoose.model( 'Person', personSchema );

module.exports = Person;
