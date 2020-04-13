// ownership.js
//
// mongo data model definition for apartment ownership
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

/*
id_owner
  besitzer
  kaufdatum
  liste einzahlungen 
*/

const enum_owner_accounts = [
  'hausgeld',
  'energiekosten',
  'ruecklagen',
  'grundsteuer', // not part of the unit, separate for each owner
  'hausgeld_umlagefaehig',
  'verwalterkosten' // moved from unit to ownership  
];

var ownerSchema = new Schema({
  owner_id: String,
  person_id: ObjectId,
  purchasedate: Date,
  payments: [{
    date: Date,
    amount: Number,
    account: { type: String, enum: enum_owner_accounts } }],
});

mongoose.model( 'owner', ownerSchema );
