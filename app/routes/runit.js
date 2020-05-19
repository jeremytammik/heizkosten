const app = module.exports = require('express')();

const Unit = require( '../model/unit' );

const {
  success_with_document_count,
  jtformgen_list_documents,
  jtformgen_unit_selected } = require('../form/jtformgen.js');

app.get( '/', (req, res) => {
  Unit.find( {}, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        'unit', '', results, true ) );
    }
  });
});

app.get( '/:id/edit', (req, res) => {
  res.send( 'Sorry, please ask your admin.' );
});

app.get( '/:id/dupl', (req, res) => {
  res.send( 'Sorry, please ask your admin.' );
});

app.get( '/:id/del', (req, res) => {
  res.send( 'Sorry, please ask your admin.' );
});

app.get( '/:id/select', (req, res) => {
  var id = req.params.id;
  res.send( jtformgen_unit_selected( id ) );
});

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

/*
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
*/
