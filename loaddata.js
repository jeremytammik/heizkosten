var fs = require('fs');
var persons = JSON.parse(fs.readFileSync('data/person.json', 'utf8'));
var apartments = JSON.parse(fs.readFileSync('data/apartment.json', 'utf8'));

exports.persons = persons;
exports.apartments = apartments;
