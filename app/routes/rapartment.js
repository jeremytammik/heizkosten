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
         Apartment.thing_en, '', results, true ) );
    }
  });
});

app.get( '/unit/:uid/list', (req, res) => {
  var uid = req.params.uid;
  Apartment.find( { 'unit_id': uid }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        Apartment.thing_en, ` in ${uid}`, results, false ) );
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
      p.year = p.year.toString();
      delete p['__v'];
      d[p._id] = p;
    });
    var fs = require('fs');
    var fn = `data/tmp/${Apartment.route}.json`;
    fs.writeFile( fn,
      JSON.stringify( d, null, 2 ), 'utf8',
      function (err) {
        if (err) { return console.log(err); }
        return res.send( `${Apartment.thing_en} data saved in '${fn}'` );
      }
    );
  });
});
