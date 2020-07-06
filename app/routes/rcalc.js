const app = module.exports = require('express')();
const jtformgen = require('../form/jtformgen');
const Apartment = require( '../model/apartment' );
const Contract = require( '../model/contract' );
const Coal = require( '../calc/coal' );
const Cost = require( '../model/cost' );
const Person = require( '../model/person' );
const Unit = require( '../model/unit' );

// Perform the utility cost allocation Nebenkostenabrechnung
// for the given year for all contracts.
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
    // extract apartment and occupant ids
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
      Unit.findById( uid, (e3, unit) => {
        if ( e3 ) { console.error( e3 ); return res.send( e3.toString() ); }
        var cost_id = uid + '-' + year;
        Cost.findById( cost_id, (e4, costs) => {
          if ( e4 ) { console.error( e4 ); return res.send( e4.toString() ); }
          Person.find( { '_id': {$in : p_ids} }, (e5, persons) => {
            if ( e5 ) { console.error( e5 ); return res.send( e5.toString() ); }
            // reorganise persons into dictionary
            var n5 = persons.length;
            var addressees = {};
            for( let i = 0; i < n5; ++i ) {
              addressees[persons[i]._id] = persons[i];
            }
            var map_contract_to_coal = {};
            for( let i = 0; i < n1; ++i ) {
              var contract = contracts[i];
              var apartment = apartments[contract.apartment_id]._doc;
              var addressee = addressees[contract.occupant_ids[0]]._doc;
              
              var energy_cost_eur = "2018" === year
                ? 907.54 // todo: get this from contract data
                : contract.energiekosten_2019_eur;
              
              map_contract_to_coal[contract._id] = new Coal(
                unit, costs, apartment, contract,
                addressee, year, energy_cost_eur );
            }
            return res.send( jtformgen.nkabrechnung_report(
              uid, year, map_contract_to_coal ) );
          });
        });
      });
    });
  });
});
