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

exports.date_diff_days = date_diff_days;
