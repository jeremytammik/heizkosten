const app = module.exports = require('express')();

app.get( '/', (req, res) => {
  res.send( 'Hello from herucoal.' );
});

app.use( '/person', require( './rperson' ));
app.use( '/unit', require( './runit' ));
app.use( '/cost', require( './rcost' ));
app.use( '/apt', require( './rapartment' ));

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
  fs.writeFile( "data/tmp/units.json", JSON.stringify(units, null, 2), (err) => {
    if (err) { console.log(err); }
    else { res.send(
      '<p>Hat geklappt, vielen Dank. Hauskosten fuer '
      + unit_id + ' nun fuer ' + n.toString() + ' Jahre erfasst.</p>'
      + '<p><a href="/hauskosten.html">Weitere Hauskosten eingeben...</a></p>');
    }
  });    
});

app.all( '*', (req, res) => {
  res.status( 404 ).send( `not found` );
});
