var fs = require( 'fs' );
//var vCard = require( 'vcf' );
//var util = require( 'util' )

/* --- Date reviver ---
const { date_with_optional_time_format } = require( './jtregex' );

function json_parse_date_reviver(key, value) {
  if (typeof value === "string" && date_with_optional_time_format.test(value)) {
    return new Date(value);
  }
  return value;
}

*/

/* --- VCF reader ---

function inspect( value ) {
  return util.inspect( value, {
    colors: process.stdout.isTTY,
    depth: null,
  })
}

function read_vcf_value( v, s )
{
  var p = v.get(s);
  return p
  ? s + ' \'' + p.valueOf().replace( /;+/g, ' ' ).trim() + '\''
  : '';
}

function read_vcf_property_text( v, s )
{
  var p = v.get(s);
  return p
  ? s + ' \'' + p.text + '\''
  : '';
}

function read_vcf()
{
  var cards = vCard.parse( fs.readFileSync( 'data/m03iconv.vcf' ) );
  //console.log( vCard.normalize( cards ) );
  cards.forEach( (v) => {
    console.log( inspect( v ) )

    //console.log( v.toJSON() );
    var d = v.data;
    var n = read_vcf_property_text( v, 'n' ); // = d.n.valueOf().replace( /;+/g, ' ' ).trim();
    var fn = read_vcf_property_text( v, 'fn' );
    //var tel = read_vcf_value( v, 'tel' );
    //var notiz = d.notiz.valueOf().replace( /;+/g,  ' ').trim();
    //expect( n ).toMatch( regex_valid_name_chars );
    console.log( n, fn );
  });
}

--- end of VCF reader --- */

/*
function convert_tsv_to_json()
{
  var fn = '/j/doc/people/otto/heizkosten/mieter/mieter01cleanup.tsv';
  var tsv = fs.readFileSync( fn );
  var lines = tsv.toString().split( '\n' );
  var n = lines.length;
  console.log( `read ${n} lines from ${fn}` );
  lines = lines.slice( 1 );
  d = {};
  lines.forEach( (lin) => {
    var a = lin.split( '\t' )
      .map( (s) => {return s.trim();} );
    var o = {};
    o.firstname = a[0];
    o.lastname = a[1];
    var id = o.firstname + '_' + o.surname;
    id = id.replace( '*', '' );
    id = id.replace( /\(Geb\./, '_' );
    id = id.replace( /[\(\)\&\ \.\-]/g, '_' );
    id = id.replace( /__+/g, '_' );
    id = id.trim( '_' );
    id = id.toLowerCase();
    o._id = id
    o.telephone = a.slice( 2, 5 ).filter( (s) => { return Boolean( s ); } ).join( ', ' );
    o.email = a[5];
    o.iban = a[6];
    d[id] = o;
    if(a[0].slice(0,3)==='oez'){
      console.log(a, o);
    }
  });
  fs.writeFileSync( 'data/mieter.json', JSON.stringify( d, null, 2 ) );
}
*/

/*
function add_owners_to_apartments()
{
  var fs = require( 'fs' );
  var apartments = JSON.parse( fs.readFileSync( 'data/apt.json', 'utf8' ) );
  var apartments_with_owners = JSON.parse( fs.readFileSync( 'data/burcu/apt_20200614085236.json', 'utf8' ) );
  
  for( const [key, value] of Object.entries( apartments ) ) {
    apartments[key].owner_id = apartments_with_owners[key].owner_id;
  }
  var ts = new Date().toISOString().substr( 0, 19 ).replace( /[T\:\-]/g, '' );
  var fn = `data/tmp/apt_${ts}.json`;
  fs.writeFileSync( fn, JSON.stringify( apartments, null, 2 ) );
}
*/

// https://weblog.west-wind.com/posts/2014/Jan/06/JavaScript-JSON-Date-Parsing-and-real-Dates
// https://github.com/RickStrahl/json.date-extensions

var units = JSON.parse(fs.readFileSync('data/unit.json', 'utf8'));
var costs = JSON.parse(fs.readFileSync('data/cost.json', 'utf8'));
var persons = JSON.parse(fs.readFileSync('data//person.json', 'utf8'));
//var tenants = JSON.parse(fs.readFileSync('data/mieter.json', 'utf8'));
var apartments = JSON.parse(fs.readFileSync('data/apt.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('data/contract.json', 'utf8')); // , json_parse_date_reviver);

//var visiting_cards = vCard.parse( fs.readFileSync('data/m03.vcf', 'utf8') );
//console.log(visiting_cards);

//exports.json_parse_date_reviver = json_parse_date_reviver;

exports.units = units;
exports.costs = costs;
exports.persons = persons;
//exports.tenants = tenants;
exports.apartments = apartments;
exports.contracts = contracts;

//exports.visiting_cards = visiting_cards;
//read_vcf();

//convert_tsv_to_json();

//add_owners_to_apartments();

