const { success_with_document_count } = require('../form/jtformgen.js');

function load_data_for_model( model, res, req )
{
  var fs = require('fs');
  var d = JSON.parse( fs.readFileSync(
    `data/${model.route}.json`, 'utf8' ));
  
  model.deleteMany( {}, (err) => {
    if (err) { return console.error(err); }
    model.create( Object.values(d), (err,res2) => {
      if (err) { return console.error(err); }
      model.countDocuments( {}, (err, count) => {
        if (err) { return console.error(err); }
        return res.send( success_with_document_count(
          '', count.toString(), model.thing_en ) );
      });
    });
  });
}

function save_data_for_model( model, res, req )
{
  model.find( {}, function( err, docs ) {
    if (err) { return console.error(err); }
    var d = {};
    docs.forEach( (doc) => {
      var p = doc._doc;
      if( 'cost' === model.route ) { p.year = p.year.toString(); }
      delete p['__v'];
      d[p._id] = p;
    });
    
    if( false /*'apt' === model.route*/ ) // currently using Mixed==Object, not MongooseMap
    {
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
    }

    var fs = require('fs');
    var ts = new Date().toISOString().substr( 0, 19 ).replace( /[T\:\-]/g, '' );
    var fn = `data/tmp/${model.route}_${ts}.json`;
    fs.writeFile( fn, JSON.stringify( d, null, 2 ), 'utf8',
      function (err) {
        if (err) { return console.log(err); }
        return res.send( `${model.thing_en} data saved in '${fn}'` );
      }
    );
  });
}

function load_tenant_data_for_model( model, res, req )
{
  var fs = require('fs');
  var d = JSON.parse( fs.readFileSync(
    `data/mieter.json`, 'utf8' ));
  
  var ids = Object.keys( d );
  console.log( ids.length );
  
  model.find( { '_id': {$in : ids} }, (err, results) => {
    if (err) { return console.error(err); }
    console.log( results );
    var ids_exist = results.map( (r) => { return r._id; } );
    var n = ids_exist.length;
    console.log( n, ids_exist );
    ids_exist.forEach( (i) => { delete d[i]; } );
    console.log( Object.keys( d ).length, 'remain' );
    // add missing person data 
    for (const [key, value] of Object.entries(d)) {
      value.units = '001';
      value.street = 'fecampring';
      value.streetnr = '28';
      value.zip = '79618';
      value.city = 'rheinfelden';
      value.country = 'deutschland';
    }
    model.create( Object.values(d), (err,res2) => {
      if (err) { return console.error(err); }
      var sids = ids_exist.join( ', ' );
      var s = `Following ${n} ids already exist, have been skipped `
        + `and are ignored: ${sids}; please check them!`;
      model.countDocuments( {}, (err, count) => {
        if (err) { return console.error(err); }
        return res.send( success_with_document_count(
          s, count.toString(), model.thing_en ) );
      });
    });
  });
}

module.exports = {
  load_data_for_model,
  save_data_for_model,
  load_tenant_data_for_model
}
