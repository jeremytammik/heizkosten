//https://stackoverflow.com/questions/33510625/trim-white-spaces-in-both-object-key-and-value-recursively
function trimAllFieldsInObjectAndChildren( o ) {
  return JSON.parse(JSON.stringify(o).replace(/"\s+|\s+"/g, '"'));
}

function jtisodate( d ) {
  return d.toISOString().substr( 0, 10 );
}

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
  var utc_a = new Date(a.toUTCString());
  var utc_b = new Date(b.toUTCString());
  var diff = (utc_b - utc_a);
  return split_to_whole_units(diff, unit_amounts);
}

// Example of use:
//var d = date_units_diff(new Date(2010, 0, 1, 0, 0, 0, 0), new Date()).slice(0,-2);
//document.write("In difference: 0 days, 1 hours, 2 minutes.".replace(
//   /0|1|2/g, function (x) {return String( d[Number(x)] );} ));

function date_diff_days(a, b) {
  return date_units_diff(a,b)[0];
}

// https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366

function date_diff_days_2(a, b) {
  console.log(a);
  var tza = a.getTimezoneOffset();
  var tzb = b.getTimezoneOffset();
  var diff = (b - a) + ((tza - tzb) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function days_in_year(y) {
  var begin = new Date( y-1, 11, 31 );
  var end =  new Date( y, 11, 31 );
  return date_diff_days( begin, end ); // 365 or 366!
}

// Determine duration == overlap of given timespan in given year
function get_duration_in_given_year( ts_begin, ts_end, year )
{
  //console.log(ts_begin, ts_end);
  
  // adjust begin and end to contract begin and end in given year

  var begin = new Date( year - 1, 11, 31, 1 ); // 12, 0 // 11, 31
  var end =  new Date( year, 11, 31, 23 ); // `${year}-12-31T22:59:59` // year, 12, 0 // 11, 31

  //console.log('year', begin, end);
  
  if(ts_end < begin)
  {
    return begin, begin;
  }
  else if (ts_begin > end)
  {
    return end, end;
  }
  else {
    if(ts_begin > begin) {
      begin = ts_begin;
    }
    if(ts_end < end) {
      end = ts_end;
    }
  }
  //console.log('-->', begin, end);
  
  return [begin, end];
}

function round_to_two_digits( a ) {
  return Math.round( (a+0.000000001) * 100) / 100;
}

exports.trimAllFieldsInObjectAndChildren = trimAllFieldsInObjectAndChildren;
exports.jtisodate = jtisodate;
exports.date_diff_days = date_diff_days;
exports.days_in_year = days_in_year;
exports.get_duration_in_given_year = get_duration_in_given_year;
exports.round_to_two_digits = round_to_two_digits;
