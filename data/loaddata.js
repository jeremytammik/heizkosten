var fs = require('fs');
var units = JSON.parse(fs.readFileSync('data/unit.json', 'utf8'));
var persons = JSON.parse(fs.readFileSync('data/person.json', 'utf8'));
var apartments = JSON.parse(fs.readFileSync('data/apartment.json', 'utf8'));
var contracts = JSON.parse(fs.readFileSync('data/contract.json', 'utf8'));

exports.units = units;
exports.persons = persons;
exports.apartments = apartments;
exports.contracts = contracts;
