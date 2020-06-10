// contract.js
//
// mongo data model definition for a rental contract
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

const jtregex = require( '../../data/jtregex' );

const enum_contract_accounts = [
  'apartment_rental',
  'other_rental',
  'nebenkosten',
  'deposit',
  'nkrueckbehalt'
];

var contractSchema = new Schema({
  _id: { // suppress automatic generation  
    type: String,
    min: 12,
    max: 14,
    validate: {
      validator: function(s) {
        return jtregex.valid_contract_id.test(s);
      },
      message: props => `'${props.value}' is not a valid contract_id`
    }
  },
  unit_id: { // unit, not really needed
    type: String,
    min: 3,
    max: 3,
    validate: {
      validator: function(s) {
        return jtregex.valid_unit_id.test(s);
      },
      message: props => `'${props.value}' is not a valid unit_id`
    }
  },
  apartment_id: {
    type: String,
    min: 9,
    max: 9,
    validate: {
      validator: function(s) {
        return jtregex.valid_apartment_id.test(s);
      },
      message: props => `'${props.value}' is not a valid apartment_id`
    }
  },
  occupant_ids: [String],
  begin: Date,
  end: Date,
  rent_apartment_eur: { type: Object }, // dictionary mapping begin date to rent in euro { Date: Number}
  rent_other_eur: { type: Object }, // dictionary mapping begin date to rent in euro { Date: Number}
  nebenkosten_eur: { type: Object }, // dictionary mapping begin date to rent in euro { Date: Number}
  deposit_eur: Number,
  payments_rent_apartment: { type: Object }, // dictionary mapping calendar year to total payments in euro { Year: Number}
  payments_rent_other: { type: Object }, // dictionary mapping calendar year to total payments in euro { Year: Number}
  payments_nk: { type: Object }, // dictionary mapping calendar year to total payments in euro { Year: Number}
  heatcostallocatorreadings: { type: Object }, // dictionary mapping meter number to a list of readings, dictionary mapping date to amount
  coldwatermeters: { type: Object }, // dictionary mapping meter number to a list of readings, dictionary mapping date to amount
  hotwatermeters: { type: Object }, // dictionary mapping meter number to a list of readings, dictionary mapping date to amount
  smokedetector_maintenance_cost_eur: Number }, // constant defined by owner per detector replaced
  { _id: false } // suppress automatic generation
);

contractSchema.methods.get_display_string = function() {
  return `${this._id} &ndash; ${this.room_count} rooms with ${this.area_m2} m2`;
};

var Contract = mongoose.model( 'contract', contractSchema );

Contract.route = 'contract';
Contract.thing_en = Contract.modelName.toLowerCase();
Contract.thing_de = 'Vertrag';

const { jtformgen_edit_document } = require('../form/jtformgen.js');

Contract.get_edit_form_html = ( d, action, error ) => {
  var id = d['_id'];
  var url_action = 'view' === action ? '' : action + '_submit';
  url_action = `/${Contract.route}/${id}/${url_action}`;
  
  var verb = (action === 'dupl')
    ? `duplizieren, also neuen ${Contract.thing_de} anlegen mit aehnlichen Daten`
    : (action === 'edit' ? 'edititieren' : 'anschauen');
    
  verb = Contract.thing_de + ' ' + id + ' ' + verb;

  delete d['__v'];
  
  if( !(action === 'dupl') ) {
    delete d['_id'];
    delete d['unit_id'];
    delete d['apartment_id'];
  }
  
  return jtformgen_edit_document( d, url_action, verb, true, error );
}

module.exports = Contract;
