const app = module.exports = require('express')();
const Apartment = require( '../model/apartment' );

const {
  success_with_document_count,
  jtformgen_confirm_delete,
  jtformgen_list_documents } = require('../form/jtformgen.js');

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

app.get( '/:id/edit', (req, res) => {
  var id = req.params.id;
  Apartment.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Apartment.get_edit_form_html( doc, false );
      res.send( form );
    }
  });
});

app.post( '/:id/edit_submit', (req, res) => {
  //var c = util.trimAllFieldsInObjectAndChildren( req.body );
  var c = req.body;
  var a = new Apartment( req.body );
  error = a.validateSync();
  if( error ) {
    var form = Apartment.get_edit_form_html( c, false, error );
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
      var form = Apartment.get_edit_form_html( doc, true );
      res.send( form );
    }
  });
});

app.post( '/:id/dupl_submit', (req, res) => {
  var id_original = req.params.id;
  //var p = util.trimAllFieldsInObjectAndChildren( req.body );
  var p = req.body;
  var id = p.unit_id + '-' + p.year;
  Apartment.countDocuments( {'_id': id }, (err, count) => {
    if (err) {
      return console.error(err);
    }
    if( 0 < count ) {
      var error = { 'errors': { '_id': {
        'path': '_id', 'message': 'duplicate id' }}};
      var form = Apartment.get_edit_form_html( req.body, true, error );
      return res.send( form );
    }
    var p2 = new Apartment( p );
    error = p2.validateSync();
    if( error ) {
      var form = Apartment.get_edit_form_html( doc, true, error );
      return res.send( form );      
    }
    var p3 = req.body;
    p3['_id'] = id;
    Apartment.create( req.body, (err2,res2) => {
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
      res.send( jtformgen_confirm_delete(
        Apartment.route, Apartment.thing_de, s, id ) );
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
  var fs = require('fs');
  var units = JSON.parse( fs.readFileSync(
    `data/${Apartment.route}.json`, 'utf8' ));
  
  Apartment.deleteMany( {}, (err) => {
    if (err) { return console.error(err); }
    Apartment.create( Object.values(units), (err,res2) => {
      if (err) { return console.error(err); }
      Apartment.countDocuments( {}, (err, count) => {
        if (err) { return console.error(err); }
        return res.send( success_with_document_count(
          count.toString(), Apartment.thing_en ) );
      });
    });
  });
});

app.get( '/save_data', (req, res) => {
  Apartment.find( {}, function( err, docs ) {
    if (err) { return console.error(err); }
    var d = {};
    docs.forEach( (doc) => {
      var p = doc._doc;
      delete p['__v'];
      d[p._id] = p;
    });
    
    // MongooseMap converts the haet allocation meter
    // factor number to a string for us, so let's
    // convert it back again to ensure round-trip
    // perfection.
    
    //console.log(d);
    for (const [key, value] of Object.entries(d)) {
      console.log(value.heatcostallocators);
      var hca2 = {};
      value.heatcostallocators.forEach( (value2, key2) => {
        var x = Number(value2[1]);
        console.log( value2[1], '-->', x );
        hca2[key2] = [value2[0],x];
      });
      d[key].heatcostallocators = hca2;
    };
    console.log(d);

    var fs = require('fs');
    var fn = `data/tmp/${Apartment.route}.json`;
    fs.writeFile( fn, JSON.stringify( d, null, 2 ), 'utf8',
      function (err) {
        if (err) { return console.log(err); }
        return res.send( `${Apartment.thing_en} data saved in '${fn}'` );
      }
    );
  });
});

app.get( '/generate_missing', (req, res) => {
  
  // 001-09-02 – 2 rooms with 66.8 m2
  // 001-05-03 – 3 rooms with 86.49 m2
  // 001-01-04 – 4 rooms with 107.32 m2
  // 001-14-05 – 3 rooms with 88.95 m2
  // 001-12-06 – 3 rooms with 88.95 m2
  
  var model_ids = [ "001-01-04", "001-05-03", "001-09-02", "001-12-06" ];

  var nlevels = 16;
  
  model_ids.forEach( (id) => {
    Apartment.find( {'_id': id }, (err, results) => {
      if (err) { return console.log(err); }
      else {
        [sunit,slevel,sapttyp] = id.split(',');
        for (var i = 0; i < nlevels; ++i) {
          var s = i.toString();
          if( 10 > i ) { s = '0' + s; }
          if( s === slevel ) { continue; }
          console.log(s);
         }
        var apt = new Apartment
      }
    });
  
});
