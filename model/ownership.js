// owner.js
//
// mongo data model definition for an apartment owner, mainly payment
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

/*
id_owner
  name
  vorname
  verbindliche email
  verbindliche iban
  telefon
  kaufdatum
  liste einzahlungen 
*/

const enum_owner_accounts = [
  'hausgeld',
  'energiekosten',
  'ruecklagen' ];

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
