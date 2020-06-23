const app = module.exports = require('express')();

app.get( '/', (req, res) => {
  res.send( 'Hello from herucoal.' );
});

app.use( '/apt', require( './rapt' ));
app.use( '/calc', require( './rcalc' ));
app.use( '/contract', require( './rcontract' ));
app.use( '/cost', require( './rcost' ));
app.use( '/person', require( './rperson' ));
app.use( '/unit', require( './runit' ));

app.all( '*', (req, res) => {
  res.status( 404 ).send( `not found` );
});
