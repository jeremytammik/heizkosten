// contract.js
//
// mongo data model definition for a rental contract
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

const jtregex = require( '../../data/jtregex' );
const jtvalidators = require( '../../data/jtvalidators' );
const util = require( '../calc/util' );

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
  begin: {
    type: String,
    min: 10,
    max: 10,
    validate: {
      validator: function(s) {
        return jtvalidators.validate_begin_end_date(s);
      },
      message: props => `'${props.value}' is not a valid contract begin date`
    }
  },
  end: {
    type: String,
    validate: {
      validator: function(s) {
        return (!s) || jtvalidators.validate_begin_end_date(s);
      },
      message: props => `'${props.value}' is not a valid contract end date`
    }
  },
  rent_apartment_eur: { // comma-separated string of colon-separated pairs mapping begin date to rent in euro 'date: number [, date: number...]'
    type: String,
    validate: {
      validator: jtvalidators.validate_dict_date_amount_string,
      message: 'invalid list of date: apartment rent [, ...]'
    }
  },
  rent_other_eur: { // dictionary mapping begin date to other rent in euro 'date: number [, date: number...]'
    type: String,
    validate: {
      validator: function(s) {
        return (!s) || jtvalidators.validate_dict_date_amount_string(s);
      },
      message: 'invalid list of date: other rent [, ...]'
    }
  },
  nebenkosten_eur: { // dictionary mapping begin date to nk prepayment in euro 'date: number [, date: number...]'
    type: String,
    validate: {
      validator: jtvalidators.validate_dict_date_amount_string,
      message: 'invalid list of date: nebenkostenvorauszahlung [, ...]'
    }
  },
  deposit_eur: Number, // kaution
  withholding_nk_eur: Number, // nebenkostenrueckbehalt von der kaution nach vertragsende
  payments_rent_apartment: { type: Object }, // dictionary mapping calendar year to total payments in euro { Year: Number}
  payments_rent_other: { type: Object }, // dictionary mapping calendar year to total payments in euro { Year: Number}
  payments_nk: { type: Object }, // dictionary mapping calendar year to total payments in euro { Year: Number}
  //heatcostallocators: { type: Object }, // dictionary mapping meter number to a list of readings, dictionary mapping date to amount
  //coldwatermeters: { type: Object }, // dictionary mapping meter number to a list of readings, dictionary mapping date to amount
  //hotwatermeters: { type: Object }, // dictionary mapping meter number to a list of readings, dictionary mapping date to amount
  smokedetector_maintenance_cost_eur: Number, // constant defined by owner per detector replaced
  energiekosten_2019_eur: Number }, // temporary one-off field using third-party input data for 2019 only
  { _id: false } // suppress automatic generation
);

contractSchema.pre( 'validate', function( next ) {
  if( !(this._id.startsWith( this.apartment_id + '-' ) ) ) {
    this.invalidate( '_id', 'contract _id must match its apartment_id', this._id );
  }
  if( !(this.apartment_id.startsWith( this.unit_id + '-' ) ) ) {
    this.invalidate( 'apartment_id', 'contract apartment_id must match its unit_id', this.apartment_id );
  }
  if( this.end && !(util.isodate_string_is_before( this.begin, this.end )) ) {
    this.invalidate( 'end', 'contract end date must be later than contract begin', this.end );
  }
  next();
});

contractSchema.methods.get_display_string = function() {
  return `${this._id} &ndash; ${this.occupant_ids.join()}`;
};

contractSchema.methods.get_duration_in_given_year = function( begin, end ) {
  // determine contract duration in given year span
  // adjust begin and end to contract begin and end in given year
  if( this.end < begin ) {
    return begin, begin;
  }
  else if ( this.begin > end ) {
    return end, end;
  }
  else {
    if( begin < this.begin ) {
      begin = this.begin;
    }
    if( this.end < end ) {
      end = this.end;
    }
  }
  return begin, end;
}

var Contract = mongoose.model( 'Contract', contractSchema );

Contract.route = 'contract';
Contract.thing_en = Contract.modelName.toLowerCase();
Contract.thing_de = 'Vertrag';

const { jtformgen_edit_document } = require('../form/jtformgen');

Contract.get_edit_form_html = ( d, action, error ) => {
  var id = d._id;
  var url_action = 'view' === action ? '' : action + '_submit';
  url_action = `/${Contract.route}/${id}/${url_action}`;
  
  var verb = (action === 'dupl')
    ? `duplizieren, also neuen ${Contract.thing_de} anlegen mit aehnlichen Daten`
    : (action === 'edit' ? 'edititieren' : 'anschauen');
    
  verb = Contract.thing_de + ' ' + id + ' ' + verb;

  delete d.__v;
  
  if( !(action === 'dupl') ) {
    delete d._id;
    delete d.unit_id;
    delete d.apartment_id;
  }
 
  return jtformgen_edit_document( d, url_action, verb, true, error );
}

module.exports = Contract;
