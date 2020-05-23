var Person = require('../models/Person');

module.exports.getPersonsByWildcard = function() {
  
var o = {},

self = this;

o.map = function () {
  emit( this.address.locality, 1 );
};

o.reduce = function (k, vals) {
  return vals.length;
};

Person.mapReduce(o, function (err, results) {
  if(err) throw err;
  console.log(results);
});

    /*
var o = {};

o.map = function () {
  emit(Person.address.locality, 1);
}

o.reduce = function (k, vals) {
  return vals.length;
}

Person.collection.mapReduce(o, function (err, results) {
  if(err) throw err;
  console.log(results);
})
*/

};
