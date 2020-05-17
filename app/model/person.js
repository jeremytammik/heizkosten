// person.js
//
// mongo data model definition for a person, human or legal
//
// Copyright 2020 by Jeremy Tammik.

const { jt_form_generator_for_strings } = require('../form/jtformgen.js');

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

//const enum_person_role_not_used = [
//  'occupant',
//  'owner' ];

var personSchema = new Schema({
  _id: String, // suppress automatic generation  
  units: [String], // persons are restricted to units
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
  country: String },
  { _id: false } // suppress automatic generation
);

function display_string_for_person_doc( p )
{
  return p.firstname + ' ' + p.lastname + ' ' + p.salutation + ' '
    + p.street + ' ' + p.streetnr + ' ' + p.zip + ' ' + p.city + ' ' + p.country;
}

personSchema.methods.get_display_string = function() {
  return display_string_for_person_doc( this );
};

//personSchema.methods.get_edit_form_html = function() {
//  return generate_person_edit_form_html( this, false );
//};
//
//personSchema.methods.get_dupl_form_html = function() {
//  return generate_person_edit_form_html( this, true );
//};

var Person = mongoose.model( 'Person', personSchema );

Person.get_edit_form_html = ( p, create_duplicate ) => {
  var id = p['_id'];
  delete p['__v'];
  
  if(create_duplicate) {
    p['_id'] = '';
  }
  else {
    delete p['_id'];
    delete p['units'];
  }
  
  var url_action = create_duplicate ? 'dupl' : 'edit';
  var verb = create_duplicate
    ? 'duplizieren, also neue Person anlegen mit aehnlichen Daten'
    : 'edititieren';

  return jt_form_generator_for_strings( p, id, url_action, verb );
}

module.exports = Person;
