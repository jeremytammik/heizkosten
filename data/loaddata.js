// https://mariusschulz.com/blog/deserializing-json-strings-as-javascript-date-objects
//const date_time_format = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const date_format = /^\d{4}-\d{2}-\d{2}$/;

function json_parse_date_reviver(key, value) {
  if (typeof value === "string" && date_format.test(value)) {
    return new Date(value);
  }
  return value;
}

// https://weblog.west-wind.com/posts/2014/Jan/06/JavaScript-JSON-Date-Parsing-and-real-Dates
// https://github.com/RickStrahl/json.date-extensions

var fs = require('fs');
var units = JSON.parse(fs.readFileSync('data/unit.json', 'utf8'));
var persons = JSON.parse(fs.readFileSync('data/person.json', 'utf8'));
var apartments = JSON.parse(fs.readFileSync('data/apartment.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('data/contract.json', 'utf8'), json_parse_date_reviver);

exports.json_parse_date_reviver = json_parse_date_reviver;
exports.units = units;
exports.persons = persons;
exports.apartments = apartments;
exports.contracts = contracts;
