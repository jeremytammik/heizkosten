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
  delete p['_id'];
  delete p['__v'];
  
  if(create_duplicate) {
    p['person_id'] = '';
  }
  else {
    delete p['person_id'];
    delete p['units'];
  }
  
  var url_action = create_duplicate ? 'dupl' : 'edit';
  var verb = create_duplicate ? 'duplizieren' : 'edititieren';

  var s1 = `\
<head>\
	<meta charset="utf-8" />\
	<title>Edit Person Data</title>\
  <style>\
    body, td, label { font-family: sans-serif; font-size: small }\
    td { text-align: right }\
    table { border: 1px solid black }\
  </style>\
</head>\
\
<body>\
  <p>Person ${verb}:</p>\
  <form action="/person/${id}/${url_action}_submit" method="POST">\
    <table>\
`;

var a = [];
Object.keys(p).forEach( (key,index) => {
  var k = key;
  var v = p[key];
  a.push( `\ 
<tr>\
<td><label for="${k}">${k}:</label></td>\
<td><input type="string" maxlength="30" size="30" placeholder="${k}" id="${k}" name="${k}" value="${v}"></td>\
</tr>\
` );
});

var s2 = a.join('\n');

var s3 = '\
        <tr>\
          <td colspan="2" style="text-align: center">\
            <button type="submit">Speichern</button>\
          </td>\
        </tr>\
      </table>\
    </form>\
  </body>\
</html>\
';

return s1 + s2 + s3;
}

module.exports = Person;
