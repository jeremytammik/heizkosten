var mongoose = require('mongoose');
var Person = require( '../model/person' );

PersonService = {

  findAll : function(req, res){
    Person.find({},function(err, results) {
      return res.send(results);
    });
  },

  findById : function(req, res){
    var id = req.params.id;
    Person.findOne({'_id':id},function(err, result) {
      return res.send(result);
    });
  },

  add : function(req, res) {
    Person.create(req.body, function (err, door) {
      if (err) return console.log(err);
      return res.send(door);
    });
  },

  insertBatch : function(req, res) {
    console.log('Insert batch');
    Person.insertMany(req.body, function (err, door) {
      if (err) return console.log(err);
      return res.send(door);
    });
  },

  update : function(req, res) {
    var id = req.params.id;
    //console.log(req.body);
    console.log('Updating ' + id);
    Person.update({"_id":id}, req.body, {upsert:true},
      function (err, numberAffected) {
        if (err) return console.log(err);
        console.log('Updated %s instances', numberAffected.toString());
        return res.sendStatus(202);
    });
  },

  delete : function(req, res){
    var id = req.params.id;
    Person.remove({'_id':id},function(err,result) {
      return res.send(result);
    });
  },

  findAllForUnit : function(req, res){
    var uid = req.params.uid;
    Person.find({'units': {$in : [uid]}},function(err, results) {
      return res.send(results);
    });
  },

  // This one is more complex, since a person may be assigned multiple units.
  // The person should only be removed if it is assigned only the single specified unit.
  //deleteAllForUnit : function(req, res){
  //  var uid = req.params.uid;
  //  Person.remove({'unit_id':uid},function(err, results) {
  //    return res.send(results);
  //  });
  //}
};

module.exports = PersonService;
