var fs = require( 'fs' );
var vCard = require( 'vcf' );

const { date_with_optional_time_format } = require( './jtregex' );

function json_parse_date_reviver(key, value) {
  if (typeof value === "string" && date_with_optional_time_format.test(value)) {
    return new Date(value);
  }
  return value;
}

// https://weblog.west-wind.com/posts/2014/Jan/06/JavaScript-JSON-Date-Parsing-and-real-Dates
// https://github.com/RickStrahl/json.date-extensions

var units = JSON.parse(fs.readFileSync('data/unit.json', 'utf8'));
var costs = JSON.parse(fs.readFileSync('data/cost.json', 'utf8'));
var persons = JSON.parse(fs.readFileSync('data/person.json', 'utf8'));
var apartments = JSON.parse(fs.readFileSync('data/apt.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('data/contract.json', 'utf8'), json_parse_date_reviver);
var visiting_cards = vCard.parse( fs.readFileSync('data/m03.vcf', 'utf8') );

//console.log(visiting_cards);

exports.json_parse_date_reviver = json_parse_date_reviver;
exports.units = units;
exports.costs = costs;
exports.persons = persons;
exports.apartments = apartments;
exports.contracts = contracts;
exports.visiting_cards = visiting_cards;
