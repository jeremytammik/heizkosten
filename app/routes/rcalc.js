const app = module.exports = require('express')();
const { jtformgen_edit_document } = require('../form/jtformgen');
const nkabrechnung = require('../calc/nkabrechnung');
const Apartment = require( '../model/apartment' );
const Contract = require( '../model/contract' );
const Cost = require( '../model/cost' );
const Person = require( '../model/person' );
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
    var n1 = contracts.length;
    var apt_ids = [];
    var p_ids = [];
    for( let i = 0; i < n1; ++i ) {
      apt_ids.push( contracts[i].apartment_id );
      p_ids.push( contracts[i].occupant_ids[0] );
    }
    Apartment.find( { '_id': {$in : apt_ids} }, (e2, apts) => {
      if ( e2 ) { console.error( e2 ); return res.send( e2.toString() ); }
      // reorganise apartments into dictionary
      var n2 = apts.length;
      var apartments = {};
      for( let i = 0; i < n2; ++i ) {
        apartments[apts[i]._id] = apts[i];
      }
      Unit.find( { '_id': uid }, (e3, units) => {
        if ( e3 ) { console.error( e3 ); return res.send( e3.toString() ); }
        var cost_id = uid + '-' + year;
        Cost.find( { '_id': cost_id }, (e4, costs) => {
          if ( e4 ) { console.error( e4 ); return res.send( e4.toString() ); }
          Person.find( { '_id': {$in : p_ids} }, (e5, persons) => {
            if ( e5 ) { console.error( e5 ); return res.send( e5.toString() ); }
            // reorganise persons into dictionary
            var n5 = persons.length;
            var addressees = {};
            for( let i = 0; i < n5; ++i ) {
              addressees[persons[i]._id] = persons[i];
            }
            // iterate over contracts
            a = [];
            for( let i = 0; i < n1; ++i ) {
              var contract = contracts[i];
              var unit = units[0];
              var year_costs = costs[0];
              var apartment = apartments[contract.apartment_id];
              var addressee = addressees[contract.occupant_ids[0]];
              var energy_cost_eur = 907.54;
              a.push( nkabrechnung.get_nkabrechnung_for(
                unit, year_costs, apartment, contract, addressee,
                year, energy_cost_eur ) );              
            }
            return res.send( jtformgen.nkabrechnung_report_html( a ) );
          });
        });
      });
    });
  });
});
