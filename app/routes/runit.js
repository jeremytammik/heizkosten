const app = module.exports = require('express')();

const Unit = require( '../model/unit' );

const { success_with_document_count } = require('../form/jtformgen.js');

app.get( '/load_sample_data', (req, res) => {
  var fs = require('fs');
  var units = JSON.parse(
    fs.readFileSync(
      'data/unit.json', 'utf8' ));
  
  Unit.deleteMany( {}, (err) => {
    if (err) { return console.error(err); }
    Unit.create( Object.values(units), (err,res2) => {
      if (err) { return console.error(err); }
      Unit.countDocuments( {}, (err, count) => {
        if (err) { return console.error(err); }
        return res.send( success_with_document_count( count.toString(), 'unit' ) );
      });
    });
  });
});

app.get( '/load_sample_data_promise', (req, res) => {
  var fs = require('fs');
  var units = JSON.parse(
    fs.readFileSync(
      'data/unit.json', 'utf8' ));
  
  Unit.deleteMany( {} )
    .then( Unit.create( Object.values(units) ) )
    .then( Unit.countDocuments( {}, function(err, count) {
        if (err) { return console.error(err); }
        return res.send( success_with_document_count( count.toString(), 'unit' ) ); } ) )
    .catch( function (err) { return console.error( 'catch', err ); } ); 
});
