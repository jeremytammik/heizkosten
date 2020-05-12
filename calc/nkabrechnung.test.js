const loaddata = require('../data/loaddata');
const Nkabrechnung = require('./nkabrechnung');

test('test nkabreaachnung', () => {
  var contract = loaddata.contracts["001-01-04-2018"];
  var apartment = loaddata.apartments[contract.apartment];
  var unit = loaddata.units[apartment.unit_id];
  var a = new Nkabrechnung( unit, contract, 2018, 907.54 );
  console.log(a);
  expect(a.nkvorauszahlung).toBe(2208);
  expect(a.rauchmelderwartung).toBe(20);
  expect(a.grundsteuer).toBe(278.44);
  expect(a.hausgeld_umlagefaehig).toBe(828.66);
});
