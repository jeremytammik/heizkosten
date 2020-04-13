// contract.js
//
// mongo data model definition for a rental contract
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

const enum_contract_accounts = [
  'apartment_rental',
  'other_rental',
  'nebenkosten',
  'deposit',
  'nkrueckbehalt'
];

var contractSchema = new Schema({
  contract_id: String,
  apartment: ObjectId,
  occupants: [ObjectId],
  begin: Date,
  end: Date,
  apartment_rent_eur: Number,
  other_rent_eur: Number,
  nebenkosten_eur: Number,
  deposit_eur: Number,
  payments: [{
    date: Date,
    amount: Number,
    account: { type: String, enum: enum_contract_accounts } }],
  heatcostallocatorreadings: [{ number:String, date:Date, amount:Number }],
  coldwatermeters: [{ number:String, date:Date, amount:Number }],
  hotwatermeters: [{ number:String, date:Date, amount:Number }],
  smokedetector_maintenance_count: Number,
  smokedetector_maintenance_cost_eur: Number // constant defined by owner per detector replaced
});

mongoose.model( 'contract', contractSchema );
