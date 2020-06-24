const app = module.exports = require('express')();
const datautil = require('../model/datautil');
const jtformgen = require('../form/jtformgen');
const Unit = require( '../model/unit' );

app.get( '/', (req, res) => {
  Unit.find( {}, (err, results) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    return res.send( jtformgen.jtformgen_list_documents(
      Unit, '', results, true, false ) );
  });
});

app.get( '/load_data', (req, res) => {
  return datautil.load_data_for_model( Unit, res, req );
});

app.get( '/:id', (req, res) => {
  var id = req.params.id;
  Unit.findById( id, (err, result) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    var form = Unit.get_edit_form_html( result._doc, 'view' );
    res.send( form );
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
  res.send( jtformgen.jtformgen_unit_selected( id ) );
});
