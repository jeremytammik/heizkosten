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

module.exports = {
  load_data_for_model
}
