const jtregex = require( './jtregex' );

const jtvalidators = {

// validate meter data: date [, factor], date: amount [, date: amount]...
validate_meter_data: function( s, with_factor ) {
  var a = s.split( ',' );
  if( !jtregex.valid_date.test( a[0].trim() ) ) { return false; }
  var begin = 1;
  if( with_factor ) {
    if( !jtregex.valid_real_number.test( a[1].trim() ) ) { return false; }
    begin = 2;
  }
  a.slice( begin ).forEach( (p) => {
    var b = p.split( ':' );
    if( !jtregex.valid_date.test( b[0].trim() ) ) { return false; }
    if( !jtregex.valid_real_number.test( b[1].trim() ) ) { return false; }
  });
  return true;
},

validate_dict_date_amount_string: function( s ) {
  //console.log(s);
  var a = s.split( ',' );
  a.forEach( (p) => {
    var b = p.split( ':' );
    if( !jtregex.valid_date.test( b[0].trim() ) ) { return false; }
    if( !jtregex.valid_real_number.test( b[1].trim() ) ) { return false; }
  });
  return true;
}

};

module.exports = jtvalidators;
