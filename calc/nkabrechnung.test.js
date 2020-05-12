const loaddata = require('./loaddata');
const nkabrechnung = require('./nkabrechnung');

test('test nkabreaachnung', () => {
  var contract = loaddata.contracts["001-01-04-2018"];
  var apartment = loaddata.apartments[value.apartment];
  var unit = loaddata.units[apartment.unit_id];
  var a = new Nkabrechnung( unit, value, 2018, 0 );
});
