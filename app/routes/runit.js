const app = module.exports = require('express')();

const Unit = require( '../model/unit' );

const {
  load_data_for_model,
  save_data_for_model } = require('../model/datautil');

const {
  jtformgen_list_documents,
  jtformgen_unit_selected } = require('../form/jtformgen.js');

app.get( '/', (req, res) => {
  Unit.find( {}, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        Unit, '', results, true ) );
    }
  });
});

app.get( '/load_data', (req, res) => {
  return load_data_for_model( Unit, res, req );
});

app.get( '/:id', (req, res) => {
  var id = req.params.id;
  Unit.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Unit.get_edit_form_html( doc, 'view' );
      res.send( form );
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
