const app = module.exports = require('express')();
//const util = require( '../calc/util' );
//const datautil = require('../model/datautil');
const jtformgen = require('../form/jtformgen');
const Contract = require( '../model/contract' );

app.get( '/nk/unit/:uid/year/:year', (req, res) => {
  var uid = req.params.uid;
  var year = req.params.year;
  var year_begin = year + '-01-01';
  var year_end = year + '-12-31';
  Contract.find( {
      'unit_id': uid,
      'begin': {$lte: year_end},
      $or: [ {'end':''}, {'end': {$gte: year_begin}} ]
    }, (err, contracts) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    else {
      console.log(contracts);
      return res.send( jtformgen.jtformgen_list_documents(
        Contract, ` in ${uid} active in year ${year}`, contracts, false, false ) );
    }
  });
});
