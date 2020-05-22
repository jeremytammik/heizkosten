const app = module.exports = require('express')();
const Contract = require( '../model/contract' );

const {
  load_data_for_model,
  save_data_for_model } = require('../model/datautil');

const {
  success_with_document_count,
  jtformgen_confirm_delete,
  jtformgen_list_documents } = require('../form/jtformgen');

app.get( '/', (req, res) => {
  Contract.find( {}, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        Contract, '', results, true ) );
    }
  });
});

app.get( '/unit/:uid/list', (req, res) => {
  var uid = req.params.uid;
  Contract.find( { 'unit_id': uid }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        Contract, ` in ${uid}`, results, false ) );
    }
  });
});

app.get( '/:id/edit', (req, res) => {
  var id = req.params.id;
  Contract.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Contract.get_edit_form_html( doc, false );
      res.send( form );
    }
  });
});

function convert_to_dict( c, keyprefix )
{
  d = {};
  var i = 0;
  while( c.hasOwnProperty( k = `${keyprefix}_${i}_key` ) ) {
    d[c[k]] = c[v = `${keyprefix}_${i}_val`];
    delete c[k];
    delete c[v];
    ++i;
  }
  return d;
}

app.post( '/:id/edit_submit', (req, res) => {
  var c = util.trimAllFieldsInObjectAndChildren( req.body );
  //console.log(c);
  c.smokedetectors = convert_to_dict(c,'smokedetectors');
  c.coldwatermeters = convert_to_dict(c,'coldwatermeters');
  c.hotwatermeters = convert_to_dict(c,'hotwatermeters');
  c.heatcostallocators = convert_to_dict(c,'heatcostallocators');
  //console.log(c);

  var a = new Contract( req.body );
  error = a.validateSync();
  if( error ) {
    var form = Contract.get_edit_form_html( c, false, error );
    return res.send( form );      
  }
  var id = req.params.id;
  Contract.updateOne( { "_id": id }, c, (err,res2) => {
    if (err) { return console.error(err); }
    Contract.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_document_count(
        count.toString(), Contract.thing_en ) );
    });
  });
});

app.get( '/:id/dupl', (req, res) => {
  var id = req.params.id;
  Contract.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Contract.get_edit_form_html( doc, true );
      res.send( form );
    }
  });
});

app.post( '/:id/dupl_submit', (req, res) => {
  var id_original = req.params.id;
  
  var c = util.trimAllFieldsInObjectAndChildren( req.body );
  //console.log(c);
  c.smokedetectors = convert_to_dict(c,'smokedetectors');
  c.coldwatermeters = convert_to_dict(c,'coldwatermeters');
  c.hotwatermeters = convert_to_dict(c,'hotwatermeters');
  c.heatcostallocators = convert_to_dict(c,'heatcostallocators');
  console.log(c);
  
  var id = c._id;
  Contract.countDocuments( {'_id': id }, (err, count) => {
    if (err) {
      return console.error(err);
    }
    if( 0 < count ) {
      var error = { 'errors': { '_id': {
        'path': '_id', 'message': 'duplicate id' }}};
      var form = Contract.get_edit_form_html( req.body, true, error );
      return res.send( form );
    }
    var p2 = new Contract( c );
    error = p2.validateSync();
    if( error ) {
      var form = Contract.get_edit_form_html( doc, true, error );
      return res.send( form );      
    }
    //var p3 = req.body;
    c['_id'] = id;
    Contract.create( c, (err2,res2) => {
      if (err2) {
        return console.error(err2);
      }
      Contract.countDocuments( {}, (err3, count) => {
        if (err3) { return console.error(err3); }
        return res.send( success_with_document_count( count.toString(), Contract.thing_en ) );
      });
    });
  });
});

app.get( '/:id/del', (req, res) => {
  var id = req.params.id;
  Contract.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var s = results[0].get_display_string();
      res.send( jtformgen_confirm_delete( Contract, s, id ) );
    }
  });
});

app.get( '/:id/del_confirmed', (req, res) => {
  var id = req.params.id;
  Contract.deleteOne( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    Contract.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_document_count( count.toString(), Contract.thing_en ) );
    });
  });
});

app.get( '/load_data', (req, res) => {
  return load_data_for_model( Contract, res, req );
});

app.get( '/save_data', (req, res) => {
  return save_data_for_model( Contract, res, req );
});