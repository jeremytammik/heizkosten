const Energycostalloc = require('./energycostalloc');

test('test energycostalloc', () => {
  var ids = Object.keys( loaddata.contracts );
  ids.forEach( (id) => {
    var a = new Energycostalloc( id, 2018 );
  }
});
