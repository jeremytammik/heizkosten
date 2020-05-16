const app = module.exports = require('express')();

app.get( '/', (req, res) => {
  res.send( 'Hello from the heizkosten database.' );
});

app.use( '/person', require( './rperson' ));

var Unit = require( '../../model/unit' );
var Cost = require( '../../model/cost' );
//require( './model/apartment' );
//require( './model/consumption' );
//require( './model/occupant' );

var mongoose = require( 'mongoose' );

console.log( 'Database models', mongoose.connection.modelNames() );

var CostService = require( '../../controller/cost_v1' );
app.get('/api/v1/cost', CostService.findAll);
app.get('/api/v1/cost/:id', CostService.findById);
app.post('/api/v1/cost', CostService.add); // is this used any longer at all, now that update3 is available?
//app.post('/api/v1/cost', CostService.insertBatch); // add multiple records
app.put('/api/v1/cost/:id', CostService.update3); // added {upsert:true} option
app.delete('/api/v1/cost/:id', CostService.delete);
app.get('/api/v1/cost/unit/:uid', CostService.findAllForUnit);
app.delete('/api/v1/cost/unit/:uid', CostService.deleteAllForUnit);

var units = { "001": { "hausgeld_umlagefaehig_eur": {} }};

app.post( '/hauskosten_submit', (req, res) => {
  var h = req.body;
  var unit_id = h.unit;
  delete h.unit;
  var year = h.jahr;
  delete h.jahr;
  units[unit_id].hausgeld_umlagefaehig_eur[year] = h;
  var n = Object.keys(units[unit_id].hausgeld_umlagefaehig_eur).length;
  var fs = require('fs');
  fs.writeFile( "form/units.json", JSON.stringify(units, null, 2), (err) => {
    if (err) { console.log(err); }
    else { res.send(
      '<p>Hat geklappt, vielen Dank. Hauskosten fuer '
      + unit_id + ' nun fuer ' + n.toString() + ' Jahre erfasst.</p>'
      + '<p><a href="/hauskosten.html">Weitere Hauskosten eingeben...</a></p>');
    }
  });    
});

//app.all( '*', (req, res) => {
//  res.status( 404 ).send( `not found` );
//});
