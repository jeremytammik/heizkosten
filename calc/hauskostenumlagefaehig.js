// hauskostenumlagefaehig.js
//
// hauskosten umlagefaehig
//
// Copyright 2020 by Jeremy Tammik.
//

/*

hier die umlagefähige kosten 2018:
allgemeinstrom: 1.186,14 (summieren)
müllgebühren hausmeister: 39,60 (summieren)
streu- und putzmittel: 1.195,92 (summieren)
aussenanlage pflege: 1.823,92 (summieren)
versicherungen: 15.437,93 (summieren)
niederschlagswasser: 368,10 (summieren)
trinkwasseruntersuchung: 152,72 (summieren)
material und hilfsstoffe: 368,75 (summieren)
reinigung: 8.700,00 (summieren)
hausmeister sozialabgaben: 1.962,50 (summieren)
hausservice fremdfirmen: 13.955,00 (summieren)
lift umlagefähig: 5.850,90 (summieren)
kabelgebühren: 7004,16 (anteilig auf 96 whg)
feuerlöscher wartung: 5.075,48 (summieren)
wartung eingangstüren: 452,44 (summieren)
wartung lüftungsanlage: 249,90 (summieren)

die kabelgebühr wird tatsächlich als einziges pro whg umgelegt....

*/

const loaddata = require('./loaddata');
const util = require('./util');

function Hauskostenumlagefaehig(
  unit,
  contract )
{
}

module.exports = Hauskostenumlagefaehig;
