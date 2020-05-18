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

const {
  regex_valid_name_chars,
  regex_valid_email_address,
  regex_valid_iban,
  regex_valid_telephone_number
} = require( '../../data/jtregex' );

var personSchema = new Schema({
  _id: {  // suppress automatic generation  
    type: String,
    //unique: true, // cf. https://github.com/Automattic/mongoose/issues/8462
    min: 1,
    max: 20,
    validate: {
      validator: function(s) {
        return /[0-9a-z_]{1,20}/.test(s); // non-empty lowercase alphanumeric with underscore max 20 length
      },
      message: props => `'${props.value}' is not a valid person_id`
    }},
  units: { // persons are restricted to units
    type: String,
    min: 3,
    max: 40,
    validate: {
      validator: function(s) {
        return /[0-9,]{3,40}/.test(s); // comma-separated digits only, min 3 max 40 length
      },
      message: props => `'${props.value}' is not a valid list of unit ids`
    }},
  firstname:  {
    type: String,
    validate: {
      validator: function(s) { return regex_valid_name_chars.test(s); },
      message: props => `invalid characters in '${props.value}'`
    }},
  lastname:  {
    type: String,
    validate: {
      validator: function(s) { return regex_valid_name_chars.test(s); },
      message: props => `invalid characters in '${props.value}'`
    }},
  email: {
    type: String,
    validate: {
      validator: function(s) { return (!s) || regex_valid_email_address.test(s); },
      message: props => `'${props.value}' is not a valid email address`
    }},
  iban: {
    type: String,
    validate: {
      validator: function(s) { return (!s) || regex_valid_iban.test(s); },
      message: props => `'${props.value}' is not a valid IBAN`
    }},
  telephone: {
    type: String,
    validate: {
      validator: function(s) { return (!s) || regex_valid_telephone_number.test(s); },
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
