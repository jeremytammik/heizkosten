const jtregex = require( './jtregex' );

const jtvalidators = {

// validate meter data: date [, factor], date: amount [, date: amount]...
validate_meter_data: function( s, with_factor ) {
  var a = s.trim().split( ',' );
  if( !jtregex.valid_date.test( a[0].trim() ) ) { return false; }
  var begin = 1;
  if( with_factor ) {
    if( !jtregex.valid_real_number.test( a[1].trim() ) ) { return false; }
    begin = 2;
  }
  var a2 = a.slice( begin );
  var n = a2.length;
  for( let i = 0; i < n; ++i ) {
    var b = a2[i].split( ':' );
    if( !(2 === b.length) ) { return false; }
    if( !jtregex.valid_date.test( b[0].trim() ) ) { return false; }
    if( !jtregex.valid_real_number.test( b[1].trim() ) ) { return false; }
  };
  return true;
},

validate_begin_end_date: function( s ) {
  if( !jtregex.valid_date.test( s ) ) { return false; }
  //const mon = 1 * str.slice(5, 7);
  //const mid_month_begin_date = [16,15,16,16,16,...]
  const day = 1 * s.slice(8, 10);
  return 1 == day || 15 == day || 16 == day;
},

validate_dict_date_amount_string: function( s ) {
  var a = s.trim().split( ',' );
  var n = a.length;
  for( let i = 0; i < n; ++i ) {
    var b = a[i].split( ':' );
    if( !(2 === b.length) ) { return false; }
    if( !this.validate_begin_end_date( b[0].trim() ) ) { return false; }
    if( !jtregex.valid_real_number.test( b[1].trim() ) ) { return false; }
  }
  return true;
}

};

module.exports = jtvalidators;
