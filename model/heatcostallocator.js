// heatcostallocator.js
//
// mongo data model definition for a heizkosten heatcostallocator
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

/*
  heizkostenverteiler (nummer, ablaufdatum, faktor)
*/

var heatcostallocatorSchema = new Schema({
  apartment_id: ObjectId,
  heatcostallocator_id: String,
  expires: Date,
  factor: Number
});

mongoose.model( 'heatcostallocator', heatcostallocatorSchema );
