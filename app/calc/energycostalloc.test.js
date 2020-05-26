const loaddata = require('../../data/loaddata');
const Energycostalloc = require('./energycostalloc');

test( 'test energycostalloc', () => {
  var ids = ["001-12-06-2018"]; // Object.keys( loaddata.contracts );
  ids.forEach( (id) => {
    var a = new Energycostalloc( id, 2018 );
  });
});
