var fs = require( 'fs' );
var vCard = require( 'vcf' );

const { date_with_optional_time_format } = require( './jtregex' );

function json_parse_date_reviver(key, value) {
  if (typeof value === "string" && date_with_optional_time_format.test(value)) {
    return new Date(value);
  }
  return value;
}

function read_vcf_value( v, s )
{
  var p = v.get(s);
  return p
  ? s + ' \'' + p.valueOf().replace( /;+/g, ' ' ).trim() + '\''
  : '';
}

function read_vcf()
{
  var cards = vCard.parse( fs.readFileSync( 'data/m03iconv.vcf' ) );
  //console.log( vCard.normalize( cards ) );
  cards.forEach( (v) => {
    //console.log( v.toJSON() );
    var d = v.data;
    var n = read_vcf_value( v, 'n' ); // = d.n.valueOf().replace( /;+/g, ' ' ).trim();
    var fn = read_vcf_value( v, 'fn' );
    var tel = read_vcf_value( v, 'tel' );
    //var notiz = d.notiz.valueOf().replace( /;+/g,  ' ').trim();
    //expect( n ).toMatch( regex_valid_name_chars );
    console.log( n, fn, tel );
  });
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

read_vcf();