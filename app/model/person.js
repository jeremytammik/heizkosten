// person.js
//
// mongo data model definition for a person, human or legal
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

const jtregex = require( '../../data/jtregex' );

//const enum_person_role_not_used = [
//  'occupant',
//  'owner' ];

var personSchema = new Schema({
  _id: {  // suppress automatic generation
    type: String,
    //unique: true, // cf. https://github.com/Automattic/mongoose/issues/8462
    min: 1,
    max: 20,
    validate: {
      validator: function(s) {
        return jtregex.valid_person_id.test(s);
      },
      message: props => `'${props.value}' is not a valid person_id`
    }},
  units: { // persons are restricted to units
    type: String,
    min: 3,
    max: 40,
    validate: {
      validator: function(s) {
        return jtregex.valid_unit_list.test(s);
      },
      message: props => `'${props.value}' is not a valid list of unit ids`
    }},
  firstname:  {
    type: String,
    validate: {
      validator: function(s) { return (!s) || jtregex.valid_name_chars.test(s); },
      message: props => `invalid characters in '${props.value}'`
    }},
  lastname:  {
    type: String,
    validate: {
      validator: function(s) { return jtregex.valid_name_chars.test(s); },
      message: props => `invalid characters in '${props.value}'`
    }},
  email: {
    type: String,
    validate: {
      validator: function(s) { return (!s) || jtregex.valid_email_address.test(s); },
      message: props => `'${props.value}' is not a valid email address`
    }},
  iban: {
    type: String,
    validate: {
      validator: function(s) { return (!s) || jtregex.valid_iban.test(s); },
      message: props => `'${props.value}' is not a valid IBAN`
    }},
  telephone: {
    type: String,
    validate: {
      validator: function(s) { return (!s) || jtregex.valid_telephone_numbers.test(s); },
      message: props => `'${props.value}' is not a valid telephone number`
    }},
  salutation: String,
  street: String,
  streetnr: String,
  zip: String,
  city: String,
  country: String,
  altaddr: String },
  { _id: false } // suppress automatic generation
);

//personSchema.plugin( textSearch );

personSchema.index({
  firstname: "text",
  lastname: "text",
  email: "text",
  telephone: "text",
  street: "text",
  streetnr: "text",
  zip: "text",
  city: "text",
  country: "text"
});

function display_string_for_person_doc( p )
{
  return p.lastname + ' ' + p.firstname + ' ' + p.salutation
    + ' ' + p.street + ' ' + p.streetnr + ' ' + p.zip
    + ' ' + p.city + ' ' + p.country;
}

personSchema.methods.get_display_string = function() {
  return display_string_for_person_doc( this );
};

//function search_string_for_filter_map_reduce( p )
//{
//  return p.firstname + ' ' + p.lastname + ' ' + p.email
//    + ' ' + p.telephone + ' ' + p.street + ' ' + p.streetnr
//    + ' ' + p.zip + ' ' + p.city + ' ' + p.country;
//}
//
//personSchema.methods.get_string_for_filter_map_reduce = function() {
//  return search_string_for_filter_map_reduce( this );
//};

var Person = mongoose.model( 'Person', personSchema );

Person.route = Person.modelName.toLowerCase();
Person.thing_en = Person.modelName.toLowerCase();
Person.thing_de = Person.modelName;

const { jtformgen_edit_document } = require('../form/jtformgen.js');

Person.get_edit_form_html = ( p, action, error ) => {
  var id = p['_id'];
  //var url_action = create_duplicate ? 'dupl' : 'edit';
  var url_action = 'view' === action ? '' : action + '_submit';
  url_action = `/${Person.route}/${id}/${url_action}`;

  var verb = (action === 'dupl')
    ? `duplizieren, also neue ${Person.thing_de} anlegen mit aehnlichen Daten`
    : (action === 'edit' ? 'edititieren' : 'anschauen');

  verb = Person.thing_de + ' ' + verb;

  delete p['__v'];

  if( !(action === 'dupl') ) {
    delete p['_id'];
    delete p['units'];
  }

  return jtformgen_edit_document( p, url_action, verb, true, error );
}

module.exports = Person;
