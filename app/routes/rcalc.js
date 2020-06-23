const app = module.exports = require('express')();
const jtformgen = require('../form/jtformgen');
const Apartment = require( '../model/apartment' );
const Contract = require( '../model/contract' );
const Cost = require( '../model/cost' );
const Unit = require( '../model/unit' );

// Perform the Nebenkostenabrechnung for the given year.
// That requires the unit, its costs for that year,
// all the contracts and all the apartments.

app.get( '/nk/unit/:uid/year/:year', (req, res) => {
  var uid = req.params.uid;
  var year = req.params.year;
  var year_begin = year + '-01-01';
  var year_end = year + '-12-31';
  Contract.find( {
      'unit_id': uid,
      'begin': {$lte: year_end},
      $or: [ {'end':''}, {'end': {$gte: year_begin}} ]
    }, (e1, contracts) => {
    if ( e1 ) { console.error( e1 ); return res.send( e1.toString() ); }
    var n = contracts.length;
    var apt_ids = [];
    for( let i = 0; i < n; ++i ) { apt_ids.push( contracts[i].apartment_id ); }
    Apartment.find( { '_id': {$in : apt_ids} }, (e2, apts) => {
      if ( e2 ) { console.error( e2 ); return res.send( e2.toString() ); }
      Unit.find( { '_id': uid }, (e3, units) => {
        if ( e3 ) { console.error( e3 ); return res.send( e3.toString() ); }
        console.log( units );
        var cost_id = uid + '-' + year;
        console.log( cost_id );
        Cost.find( { '_id': cost_id }, (e4, costs) => {
          if ( e4 ) { console.error( e4 ); return res.send( e4.toString() ); }
          console.log( costs );
          return res.send( jtformgen.jtformgen_list_documents(
            Contract, ` in ${uid} active in year ${year}`, contracts, false, false ) );
        });
      });
    });
  });
});
