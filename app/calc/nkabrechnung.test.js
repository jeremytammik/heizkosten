const nkabrechnung = require('./nkabrechnung');

test('test nkabrechnung', () => {
  var contract_id = "001-01-04-2018";
  var a = nkabrechnung.get_nkabrechnung( contract_id, 2018, 907.54 );
  //console.log(a);
  expect(a.nkvorauszahlung).toBe(2208);
  expect(a.hausgeld_umlagefaehig).toBe(828.66);
  expect(a.grundsteuer).toBe(278.44);
  expect(a.rauchmelderwartung).toBe(20);
  expect(a.nebenkosten).toBe(2034.64);
  expect(a.credit).toBe(173.36);
  expect(a.new_nkvorauszahlung_per_month).toBe(168.93);
  //console.log( a.report_html );
});
