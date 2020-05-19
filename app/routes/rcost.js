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
  jtformgen_confirm_delete,
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
        'cost', ` in ${uid}`, results, false ) );
    }
  });
});

app.get( '/:id/edit', (req, res) => {
  var id = req.params.id;
  Cost.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Cost.get_edit_form_html( doc, 'Kosten', false );
      res.send( form );
    }
  });
});

app.post( '/:id/edit_submit', (req, res) => {
  var c = util.trimAllFieldsInObjectAndChildren( req.body );
  var cost = new Cost( c );
  error = cost.validateSync();
  if( error ) {
    var form = Cost.get_edit_form_html( p, false, error );
    return res.send( form );      
  }
  var id = req.params.id;
  Cost.updateOne( { "_id": id }, c, (err,res2) => {
    if (err) { return console.error(err); }
    Cost.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_document_count(
        count.toString(), 'yearly cost' ) );
    });
  });
});

app.get( '/:id/dupl', (req, res) => {
  res.send( 'Sorry, please ask your admin.' );
});

app.get( '/:id/del', (req, res) => {
  var id = req.params.id;
  Cost.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var s = results[0].get_display_string();
      res.send( jtformgen_confirm_delete( 'cost', 'Kosten', s, id ) );
    }
  });
});

app.get( '/:id/del_confirmed', (req, res) => {
  var id = req.params.id;
  Cost.deleteOne( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    Cost.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_document_count( count.toString(), 'yearly cost' ) );
    });
  });
});

app.get( '/load_sample_data', (req, res) => {
  var fs = require('fs');
  var units = JSON.parse(
    fs.readFileSync(
      'data/cost.json', 'utf8' ));
  
  Cost.deleteMany( {}, (err) => {
    if (err) { return console.error(err); }
    Cost.create( Object.values(units), (err,res2) => {
      if (err) { return console.error(err); }
      Cost.countDocuments( {}, (err, count) => {
        if (err) { return console.error(err); }
        return res.send( success_with_document_count( count.toString(), 'yearly cost' ) );
      });
    });
  });
});
