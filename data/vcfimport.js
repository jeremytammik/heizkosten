var fs = require( 'fs' );
var vcf = require( 'vcf' );

var visiting_cards = vcf.parse( fs.readFileSync('data/m30.vcf', 'utf8') );

exports.visiting_cards = visiting_cards;
