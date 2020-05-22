const app = module.exports = require('express')();
const util = require( '../calc/util' );
const Apartment = require( '../model/apartment' );

const {
  load_data_for_model,
  save_data_for_model } = require('../model/datautil');

const {
  success_with_document_count,
  jtformgen_confirm_delete,
  jtformgen_list_documents } = require('../form/jtformgen');

app.get( '/', (req, res) => {
  Apartment.find( {}, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        Apartment, '', results, true ) );
    }
  });
});

app.get( '/unit/:uid/list', (req, res) => {
  var uid = req.params.uid;
  Apartment.find( { 'unit_id': uid }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        Apartment, ` in ${uid}`, results, false ) );
    }
  });
});

app.get( '/:id', (req, res) => {
  var id = req.params.id;
  Apartment.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Apartment.get_edit_form_html( doc, 'view' );
      res.send( form );
    }
  });
});

app.get( '/:id/edit', (req, res) => {
  var id = req.params.id;
  Apartment.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Apartment.get_edit_form_html( doc, 'edit' );
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

  var a = new Apartment( req.body );
  error = a.validateSync();
  if( error ) {
    var form = Apartment.get_edit_form_html( c, 'edit', error );
    return res.send( form );      
  }
  var id = req.params.id;
  Apartment.updateOne( { "_id": id }, c, (err,res2) => {
    if (err) { return console.error(err); }
    Apartment.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_document_count(
        count.toString(), Apartment.thing_en ) );
    });
  });
});

app.get( '/:id/dupl', (req, res) => {
  var id = req.params.id;
  Apartment.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Apartment.get_edit_form_html( doc, 'dupl' );
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
  Apartment.countDocuments( {'_id': id }, (err, count) => {
    if (err) {
      return console.error(err);
    }
    if( 0 < count ) {
      var error = { 'errors': { '_id': {
        'path': '_id', 'message': 'duplicate id' }}};
      var form = Apartment.get_edit_form_html( req.body, 'dupl', error );
      return res.send( form );
    }
    var p2 = new Apartment( c );
    error = p2.validateSync();
    if( error ) {
      var form = Apartment.get_edit_form_html( doc, 'dupl', error );
      return res.send( form );      
    }
    //var p3 = req.body;
    c['_id'] = id;
    Apartment.create( c, (err2,res2) => {
      if (err2) {
        return console.error(err2);
      }
      Apartment.countDocuments( {}, (err3, count) => {
        if (err3) { return console.error(err3); }
        return res.send( success_with_document_count( count.toString(), Apartment.thing_en ) );
      });
    });
  });
});

app.get( '/:id/del', (req, res) => {
  var id = req.params.id;
  Apartment.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var s = results[0].get_display_string();
      res.send( jtformgen_confirm_delete( Apartment, s, id ) );
    }
  });
});

app.get( '/:id/del_confirmed', (req, res) => {
  var id = req.params.id;
  Apartment.deleteOne( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    Apartment.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_document_count( count.toString(), Apartment.thing_en ) );
    });
  });
});

app.get( '/load_data', (req, res) => {
  return load_data_for_model( Apartment, res, req );
});

app.get( '/save_data', (req, res) => {
  return save_data_for_model( Apartment, res, req );
});

function strip_meter_numbers( doc, propname )
{
  var a = {};
  for (const [key, value] of Object.entries(doc[propname])) {
    a[key.slice(0,6)] = value;
  }
  doc[propname] = a;
}

function suffix_meter_numbers( doc, propname, s )
{
  var a = {};
  for (const [key, value] of Object.entries(doc[propname])) {
    a[key + s] = value;
  }
  doc[propname] = a;
}

app.get( '/generate_missing', (req, res) => {

  // 001-09-01 – 2 rooms with 66.8 m2
  // 001-09-02 – 2 rooms with 66.8 m2
  // 001-05-03 – 3 rooms with 86.49 m2
  // 001-01-04 – 4 rooms with 107.32 m2
  // 001-14-05 – 3 rooms with 88.95 m2  
  // 001-12-06 – 3 rooms with 88.95 m2
  
  var model_ids = [ "001-09-01", "001-09-02", "001-05-03", "001-01-04", "001-14-05", "001-12-06" ];
  
  var nlevels = 16;
  
  model_ids.forEach( (id) => {
    Apartment.find( {'_id': id }, (err, results) => {
      if (err) { return console.log(err); }
      else {
        var doc = JSON.parse( JSON.stringify( results[0]._doc ) );
        doc.owner_id = '';
        doc.grundbuchnr = '';
        strip_meter_numbers( doc, 'smokedetectors' );
        strip_meter_numbers( doc, 'coldwatermeters' );
        strip_meter_numbers( doc, 'hotwatermeters' );
        strip_meter_numbers( doc, 'heatcostallocators' );
        delete doc['__v'];
        console.log(doc);
        [sunit,slevel,sapttyp] = id.split('-');
        docs = [];
        for (var i = 0; i < nlevels; ++i) {
          var s = i.toString();
          if( 10 > i ) { s = '0' + s; }
          if( s === slevel ) { continue; }
          var id2 = `${sunit}-${s}-${sapttyp}`;
          docs.push( JSON.parse( JSON.stringify( doc ) ) );
          var j = docs.length - 1;
          docs[j]._id = id2;
          suffix_meter_numbers( docs[j], 'smokedetectors', id2 );
          //console.log( docs[docs.length-1] );
        }
        //console.log('-->\n', docs);
        Apartment.create( docs, (err,res2) => {
          if (err) { return console.error(err); }
          Apartment.countDocuments( {}, (err, count) => {
            if (err) { return console.error(err); }
            console.log( count, 'apartments.' );
            //return res.send( success_with_document_count(
            //  count.toString(), Apartment.thing_en ) );
          });
        });
      }
    });
  });
});
