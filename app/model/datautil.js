//const stringify = require('json-stable-stringify');
const jtformgen = require('../form/jtformgen');

function load_data_for_model( model, res, req )
{
  var fs = require('fs');
  var d = JSON.parse( fs.readFileSync(
    `data/${model.route}.json`, 'utf8' ));
  
  model.deleteMany( {}, (err) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    model.create( Object.values(d), (err,res2) => {
      if (err) { console.error(err); return res.send(err.toString()); }
      model.countDocuments( {}, (err, count) => {
        if (err) { console.error(err); return res.send(err.toString()); }
        return res.send( jtformgen.success_with_document_count(
          '', count.toString(), model.thing_en ) );
      });
    });
  });
}

const assert = function(condition, message) {
  if (!condition)
    throw Error('Assert failed: ' + (message || ''));
};

function convert_string_to_array_and_dict( s ) {
  return s;
}

function save_data_for_model( model, res, req )
{
  model.find( {}, function( err, docs ) {
    if (err) { console.error(err); return res.send(err.toString()); }
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

    if( false /* 'apt' === model.route */ ) {
      // convert string to array and dict:
      // date [, factor], date: amount [, date: amount]...

      var apartment_meter_keys = [
        'smokedetectors',
        'coldwatermeters',
        'hotwatermeters',
        'heatcostallocators'
      ];

      //console.log(d);
      //d2 = {};
      for( const [key, apt] of Object.entries(d) ) {
        for( const [key2, s] of Object.entries(apt) ) {
          if( apartment_meter_keys.includes( key2 ) ) {
            assert( typeof s === 'string' || s instanceof String );
            d[key][key2] = convert_string_to_array_and_dict( s );
          }
        }
      }
      console.log(d);
    }

    const fs = require('fs');
    const ts = new Date().toISOString().substr( 0, 19 ).replace( /[T\:\-]/g, '' );
    const fn = `data/tmp/${model.route}_${ts}.json`;
    const str_json = JSON.stringify( d, null, 2 );
    //const str_json = stringify( d, { space: 2 } );
    fs.writeFile( fn, str_json, 'utf8',
      function (err) {
        if (err) { console.error(err); return res.send(err.toString()); }
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
    if (err) { console.error(err); return res.send(err.toString()); }
    //console.log( results );
    var ids_exist = results.map( (r) => { return r._id; } );
    var n = ids_exist.length;
    //console.log( n, ids_exist );
    ids_exist.forEach( (i) => { delete d[i]; } );
    //console.log( Object.keys( d ).length, 'remain' );
    // add missing person data 
    for (const [key, value] of Object.entries(d)) {
      value.units = '001';
      value.street = 'fecampring';
      value.streetnr = '28';
      value.zip = '79618';
      value.city = 'rheinfelden';
      value.country = 'deutschland';
      value.altaddr = '';
    }
    model.create( Object.values(d), (err,res2) => {
      if (err) { console.error(err); return res.send(err.toString()); }
      var sids = ids_exist.join( ', ' );
      var s = `Following ${n} ids already exist, have been skipped `
        + `and are ignored: ${sids}; please check them!`;
      model.countDocuments( {}, (err, count) => {
        if (err) { console.error(err); return res.send(err.toString()); }
        return res.send( jtformgen.success_with_document_count(
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
