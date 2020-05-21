const { success_with_document_count } = require('../form/jtformgen.js');

function load_data_for_model( model, res, req )
{
  var fs = require('fs');
  var units = JSON.parse( fs.readFileSync(
    `data/${model.route}.json`, 'utf8' ));
  
  model.deleteMany( {}, (err) => {
    if (err) { return console.error(err); }
    model.create( Object.values(units), (err,res2) => {
      if (err) { return console.error(err); }
      model.countDocuments( {}, (err, count) => {
        if (err) { return console.error(err); }
        return res.send( success_with_document_count(
          count.toString(), model.thing_en ) );
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
    
    if( 'apt' === model.route )
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
    var fn = `data/tmp/${model.route}.json`;
    fs.writeFile( fn, JSON.stringify( d, null, 2 ), 'utf8',
      function (err) {
        if (err) { return console.log(err); }
        return res.send( `${model.thing_en} data saved in '${fn}'` );
      }
    );
  });
}

module.exports = {
  load_data_for_model
}
