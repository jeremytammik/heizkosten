//https://stackoverflow.com/questions/33510625/trim-white-spaces-in-both-object-key-and-value-recursively
function trimAllFieldsInObjectAndChildren( o ) {
  return JSON.parse(JSON.stringify(o).replace(/"\s+|\s+"/g, '"'));
}

function jtisodate( d ) {
  if( !d.hasOwnProperty( 'toISOString' ) ) { d = new Date(d); }
  return d.toISOString().substr( 0, 10 );
}

function get_day_before( date_string )
{
  var d = new Date( date_string );
  d.setDate( d.getDate() - 1 );
  return jtisodate( d );
}

function isodate_string_is_before( begin, end )
{
  rc = begin.localeCompare( end ) < 0;
  //console.log( begin, end, rc );
  return rc;
}

function isodate_string_is_before_or_eq( begin, end )
{
  rc = begin.localeCompare( end ) <= 0;
  //console.log( begin, end, rc );
  return rc;
}

function isodate_parse( d ) {
  //console.log( 'isodate_parse', d );
  const ymd = d.split( '-' ).map( parseFloat );
  //const dat = new Date( ymd[0], ymd[1] - 1, ymd[2], 0, 0, 0, 0 );
  const dat = new Date( Date.UTC( ymd[0], ymd[1] - 1, ymd[2], 0, 0, 0 ) );
  //console.log( 'isodate_parse', d, '-->', ymd, '-->', dat );
  return dat;
}

function isodate_first_in_year( year )
{
  return year.toString() + '-01-01';
}

//function last_day_in_year( year )
//{
//  return year.toString() + '-12-31';
//}

// https://stackoverflow.com/questions/1968167/difference-between-dates-in-javascript/53092438#53092438
function date_units_diff(a, b, unit_amounts) {
  var split_to_whole_units = function (milliseconds, unit_amounts) {
    // unit_amounts = list/array of amounts of milliseconds in a
    // second, seconds in a minute, etc., for example "[1000, 60]".
    time_data = [milliseconds];
    for (i = 0; i < unit_amounts.length; i++) {
      time_data.push(parseInt(time_data[i] / unit_amounts[i]));
      time_data[i] = time_data[i] % unit_amounts[i];
    }
    return time_data.reverse();
  };
  if (unit_amounts == undefined) {
    unit_amounts = [1000, 60, 60, 24];
  }
  var utc_a = new Date( a.toUTCString() );
  var utc_b = new Date( b.toUTCString() );
  var diff = (utc_b - utc_a);
  return split_to_whole_units(diff, unit_amounts);
}

// Example of use:
//var d = date_units_diff(new Date(2010, 0, 1, 0, 0, 0, 0), new Date()).slice(0,-2);
//document.write("In difference: 0 days, 1 hours, 2 minutes.".replace(
//   /0|1|2/g, function (x) {return String( d[Number(x)] );} ));

function date_diff_days( a, b ) {
  //console.log( 'date_diff_days', a, b );
  //return date_units_diff(a,b)[0];
  if( !a.hasOwnProperty( 'toISOString' ) ) { a = isodate_parse( a ); }
  if( !b.hasOwnProperty( 'toISOString' ) ) { b = isodate_parse( b ); }
  var diff = b - a;
  diff = Math.abs( diff );
  var ms_per_day = 24 * 60 * 60 * 1000; 
  return diff / ms_per_day;
}

function date_diff_months( a, b ) {
  if( !a.hasOwnProperty( 'toISOString' ) ) { a = isodate_parse( a ); }
  if( !b.hasOwnProperty( 'toISOString' ) ) { b = isodate_parse( b ); }
  var months;
  months = (b.getFullYear() - a.getFullYear()) * 12;
  months -= a.getMonth();
  months += b.getMonth();
  //console.log( 'date_diff_months', a, b, months );
  return months <= 0 ? 0 : months;
}

// https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366

function date_diff_days_2( a, b ) {
  console.log(a);
  var tza = a.getTimezoneOffset();
  var tzb = b.getTimezoneOffset();
  var diff = (b - a) + ((tza - tzb) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function days_in_year( year ) {
  //var begin = new Date( y-1, 11, 31 );
  //var end =  new Date( y, 11, 31 );
  const begin = isodate_first_in_year( year );
  const end = isodate_first_in_year( parseInt(year) + 1 );
  return date_diff_days( begin, end ); // 365 or 366!
}

// Determine duration == overlap of given timespan in given year

function get_duration_in_given_year( ts_begin, ts_end, year ) {

  var no_end = !ts_end;

  //console.log( 'in', ts_begin, ts_end, no_end, year );

  // adjust begin and end to contract begin and end in given year

  //var begin = new Date( year - 1, 11, 31, 1 ); // 12, 0 // 11, 31
  //var end =  new Date( year, 11, 31, 23 ); // `${year}-12-31T22:59:59` // year, 12, 0 // 11, 31

  //console.log( 'year', begin, end );

  var begin = isodate_first_in_year( year );
  var end = isodate_first_in_year( parseInt(year) + 1 );

  ts_begin = jtisodate( ts_begin );
  ts_end = no_end ? end : jtisodate( ts_end );
  
  if( !no_end && ts_end < begin ) {
    end = begin;
  }
  else if( ts_begin > end ) {
    begin = end;
  }
  else {
    if( ts_begin > begin ) {
      begin = ts_begin;
    }
    if( !(no_end) && ts_end < end ) {
      end = ts_end;
    }
  }

  //console.log( '-->', begin, end );

  return [begin, end];
}

function round_to_two_digits( a ) {
  // why not use toFixed(2)? answer:
  // https://stackoverflow.com/questions/566564/math-roundnum-vs-num-tofixed0-and-browser-inconsistencies
  const b = Math.round( (a+0.000000001) * 100) / 100;
  //console.log( 'round_to_two_digits', a, '-->', b );
  return b;
}

// convert comma-separated list of colon-separated pairs to js object mapping key to number
function string_to_object_with_numbers( s ) {
  var d = {};
  var a = s.split( ',' );
  a.forEach( (s) => {
    var b = s.split( ':' );
    d[b[0]] = Number(b[1]);
  });
  return d;
}

module.exports = {
  trimAllFieldsInObjectAndChildren: trimAllFieldsInObjectAndChildren,
  jtisodate: jtisodate,
  get_day_before: get_day_before,
  isodate_string_is_before: isodate_string_is_before,
  isodate_string_is_before_or_eq: isodate_string_is_before_or_eq,
  isodate_first_in_year: isodate_first_in_year,
  date_diff_days: date_diff_days,
  date_diff_months: date_diff_months,
  days_in_year: days_in_year,
  get_duration_in_given_year: get_duration_in_given_year,
  round_to_two_digits: round_to_two_digits,
  string_to_object_with_numbers: string_to_object_with_numbers
}
