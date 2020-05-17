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
  _id: {  // suppress automatic generation  
    type: String,
    unique: true,
    min: 1,
    max: 20,
    validate: {
      validator: function(s) {
        return /[0-9a-z_]{1,20}/.test(s);
      },
      message: props => `'${props.value}' is not a valid person_id`
    }},
  units: { // persons are restricted to units
    type: String,
    min: 3,
    max: 40,
    validate: {
      validator: function(s) {
        return /[0-9,]{3,40}/.test(s);
      },
      message: props => `'${props.value}' is not a valid list of unit ids`
    }},
  firstname: String,
  lastname:  {
    type: String,
    validate: {
      validator: function(s) {
        return /^[a-zA-Z0-9][a-zA-Z0-9_- ]*$/.test(s);
      },
      message: props => `'${props.value}' is not a valid last name`
    }},
  email: {
    type: String,
    validate: {
      validator: function(s) {
        return 0 == s.length
          || /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(s);
      },
      message: props => `'${props.value}' is not a valid email address`
    }},
  iban: {
    type: String,
    validate: {
      validator: function(s) {
        return 0 == s.length
          || /^([a-zA-Z]{2})(\d{2})([a-zA-Z\d ]+)$/.test(s);
      },
      message: props => `'${props.value}' is not a valid IBAN`
    }},
  telephone: {
    type: String,
    validate: {
      validator: function(s) {
        return 0 == s.length
          || /^([0-9\+\/\- ]{2,20}$/.test(s);
      },
      message: props => `'${props.value}' is not a valid telephone number`
    }},
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

var Person = mongoose.model( 'Person', personSchema );

// form generator

const { jtformgen_edit_for_strings } = require('../form/jtformgen.js');

Person.get_edit_form_html = ( p, create_duplicate, error ) => {
  var id = p['_id'];
  delete p['__v'];
  
  if( !create_duplicate ) {
    delete p['_id'];
    delete p['units'];
  }
  
  var url_action = create_duplicate ? 'dupl' : 'edit';
  var verb = create_duplicate
    ? 'duplizieren, also neue Person anlegen mit aehnlichen Daten'
    : 'edititieren';

  return jtformgen_edit_for_strings( p, id, url_action, verb, error );
}

module.exports = Person;
