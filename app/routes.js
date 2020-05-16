module.exports = function(app) {
  var PersonService = require('../controller/person_v1');
  app.get('/api/v1/person', PersonService.findAll);
  app.get('/api/v1/person/:id', PersonService.findById);
  app.post('/api/v1/person', PersonService.add);
  app.put('/api/v1/person/:id', PersonService.update);
  app.delete('/api/v1/person/:id', PersonService.delete);
  app.get('/api/v1/person/unit/:uid', PersonService.findAllForUnit);

  var CostService = require('../controller/cost_v1');
  app.get('/api/v1/cost', CostService.findAll);
  app.get('/api/v1/cost/:id', CostService.findById);
  app.post('/api/v1/cost', CostService.add); // is this used any longer at all, now that update3 is available?
  //app.post('/api/v1/cost', CostService.insertBatch); // add multiple records
  app.put('/api/v1/cost/:id', CostService.update3); // added {upsert:true} option
  app.delete('/api/v1/cost/:id', CostService.delete);
  app.get('/api/v1/cost/unit/:uid', CostService.findAllForUnit);
  app.delete('/api/v1/cost/unit/:uid', CostService.deleteAllForUnit);
}
