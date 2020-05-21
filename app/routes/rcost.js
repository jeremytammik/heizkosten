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
  load_data_for_model,
  save_data_for_model } = require('./datautil.js');

const {
  success_with_document_count,
  jtformgen_confirm_delete,
  jtformgen_list_documents } = require('../form/jtformgen.js');

app.get( '/', (req, res) => {
  Cost.find( {}, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        Cost, '', results, true ) );
    }
  });
});

app.get( '/unit/:uid/list', (req, res) => {
  var uid = req.params.uid;
  Cost.find( { 'unit_id': uid }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        Cost, ` in ${uid}`, results, false ) );
    }
  });
});

app.get( '/:id/edit', (req, res) => {
  var id = req.params.id;
  Cost.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Cost.get_edit_form_html( doc, false );
      res.send( form );
    }
  });
});

app.post( '/:id/edit_submit', (req, res) => {
  //var c = util.trimAllFieldsInObjectAndChildren( req.body );
  var c = req.body;
  var cost = new Cost( req.body );
  error = cost.validateSync();
  if( error ) {
    var form = Cost.get_edit_form_html( c, false, error );
    return res.send( form );      
  }
  var id = req.params.id;
  Cost.updateOne( { "_id": id }, c, (err,res2) => {
    if (err) { return console.error(err); }
    Cost.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_document_count(
        count.toString(), Cost.thing_en ) );
    });
  });
});

app.get( '/:id/dupl', (req, res) => {
  var id = req.params.id;
  Cost.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Cost.get_edit_form_html( doc, true );
      res.send( form );
    }
  });
});

app.post( '/:id/dupl_submit', (req, res) => {
  var id_original = req.params.id;
  //var p = util.trimAllFieldsInObjectAndChildren( req.body );
  var p = req.body;
  var id = p.unit_id + '-' + p.year;
  Cost.countDocuments( {'_id': id }, (err, count) => {
    if (err) {
      return console.error(err);
    }
    if( 0 < count ) {
      var error = { 'errors': { '_id': {
        'path': '_id', 'message': 'duplicate id; '
        + `costs already defined for year ${p.year} for unit ${p.unit_id}` }}};
      var form = Cost.get_edit_form_html( req.body, true, error );
      return res.send( form );
    }
    var p2 = new Cost( p );
    error = p2.validateSync();
    if( error ) {
      var form = Cost.get_edit_form_html( doc, true, error );
      return res.send( form );      
    }
    var p3 = req.body;
    p3['_id'] = id;
    Cost.create( req.body, (err2,res2) => {
      if (err2) {
        return console.error(err2);
      }
      Cost.countDocuments( {}, (err3, count) => {
        if (err3) { return console.error(err3); }
        return res.send( success_with_document_count( count.toString(), Cost.thing_en ) );
      });
    });
  });
});

app.get( '/:id/del', (req, res) => {
  var id = req.params.id;
  Cost.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var s = results[0].get_display_string();
      res.send( jtformgen_confirm_delete( Cost, s, id ) );
    }
  });
});

app.get( '/:id/del_confirmed', (req, res) => {
  var id = req.params.id;
  Cost.deleteOne( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    Cost.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_document_count( count.toString(), Cost.thing_en ) );
    });
  });
});

app.get( '/load_data', (req, res) => {
  return load_data_for_model( Cost, res, req );
});

app.get( '/save_data', (req, res) => {
  //Cost.find( {}, function( err, docs ) {
  //  if (err) { return console.error(err); }
  //  var d = {};
  //  docs.forEach( (doc) => {
  //    var p = doc._doc;
  //    p.year = p.year.toString();
  //    delete p['__v'];
  //    d[p._id] = p;
  //  });
  //  var fs = require('fs');
  //  var fn = `data/tmp/${Cost.route}.json`;
  //  fs.writeFile( fn,
  //    JSON.stringify( d, null, 2 ), 'utf8',
  //    function (err) {
  //      if (err) { return console.log(err); }
  //      return res.send( `${Cost.thing_en} data saved in '${fn}'` );
  //    }
  //  );
  //});
  save_data_for_model( Cost, res, req );
});
