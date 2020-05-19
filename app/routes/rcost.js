const app = module.exports = require('express')();

const Cost = require( '../model/cost' );
var CostService = require( '../controller/cost_v1' );

app.get('/api/v1/cost', CostService.findAll);
app.get('/api/v1/cost/:id', CostService.findById);
app.post('/api/v1/cost', CostService.add); // is this used any longer at all, now that update3 is available?
//app.post('/api/v1/cost', CostService.insertBatch); // add multiple records
app.put('/api/v1/cost/:id', CostService.update3); // added {upsert:true} option
app.delete('/api/v1/cost/:id', CostService.delete);
app.get('/api/v1/cost/unit/:uid', CostService.findAllForUnit);
app.delete('/api/v1/cost/unit/:uid', CostService.deleteAllForUnit);

const {
  success_with_document_count,
  jtformgen_list_documents } = require('../form/jtformgen.js');

app.get( '/', (req, res) => {
  Cost.find( {}, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        'cost', '', results, true ) );
    }
  });
});

app.get( '/unit/:uid/list', (req, res) => {
  var uid = req.params.uid;
  Cost.find( { 'unit_id': uid }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        'yearly cost', ` in ${uid}`, results, false ) );
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
