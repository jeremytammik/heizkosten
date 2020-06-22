const app = module.exports = require('express')();
const util = require( '../calc/util' );
const datautil = require('../model/datautil');
const jtformgen = require('../form/jtformgen');
const Person = require( '../model/person' );
const Apartment = require( '../model/apartment' );

app.get( '/', (req, res) => {
  Apartment.find( {}, (err, results) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    else {
      return res.send( jtformgen.jtformgen_list_documents(
        Apartment, '', results, false, false ) );
    }
  });
});

app.get( '/load_data', (req, res) => {
  return datautil.load_data_for_model( Apartment, res, req );
});

app.get( '/save_data', (req, res) => {
  return datautil.save_data_for_model( Apartment, res, req );
});

function strip_meter_numbers( doc, propname )
{
  var a = {};
  for (const [key, value] of Object.entries(doc[propname])) {
    a[key.slice(0,6) + '0000'] = value;
  }
  doc[propname] = a;
}

function suffix_meter_numbers( doc, propname, s )
{
  var a = {};
  for (const [key, value] of Object.entries(doc[propname])) {
    a[key.replace('0000', s)] = value;
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

  var model_ids = [ "001-09-01", "001-09-02",
    "001-05-03", "001-01-04", "001-14-05", "001-12-06" ];

  var nlevels = 16;

  Apartment.find( {'_id': {$in : model_ids } }, (err, results) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    else {
      docs = [];
      results.forEach( (x) => {
        var doc = JSON.parse( JSON.stringify( x._doc ) );
        doc.owner_id = 'unknown_owner_id';
        doc.grundbuchnr = '';
        strip_meter_numbers( doc, 'smokedetectors' );
        strip_meter_numbers( doc, 'coldwatermeters' );
        strip_meter_numbers( doc, 'hotwatermeters' );
        strip_meter_numbers( doc, 'heatcostallocators' );
        delete doc['__v'];
        //console.log(doc);
        [sunit,slevel,sapttyp] = doc._id.split('-');
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
      });
      //console.log('-->\n', docs);
      Apartment.create( docs, (err,res2) => {
        if (err) { console.error(err); return res.send(err.toString()); }
        Apartment.countDocuments( {}, (err, count) => {
          if (err) { console.error(err); return res.send(err.toString()); }
          //console.log( count, 'apartments.' );
          return res.send( jtformgen.success_with_document_count(
            '', count.toString(), Apartment.thing_en ) );
        });
      });
    }
  });
});

app.get( '/unit/:uid/list', (req, res) => {
  var uid = req.params.uid;
  Apartment.find( { 'unit_id': uid }, (err, results) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    else {
      var url_filter = `/apt/unit/${uid}/list`;
      return res.send( jtformgen.jtformgen_list_documents(
        Apartment, ` in ${uid}`, results, false, false, url_filter ) );
    }
  });
});

app.post( '/unit/:uid/list', (req, res) => { // list_filtering_using_match
  var uid = req.params.uid;
  var sfilter = req.body.filter;
  var sfilter2 = sfilter ? sfilter : '.*'; // avoid mongo error on empty filter string
  var o = {};

  // create string representation for matching
  // skip smoke detectors; they have no unique numbers

  o.map = `function () {\
var s = this._id + ' ' + this.owner_id
+ ' ' + this.grundbuchnr\
+ ' ' + Object.keys(this.coldwatermeters).join(' ')\
+ ' ' + Object.keys(this.hotwatermeters).join(' ')\
+ ' ' + Object.keys(this.heatcostallocators).join(' ')\
+ ' ' + this.room_count.toString() + ' rooms '\
+ this.area_m2.toString() + ' m2';\
emit( this._id, /${sfilter2}/i.test(s) );\
};`;

  o.reduce = 'function (k, vals) { return Array.sum(vals); };';
  o.query = { unit_id : uid};
  Apartment.mapReduce( o, function (err, results) {
    if (err) { console.error(err); return res.send(err.toString()); }
    else {
      var ids = [];
      results.results.forEach( (r) => {
        if( r.value ) { ids.push( r._id ); }
      });
      Apartment.find( { '_id': {$in : ids} }, (err, results) => {
        var url_filter = `/apt/unit/${uid}/list`;
        var matching = sfilter
          ? ` matching "${sfilter}"`
          : '';
        return res.send( jtformgen.jtformgen_list_documents(
          Apartment, `${matching} in ${uid}`, results,
          false, false, url_filter, sfilter ) );
      });
    }
  });
});

app.get( '/:id', (req, res) => {
  var id = req.params.id;
  Apartment.find( {'_id': id }, (err, results) => {
    if (err) { console.error(err); return res.send(err.toString()); }
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
    if (err) { console.error(err); return res.send(err.toString()); }
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
  var id = req.params.id;
  var c = util.trimAllFieldsInObjectAndChildren( req.body );
  //console.log('req.body', c);
  c.smokedetectors = convert_to_dict(c,'smokedetectors');
  c.coldwatermeters = convert_to_dict(c,'coldwatermeters');
  c.hotwatermeters = convert_to_dict(c,'hotwatermeters');
  c.heatcostallocators = convert_to_dict(c,'heatcostallocators');
  //console.log('c:', c);

  var a = new Apartment( c );
  error = a.validateSync();
  if( error ) { console.log('a:', a, '\nerror:', error); }

  if( error ) {
    var d = a._doc;
    d._id = id;
    var form = Apartment.get_edit_form_html( d, 'edit', error );
    return res.send( form );
    //res.redirect( `/apt/${id}/edit` ); // how to pass along error as well?
  }

  Person.count( { _id: a.owner_id }, (err, count) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    if( 0 == count ) {
      validation_errors = { errors: { owner_id: { path: 'owner_id', message: a.owner_id + ' is not a valid person_id' }}};
      var d = a._doc;
      d._id = id;
      var form = Apartment.get_edit_form_html( d, 'edit', validation_errors );
      return res.send( form );
    }
    console.log(`updating ${id}:`, c);
    Apartment.updateOne( { "_id": id }, c, (err,res2) => {
      if (err) { console.error(err); return res.send(err.toString()); }
      Apartment.countDocuments( {}, (err, count) => {
        if (err) { console.error(err); return res.send(err.toString()); }
        return res.send( jtformgen.success_with_document_count(
          '', count.toString(), Apartment.thing_en ) );
      });
    });
  }); 
});

app.get( '/:id/dupl', (req, res) => {
  var id = req.params.id;
  Apartment.find( {'_id': id }, (err, results) => {
    if (err) { console.error(err); return res.send(err.toString()); }
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
  c.smokedetectors = convert_to_dict(c,'smokedetectors');
  c.coldwatermeters = convert_to_dict(c,'coldwatermeters');
  c.hotwatermeters = convert_to_dict(c,'hotwatermeters');
  c.heatcostallocators = convert_to_dict(c,'heatcostallocators');
  //console.log(c);

  var id = c._id;
  Apartment.countDocuments( {'_id': id }, (err, count) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    if( 0 < count ) {
      var error = { 'errors': { '_id': {
        'path': '_id', 'message': 'duplicate id' }}};
      var form = Apartment.get_edit_form_html( req.body, 'dupl', error );
      return res.send( form );
    }
    var a = new Apartment( c );
    error = a.validateSync();
    if( error ) {
      var d = a._doc;
      d._id = id_original;
      var form = Apartment.get_edit_form_html( d, 'dupl', error );
      return res.send( form );
    }
    //c['_id'] = id;
    Apartment.create( c, (err2,res2) => {
      if (err2) { return console.error(err2); }
      Apartment.countDocuments( {}, (err3, count) => {
        if (err3) { return console.error(err3); }
        return res.send( jtformgen.success_with_document_count(
          '', count.toString(), Apartment.thing_en ) );
      });
    });
  });
});

app.get( '/:id/del', (req, res) => {
  var id = req.params.id;
  Apartment.find( {'_id': id }, (err, results) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    else {
      var s = results[0].get_display_string();
      res.send( jtformgen.jtformgen_confirm_delete( Apartment, s, id ) );
    }
  });
});

app.get( '/:id/del_confirmed', (req, res) => {
  var id = req.params.id;
  Apartment.deleteOne( {'_id': id }, (err, results) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    Apartment.countDocuments( {}, (err, count) => {
      if (err) { console.error(err); return res.send(err.toString()); }
      return res.send( jtformgen.success_with_document_count(
        '', count.toString(), Apartment.thing_en ) );
    });
  });
});
