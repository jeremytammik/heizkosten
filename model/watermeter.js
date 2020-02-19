// watermeter.js
//
// mongo data model definition for a heizkosten watermeter
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

/*
  wasseruhren (nummer, ablaufdatum)
*/

var watermeterSchema = new Schema({
  apartment_id: ObjectId,
  watermeter_id: String,
  expires: Date
});

mongoose.model( 'watermeter', watermeterSchema );
