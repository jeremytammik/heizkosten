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
  _id: String, // suppress automatic generation
  apartment_id: String,
  occupant_ids: [String],
  address_alt: String, // alternative address, e.g., after giving notice
  begin: Date,
  end: Date,
  apartment_rent_eur: [{begin: Date, amount: Number}],
  other_rent_eur: [{begin: Date, amount: Number}],
  nebenkosten_eur: [{begin: Date, amount: Number}],
  deposit_eur: Number,
  payments: [{
    date: Date,
    amount: Number,
    account: { type: String, enum: enum_contract_accounts } }],
  heatcostallocatorreadings: [{ number:String, date:Date, amount:Number }],
  coldwatermeters: [{ number:String, date:Date, amount:Number }],
  hotwatermeters: [{ number:String, date:Date, amount:Number }],
  // smokedetector_maintenance_count: Number, // calculated from apartment list of smoke detectors
  smokedetector_maintenance_cost_eur: Number, // constant defined by owner per detector replaced

  { _id: false } // suppress automatic generation
);

mongoose.model( 'contract', contractSchema );

  "001-09-02-2018": {
    "_id": "001-09-02-2018",
    "apartment_id": "001-09-02",
    "occupant_ids": ["erich_klimaczewski"],
    "begin": "2002-07-01",
    "end": "2019-03-31",
    "rent_apartment_eur": { "2018-01-01": 478, "2019-01-01": 500 },
    "rent_other_eur": { "2018-01-01": 50 },
    "nebenkosten_eur": { "2018-01-01": 173 },
    "deposit_eur": 1050,
    "payments_rent_apartment": { "2018": 5736 },
    "payments_rent_other": { "2018": 600 },
    "payments_nk": { "2018": 2076 },
    "heatcostallocatorreadings": {
      "HE-WO-44318710": { "2018-12-31": 3067 },
      "HE-BA-44318734": { "2018-12-31": 742 },
      "HE-SM-44318741": { "2018-12-31": 1238 },
      "HE-KU-44318727": { "2018-12-31": 1 }
    },
    "coldwatermeters": {
      "KW-BA-1425007": { "2017-12-31": 88.08, "2018-12-31": 120.83 }
    },
    "hotwatermeters": {
      "WW-BA-4133075": { "2017-12-31": 26.81, "2018-12-31": 40.47 }
    },
    "smokedetector_maintenance_cost_eur": 5
  },